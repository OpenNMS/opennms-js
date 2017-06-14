import * as axios from 'axios';

import {log, catRoot} from './api/Log';
import {Category} from 'typescript-logging';

import {IOnmsHTTP} from './api/IOnmsHTTP';

import {OnmsAuthConfig} from './api/OnmsAuthConfig';
import {OnmsHTTPOptions} from './api/OnmsHTTPOptions';
import {OnmsError} from './api/OnmsError';
import {OnmsResult} from './api/OnmsResult';
import {OnmsVersion} from './api/OnmsVersion';
import {ServerType, ServerTypes} from './api/ServerType';

import {OnmsServer} from './api/OnmsServer';
import {ServerMetadata} from './api/ServerMetadata';

import {OnmsAlarm} from './model/OnmsAlarm';

import {AxiosHTTP} from './rest/AxiosHTTP';

/** @hidden */
const catClient = new Category('client', catRoot);

/**
 * The OpenNMS client.  This is the primary interface to OpenNMS servers.
 * @module Client
 */ /** */
export class Client {
  /**
   * Given an OnmsServer object, check that it can be connected to.
   *
   * @param server - the server to check
   * @param httpImpl - the {@link IOnmsHTTP} implementation to use
   * @param timeout - how long to wait before giving up when making ReST calls
   */
  public static async checkServer(server: OnmsServer, httpImpl?: IOnmsHTTP, timeout?: number): Promise<boolean> {
    const opts = new OnmsHTTPOptions(timeout, server.auth);
    if (!httpImpl) {
      if (!Client.http) {
        throw new OnmsError('No HTTP implementation is configured!');
      }
      httpImpl = Client.http;
    }
    opts.accept = 'text/plain';

    const infoUrl = server.resolveURL('rest/alarms/count');
    log.debug('checking URL: ' + infoUrl, catClient);
    return httpImpl.get(infoUrl, opts).then((ret) => {
      return true;
    });
  }

  /**
   * Given an OnmsServer object, query what capabilities it has, and return the capabilities
   * associated with that server.
   *
   * @param server - the server to check
   * @param httpImpl - the {@link IOnmsHTTP} implementation to use
   * @param timeout - how long to wait before giving up when making ReST calls
   */
  public static async getMetadata(server: OnmsServer, httpImpl?: IOnmsHTTP, timeout?: number):
    Promise<OnmsResult<ServerMetadata>> {
    const opts = new OnmsHTTPOptions(timeout, server.auth);
    opts.accept = 'application/json';
    if (!httpImpl) {
      if (!Client.http) {
        throw new OnmsError('No HTTP implementation is configured!');
      }
      httpImpl = Client.http;
    }

    const infoUrl = server.resolveURL('rest/info');
    log.debug('checking URL: ' + infoUrl, catClient);
    return httpImpl.get(infoUrl, opts).then((ret) => {
      const version = new OnmsVersion(ret.data.version, ret.data.displayVersion);
      const metadata = new ServerMetadata(version);

      if (ret.data.packageName) {
        if (ret.data.packageName.toLowerCase() === 'meridian') {
          metadata.type = ServerTypes.MERIDIAN;
        }
      }
      return OnmsResult.ok(metadata, ret.message, ret.code);
    });
  }

  /** The OnmsHTTP implementation to be used when making requests */
  private static http: IOnmsHTTP;

  /** The remote server to connect to */
  public server: OnmsServer;

  /**
   * Construct a new OpenNMS client.
   * @constructor
   * @param httpImpl - The OnmsHTTP implementation to use. Normally
   *        this will automatically choose the best implementation
   *        based on the environment.
   */
  constructor(httpImpl?: IOnmsHTTP) {
    if (httpImpl) {
      Client.http = httpImpl;
    } else {
      Client.http = new AxiosHTTP();
    }
  }

  /**
   * Connect to an OpenNMS server, check what capabilities it has, and return an {@link OnmsServer}
   * for that connection.
   */
  public async connect(name: string, url: string, username: string, password: string, timeout?: number) {
    const self = this;
    const server = new OnmsServer(name, url, username, password);
    await Client.checkServer(server, undefined, timeout);
    return Client.getMetadata(server, undefined, timeout).then((result) => {
      self.server = server;
      server.metadata = result.data;
      return self;
    });
  }
}
