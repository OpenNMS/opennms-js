import {IHasHTTP} from '../api/IHasHTTP';
import {IOnmsHTTP} from '../api/IOnmsHTTP';
import {OnmsError} from '../api/OnmsError';
import {OnmsServer} from '../api/OnmsServer';

import {log} from '../api/Log';

/** @hidden */
// tslint:disable-next-line
const moment = require('moment');

/** @hidden */
// tslint:disable-next-line
import {Moment} from 'moment';
import { Util } from '../internal/Util';

/**
 * A base DAO useful for subclassing to create real DAOs.  This differs from
 * the [[AbstractDAO]] in that it doesn't have a "default" interface for
 * dealing with model objects, it only provides core conveniences.
 *
 * @category DAO
 */
export abstract class BaseDAO {
  /**
   * The [[IOnmsHTTP]] implementation to use internally when making DAO requests.
   * @hidden
   */
  private httpImpl: IOnmsHTTP;

  /**
   * The [[OnmsServer]] that was last updated/retrieved.  This is used to check whether caches
   * need to be invalidated.
   * @hidden
   * @param serverImpl The last [[OnmsServer]] seen.
   */
  private serverImpl?: OnmsServer | null;

  /**
   * Construct a DAO instance.
   *
   * @param impl - The HTTP implementation to use.  It is also legal to pass any object
   *               conforming to the [[IHasHTTP]] interface (like a [[Client]]).
   */
  constructor(impl: IOnmsHTTP | IHasHTTP) {
    if ((impl as IHasHTTP).http) {
      impl = (impl as IHasHTTP).http;
    }
    this.httpImpl = impl as IOnmsHTTP;
    this.serverImpl = this.httpImpl.server;
  }

  /**
   * The HTTP implementation to use internally when making DAO requests.
   */
  public get http() {
    this.validateServer();
    return this.httpImpl;
  }

  public set http(impl: IOnmsHTTP) {
    this.httpImpl = impl;
  }

  /**
   * The [[OnmsServer]] being connected to by this DAO.
   */
  public get server(): OnmsServer {
    this.validateServer();
    if (this.serverImpl) {
      return this.serverImpl;
    }
    throw new OnmsError('No server configured!');
  }

  public set server(s: OnmsServer) {
    this.httpImpl.server = s;
    this.serverImpl = s;
    this.onSetServer(s || undefined);
  }

  /**
   * Called whenever accessing the HTTP impl or server to validate whether it has changed.
   * @hidden
   */
  protected validateServer() {
    if (this.serverImpl) {
      // we have a cached server, evaluate if it is still correct

      if (this.httpImpl) {
        // we have both a locally set server and a server in the HTTP implementation

        if (this.serverImpl.equals(this.httpImpl.server || undefined)) {
          // if they match, we're fine
          return;
        } else {
          // if not, cache the HTTP impl version locally and call `onSetServer`
          this.serverImpl = this.httpImpl.server;
          this.onSetServer(this.serverImpl || undefined);
        }

      } else {
        // HTTP impl server has become unset or HTTP impl has changed, set server impl to undefined
        this.serverImpl = null;
        this.onSetServer(this.serverImpl || undefined);
      }

    } else {
      // no server impl set, if there's an HTTP impl, sync with its server, otherwise just set to undefined
      if (this.httpImpl) {
        this.serverImpl = this.httpImpl.server;
        this.onSetServer(this.serverImpl || undefined);
      }
    }
  }

  /**
   * Called whenever the OpenNMS server has changed.
   * @param server the new server
   */
  protected onSetServer(server?: OnmsServer) {
    // this should be overridden by implementations
  }

  /**
   * Whether or not to use JSON when making ReST requests.
   */
  protected useJson(): boolean {
    if (!this.server || this.server.metadata === null) {
      throw new OnmsError('Server meta-data must be populated prior to making DAO calls.');
    }
    return this.server.metadata.useJson();
  }

  /**
   * A convenience method to make it easy for implementers to extract the count
   * (or totalCount) values from response data.
   */
  protected getCount(data: any, status?: number): number {
    let count = 0;
    if (typeof(data) === 'number') {
      count = data;
    } else if (data.count !== undefined) {
      count = parseInt(data.count, 10);
    } else if (data.totalCount !== undefined) {
      count = parseInt(data.totalCount, 10);
    } else {
      if (status === 204) {
        log.debug('data is missing count and totalCount properties');
      } else {
        log.warn('data is missing count and totalCount properties, but HTTP status was not 204');
      }
    }
    return count;
  }

  /**
   * Convert the given value to a date, or undefined if it cannot be converted.
   * @deprecated use {@link Util.toDate} instead.
   */
  protected toDate(from: any): Moment|undefined {
    return Util.toDate(from);
  }

  /**
   * Convert the given value to a number, or undefined if it cannot be converted.
   * @deprecated use {@link Util.toNumber} instead.
   */
  protected toNumber(from: any): number|undefined {
    return Util.toNumber(from);
  }
}
