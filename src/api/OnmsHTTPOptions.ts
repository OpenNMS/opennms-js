import {OnmsAuthConfig} from './OnmsAuthConfig';
import {OnmsServer} from './OnmsServer';
import {IHash} from '../internal/IHash';

/**
 * Options to be used when making HTTP ReST calls.
 * @module OnmsHTTPOptions
 */ /** */
export class OnmsHTTPOptions {
  /** the authentication config that should be used when no server auth is configured */
  public auth: OnmsAuthConfig;

  /** the server to use if no server is set on the HTTP implementation */
  public server: OnmsServer;

  /** how long to wait for ReST calls to time out */
  public timeout = 10000;

  /** http headers to be passed to the request */
  public headers = {} as IHash<string>;

  /** http parameters to be passed on the URL */
  public parameters = {} as IHash<string>;

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
}
