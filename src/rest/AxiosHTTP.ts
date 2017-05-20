import axios from 'axios';
import {AxiosInstance} from 'axios';

import {OnmsAuthConfig} from '../api/OnmsAuthConfig';
import {OnmsError} from '../api/OnmsError';
import {OnmsHTTP} from '../api/OnmsHTTP';
import {OnmsHTTPOptions} from '../api/OnmsHTTPOptions';
import {OnmsServer} from '../model/OnmsServer';

/**
 * Implementation of the OnmsHTTP interface using Axios: https://github.com/mzabriskie/axios
 * @module AxiosHTTP
 * @implements OnmsHTTP
 */ /** */
export class AxiosHTTP implements OnmsHTTP {
  /** how long to wait before giving up on a given request */
  public timeout: number;

  /** the authorization config associated with this ReST client */
  public options: OnmsHTTPOptions;

  /** the Axios instance we'll use for making ReST calls */
  private axiosObj: AxiosInstance;

  /** the server metadata we'll use for constructing ReST calls */
  private serverObj: OnmsServer;

  /** internal method for getting/constructing an Axios object on-demand, based on the current server config */
  private get impl() {
    if (!this.axiosObj) {
      if (!this.serverObj) {
        throw new OnmsError('You must set a server before attempting to make queries using Axios!');
      }
      this.axiosObj = axios.create({
        auth: {
          password: this.serverObj.auth.password || this.options.auth.password,
          username: this.serverObj.auth.username || this.options.auth.username,
        },
        baseURL: this.serverObj.url,
        timeout: this.timeout,
        withCredentials: true,
      });
    }
    return this.axiosObj;
  }

  /** get the server associated with this HTTP implementation */
  public get server() {
    return this.serverObj;
  }

  public set server(server: OnmsServer) {
    this.axiosObj = undefined;
    this.serverObj = server;
  }

  /**
   * Create a new AxiosHTTP instance.
   * @constructor
   * @param server - a server object for immediate configuration
   * @param timeout - how long to wait until timing out requests
   */
  constructor(server?: OnmsServer, timeout = 10000) {
    this.serverObj = server;
    this.timeout = timeout;
  }

}
