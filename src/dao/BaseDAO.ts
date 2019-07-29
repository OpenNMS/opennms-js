import {IFilterProcessor} from '../api/IFilterProcessor';
import {IHasHTTP} from '../api/IHasHTTP';
import {IOnmsHTTP} from '../api/IOnmsHTTP';
import {OnmsError} from '../api/OnmsError';

import {Filter} from '../api/Filter';
import {OnmsHTTPOptions} from '../api/OnmsHTTPOptions';
import {SearchProperty} from '../api/SearchProperty';
import {SearchPropertyType} from '../api/SearchPropertyType';

import {log, catDao} from '../api/Log';

import {V1FilterProcessor} from './V1FilterProcessor';
import {V2FilterProcessor} from './V2FilterProcessor';

import {PropertiesCache} from './PropertiesCache';

/** @hidden */
// tslint:disable-next-line
const moment = require('moment');

/** @hidden */
// tslint:disable-next-line
import {Moment} from 'moment';
import {IValueProvider} from './IValueProvider';

/**
 * A base DAO useful for subclassing to create real DAOs.  This differs from
 * the [[AbstractDAO]] in that it doesn't have a "default" interface for
 * dealing with model objects, it only provides core conveniences.
 *
 * @module BaseDAO
 */
export abstract class BaseDAO {
  /**
   * The [[IOnmsHTTP]] implementation to use internally when making DAO requests.
   * @hidden
   */
  private httpImpl: IOnmsHTTP;

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
  }

  /**
   * The HTTP implementation to use internally when making DAO requests.
   */
  public get http() {
    return this.httpImpl;
  }

  public set http(impl: IOnmsHTTP) {
    this.httpImpl = impl;
  }

  /**
   * Whether or not to use JSON when making ReST requests.
   */
  protected useJson(): boolean {
    if (this.http === undefined || !this.http.server || this.http.server.metadata === undefined) {
      throw new OnmsError('Server meta-data must be populated prior to making DAO calls.');
    }
    return this.http.server.metadata.useJson();
  }

  /**
   * A convenience method to make it easy for implementers to extract the count
   * (or totalCount) values from response data.
   */
  protected getCount(data: any): number {
    let count = 0;
    if (typeof(data) === 'number') {
      count = data;
    } else if (data.count !== undefined) {
      count = parseInt(data.count, 10);
    } else if (data.totalCount !== undefined) {
      count = parseInt(data.totalCount, 10);
    } else {
      log.debug('data is missing count and totalCount properties', catDao);
    }
    return count;
  }

  /**
   * Convert the given value to a date, or undefined if it cannot be converted.
   */
  protected toDate(from: any): Moment|undefined {
    if (from === undefined || from === null || from === '') {
      return undefined;
    }
    return moment(from);
  }

  /**
   * Convert the given value to a number, or undefined if it cannot be converted.
   */
  protected toNumber(from: any): number|undefined {
    const ret = parseInt(from, 10);
    return isNaN(ret) ? undefined : ret;
  }
}
