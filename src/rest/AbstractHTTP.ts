import {IOnmsHTTP} from '../api/OnmsHTTP';

import {OnmsAuthConfig} from '../api/OnmsAuthConfig';
import {OnmsError} from '../api/OnmsError';
import {OnmsHTTPOptions} from '../api/OnmsHTTPOptions';
import {OnmsResult} from '../api/OnmsResult';
import {OnmsServer} from '../model/OnmsServer';

/**
 * Implementation of the OnmsHTTP interface using Axios: https://github.com/mzabriskie/axios
 * @module AxiosHTTP
 * @implements OnmsHTTP
 */ /** */
export class AbstractHTTP implements IOnmsHTTP {
  /** how long to wait before giving up on a given request */
  public timeout = 10000;

  /** the authorization config associated with this ReST client */
  public options: OnmsHTTPOptions;

  /** the server metadata we'll use for constructing ReST calls */
  private serverObj: OnmsServer;

  /** the server associated with this HTTP implementation */
  public get server() {
    return this.serverObj;
  }

  public set server(server: OnmsServer) {
    this.serverObj = server;
    this.onSetServer();
  }

  /**
   * Create a new AbstractHTTP instance.
   * @constructor
   * @param server - a server object for immediate configuration
   * @param timeout - how long to wait until timing out requests
   */
  constructor(server?: OnmsServer, timeout = 10000) {
    this.serverObj = server;
    this.timeout = timeout;
  }

  /** make an HTTP get call -- this should be overridden by the implementation */
  public get(url: string, options?: OnmsHTTPOptions) {
    return Promise.reject(OnmsResult.error('Not yet implemented.'));
  }

  /** useful for performing an action (like clearing caches) when the server is set */
  protected onSetServer() {
  	// do nothing by default
  }
}
