import axios from 'axios';
import {AxiosInstance, AxiosRequestConfig} from 'axios';

import {AbstractHTTP} from './AbstractHTTP';
import {OnmsError} from '../api/OnmsError';
import {OnmsHTTP} from '../api/OnmsHTTP';
import {OnmsHTTPOptions} from '../api/OnmsHTTPOptions';
import {OnmsResult} from '../api/OnmsResult';
import {OnmsServer} from '../model/OnmsServer';

import {factory} from '../api/Log';

const log = factory.getLogger('rest.AxiosHTTP');

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

  /** make an HTTP get call -- this should be overridden by the implementation */
  public get(url: string, options?: OnmsHTTPOptions) {
    return this.getImpl(options).get(url, this.getConfig(options)).then((response) => {
      return OnmsResult.ok(response.data, undefined, response.status);
    }).catch((err) => {
      let code;
      let message = err;
      if (err.response) {
        code = err.response.status;
      }
      if (err.message) {
        message = err.message;
      }
      return Promise.reject(OnmsResult.error(message, code));
    });
  }

  /**
   * Clear the configured {@link AxiosInstance} so we create a new one when the server changes.
   */
  protected onSetServer() {
    super.onSetServer();
    this.axiosObj = undefined;
  }

  /** internal method to turn {@link OnmsHTTPOptions} into an {@link AxiosRequestConfig} object. */
  private getConfig(options?: OnmsHTTPOptions): AxiosRequestConfig {
    if (options) {
      const ret = {} as AxiosRequestConfig;

      if (options.auth && options.auth.username && options.auth.password) {
        ret.auth = {
          password: options.auth.password,
          username: options.auth.username,
        };
      }

      if (options.timeout) {
        ret.timeout = options.timeout;
      }
    }

    return {};
  }

  /** internal method for getting/constructing an Axios object on-demand, based on the current server config */
  private getImpl(options?: OnmsHTTPOptions) {
    if (!this.axiosObj) {
      if (!this.server) {
        throw new OnmsError('You must set a server before attempting to make queries using Axios!');
      }
      this.axiosObj = axios.create({
        auth: {
          password: options.auth.password || super.server.auth.password || super.options.auth.password,
          username: options.auth.username || super.server.auth.username || super.options.auth.username,
        },
        baseURL: super.server.url,
        timeout: super.timeout,
        withCredentials: true,
      });
    }
    return this.axiosObj;
  }

}
