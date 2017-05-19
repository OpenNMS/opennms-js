import * as axios from 'axios';

import {OnmsAuthConfig} from './api/OnmsAuthConfig';
import {OnmsHTTP} from './api/OnmsHTTP';
import {OnmsHTTPOptions} from './api/OnmsHTTPOptions';
import {OnmsError} from './api/OnmsError';
import {OnmsServer} from './model/OnmsServer';
import {AxiosHTTP} from './rest/AxiosHTTP';

export { OnmsServer as OnmsServer };

/**
 * The OpenNMS client.  This is the primary interface to OpenNMS servers.
 * @class
 */
export class Client {
  /**
   * Explicitly set the server configuration to use with this client.
   * @param url - the URL to the remote server
   * @param name - the display name to associate with this server
   * @param username - the user account to authenticate as
   * @param password - the password to authenticate with
   */
  public static getServer(url: string, name: string, username: string, password: string) {
      return new OnmsServer(name, url, new OnmsAuthConfig(username, password));
  }

  /**
   * Given an OnmsServer object, query what capabilities it has, and return the capabilities
   * associated with that server.
   *
   * @param server - the server to check
   * @param timeout - how long to wait before giving up when making ReST calls
   * @param updateCapabilities - update the provided OnmsServer option with the
   *        detected capabilities
   */
  public static checkServer(server: OnmsServer, timeout?: number, updateCapabilities?: boolean) {
    const opts = new OnmsHTTPOptions(timeout);
    return undefined;
  }

  /** The OnmsHTTP implementation to be used when making requests */
  private http: OnmsHTTP;

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
      this.http = httpImpl;
    } else {
      this.http = new AxiosHTTP();
    }
  }
}
