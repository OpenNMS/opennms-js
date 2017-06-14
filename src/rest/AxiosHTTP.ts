import axios from 'axios';
import {AxiosInstance, AxiosRequestConfig} from 'axios';

/** @hidden */
// tslint:disable-next-line
const URI = require('urijs');

import {log, catRest} from '../api/Log';
import {Category} from 'typescript-logging';

import {IOnmsHTTP} from '../api/IOnmsHTTP';

import {AbstractHTTP} from './AbstractHTTP';
import {OnmsError} from '../api/OnmsError';
import {OnmsHTTPOptions} from '../api/OnmsHTTPOptions';
import {OnmsResult} from '../api/OnmsResult';
import {OnmsServer} from '../api/OnmsServer';

/** @hidden */
const catAxios = new Category('axios', catRest);

/**
 * Implementation of the OnmsHTTP interface using Axios: https://github.com/mzabriskie/axios
 * @module AxiosHTTP
 * @implements IOnmsHTTP
 */ /** */
export class AxiosHTTP extends AbstractHTTP implements IOnmsHTTP {
  /** the Axios instance we'll use for making ReST calls */
  private axiosObj: AxiosInstance;

  constructor(server?: OnmsServer, timeout = 10000) {
    super(server, timeout);
  }

  /** make an HTTP get call -- this should be overridden by the implementation */
  public get(url: string, options?: OnmsHTTPOptions) {
    const realUrl = this.server.resolveURL(url);
    const opts = this.getConfig(options);

    const urlObj = new URI(realUrl);
    urlObj.search(options.parameters);
    log.debug('getting ' + urlObj.toString(), catAxios);

    return this.getImpl(options).get(realUrl, opts).then((response) => {
      let type;
      if (response.headers && response.headers['content-type']) {
        type = response.headers['content-type'];
      }
      return OnmsResult.ok(response.data, undefined, response.status, type);
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
    const allOptions = this.getOptions(options);

    const ret = {} as AxiosRequestConfig;

    if (allOptions.auth && allOptions.auth.username && allOptions.auth.password) {
      ret.auth = {
        password: allOptions.auth.password,
        username: allOptions.auth.username,
      };
    }

    if (allOptions.timeout) {
      ret.timeout = allOptions.timeout;
    }

    if (allOptions.accept === 'application/json') {
      ret.responseType = 'json';
      ret.transformResponse = this.transformJSON;
    } else if (allOptions.accept === 'text/plain') {
      ret.responseType = 'text';
      ret.headers = {
        Accept: allOptions.accept,
      };
    } else if (allOptions.accept === 'application/xml') {
      ret.responseType = 'text';
      ret.transformResponse = this.transformXML;
      ret.headers = {
        Accept: allOptions.accept,
      };
    } else {
      throw new OnmsError('Unhandled response type: ' + allOptions.accept);
    }

    if (allOptions.parameters) {
      ret.params = Object.assign({}, allOptions.parameters);
    }

    return ret;
  }

  /** internal method for getting/constructing an Axios object on-demand, based on the current server config */
  private getImpl(options?: OnmsHTTPOptions) {
    if (!this.axiosObj) {
      if (!this.server) {
        throw new OnmsError('You must set a server before attempting to make queries using Axios!');
      }
      const allOptions = this.getOptions(options);
      this.axiosObj = axios.create({
        auth: {
          password: allOptions.auth.password,
          username: allOptions.auth.username,
        },
        baseURL: this.server.url,
        timeout: allOptions.timeout,
        withCredentials: true,
      });
    }
    return this.axiosObj;
  }

}
