import * as axios from 'axios';
import {factory} from './api/Log';

import {OnmsAuthConfig} from './api/OnmsAuthConfig';
import {OnmsHTTP} from './api/OnmsHTTP';
import {OnmsHTTPOptions} from './api/OnmsHTTPOptions';
import {OnmsError} from './api/OnmsError';
import {OnmsResult} from './api/OnmsResult';
import {OnmsVersion} from './api/OnmsVersion';
import {ServerType} from './api/Constants';

import {OnmsServer} from './model/OnmsServer';
import {ServerMetadata} from './model/ServerMetadata';

import {AxiosHTTP} from './rest/AxiosHTTP';

export { OnmsServer as OnmsServer };

const log = factory.getLogger('Client');

/**
 * The OpenNMS client.  This is the primary interface to OpenNMS servers.
 * @module Client
 */ /** */
export class Client {
  /**
   * Given an OnmsServer object, query what capabilities it has, and return the capabilities
   * associated with that server.
   *
   * @param server - the server to check
   * @param timeout - how long to wait before giving up when making ReST calls
   */
  public static checkServer(server: OnmsServer, httpImpl?: OnmsHTTP, timeout?: number): Promise<OnmsResult> {
    const opts = new OnmsHTTPOptions(timeout, server.auth);
    if (!httpImpl) {
      if (!Client.http) {
        throw new OnmsError('No HTTP implementation is configured!');
      }
      httpImpl = Client.http;
    }

    const infoUrl = server.resolveURL('rest/info');
    log.debug('checking URL: ' + infoUrl);
    return httpImpl.get(infoUrl, opts).then((ret) => {
      log.debug('HTTP get returned:' + JSON.stringify(ret));
      const version = new OnmsVersion(ret.data.version, ret.data.displayVersion);
      const metadata = new ServerMetadata(version);

      if (ret.data.packageName) {
        if (ret.data.packageName.toLowerCase() === 'meridian') {
          metadata.type = ServerType.MERIDIAN;
        } else {
          metadata.type = ServerType.HORIZON;
        }
      } else {
        metadata.type = ServerType.UNKNOWN;
      }
      return OnmsResult.ok(metadata, ret.message, ret.code);
    }).catch((err) => {
      log.warn('HTTP get failed: ' + err.message);
      return Promise.reject(err);
    });
  }

  /** The OnmsHTTP implementation to be used when making requests */
  private static http: OnmsHTTP;

  /** The remote server to connect to */
  private server: OnmsServer;

  /**
   * Construct a new OpenNMS client.
   * @constructor
   * @param httpImpl - The OnmsHTTP implementation to use. Normally
   *        this will automatically choose the best implementation
   *        based on the environment.
   */
  constructor(httpImpl?: OnmsHTTP) {
    if (httpImpl) {
      Client.http = httpImpl;
    } else {
      Client.http = new AxiosHTTP();
    }
  }
}
