import axios from 'axios';
import {AxiosInstance} from 'axios';

import {AbstractHTTP} from './AbstractHTTP';
import {OnmsError} from '../api/OnmsError';
import {OnmsHTTP} from '../api/OnmsHTTP';
import {OnmsServer} from '../model/OnmsServer';

/**
 * Implementation of the OnmsHTTP interface using Axios: https://github.com/mzabriskie/axios
 * @module AxiosHTTP
 * @implements OnmsHTTP
 */ /** */
export class AxiosHTTP extends AbstractHTTP implements OnmsHTTP {
  /** the Axios instance we'll use for making ReST calls */
  private axiosObj: AxiosInstance;

  constructor(server?: OnmsServer, timeout = 10000) {
    super(server, timeout);
  }

  /**
   * Clear the configured {@link AxiosInstance} so we create a new one when the server changes.
   */
  protected onSetServer() {
    super.onSetServer();
    this.axiosObj = undefined;
  }

  /** internal method for getting/constructing an Axios object on-demand, based on the current server config */
  private getImpl() {
    if (!this.axiosObj) {
      if (!this.server) {
        throw new OnmsError('You must set a server before attempting to make queries using Axios!');
      }
      this.axiosObj = axios.create({
        auth: {
          password: super.server.auth.password || super.options.auth.password,
          username: super.server.auth.username || super.options.auth.username,
        },
        baseURL: super.server.url,
        timeout: super.timeout,
        withCredentials: true,
      });
    }
    return this.axiosObj;
  }

}
