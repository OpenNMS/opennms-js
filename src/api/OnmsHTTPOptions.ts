import {OnmsAuthConfig} from './OnmsAuthConfig';
import {OnmsServer} from './OnmsServer';
import {IHash} from '../internal/IHash';

/**
 * Options to be used when making HTTP ReST calls.
 * @module OnmsHTTPOptions
 */
export class OnmsHTTPOptions {
  /** The authentication config that should be used when no auth is associated with the [[OnmsServer]]. */
  public auth: OnmsAuthConfig;

  /** The server to use if no server is set on the HTTP implementation. */
  public server: OnmsServer;

  /** How long to wait for ReST calls to time out. */
  public timeout = 10000;

  /** HTTP headers to be passed to the request. */
  public headers = {} as IHash<string>;

  /** HTTP parameters to be passed on the URL. */
  public parameters = {} as IHash<string>;

  /** HTTP data to be passed when POSTing */
  public data: any;

  /**
   * Construct a new OnmsHTTPOptions object.
   * @constructor
   */
  constructor(timeout?: number, auth?: OnmsAuthConfig, server?: OnmsServer) {
    if (timeout !== undefined) {
      this.timeout = timeout;
    }
    if (auth !== undefined) {
      this.auth = auth;
    }
    if (server !== undefined) {
      this.server = server;
    }
  }

  public withParameter(key: string, value?: any): OnmsHTTPOptions {
    if (value !== undefined) {
      this.parameters[key] = '' + value;
    }
    return this;
  }

}
