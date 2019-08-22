import axios from 'axios';
import {AxiosStatic, AxiosInstance, AxiosResponse, AxiosRequestConfig} from 'axios';
import {cloneDeep} from 'lodash';

/** @hidden */
// tslint:disable-next-line
const URI = require('urijs');

import {AbstractHTTP} from './AbstractHTTP';
import {OnmsError} from '../api/OnmsError';
import {OnmsHTTPOptions} from '../api/OnmsHTTPOptions';
import {OnmsResult} from '../api/OnmsResult';
import {OnmsServer} from '../api/OnmsServer';

import {log} from '../api/Log';

/**
 * Implementation of the [[IOnmsHTTP]] interface using Axios: https://github.com/mzabriskie/axios
 * @category Rest Implementation
 * @implements IOnmsHTTP
 */
export class AxiosHTTP extends AbstractHTTP {
  /**
   * The Axios implementation class we'll use for making ReST calls.  This is necessary
   * to make sure we end up with the correct backend (XMLHttpRequest or Node.js 'http')
   * at runtime.
   * @hidden
   */
  private axiosImpl: AxiosStatic;

  /**
   * The Axios instance we'll use for making ReST calls.  This will be reinitialized whenever
   * the server configuration changes.
   */
  private axiosObj?: AxiosInstance;

  /**
   * Construct an AxiosHTTP instance.
   * @param server - The server to connect to.
   * @param axiosImpl - The Axios implementation class to use.
   * @param timeout - The default timeout for ReST connections.
   */
  constructor(server?: OnmsServer, axiosImpl?: AxiosStatic, timeout = 10000) {
    super(server, timeout);
    this.axiosImpl = axiosImpl || axios;
  }

  /**
   * Make an HTTP GET call using `axios.request({method:'get'})`.
   */
  public get(url: string, options?: OnmsHTTPOptions) {
    const realUrl = this.getServer(options).resolveURL(url);
    const opts = this.getConfig(options);

    const urlObj = new URI(realUrl);
    urlObj.search(opts.params);
    log.debug('GET ' + urlObj.toString());

    opts.method = 'get';
    opts.url = realUrl;

    return this.getImpl(options).request(opts).then((response) => {
      let type;
      if (response.headers && response.headers['Content-Type']) {
        type = response.headers['Content-Type'];
      }
      return OnmsResult.ok(this.getData(response), undefined, response.status, type);
    }).catch((err) => {
      throw this.handleError(err, opts);
    });
  }

  /**
   * Make an HTTP HEAD call using `axios.request({method:'head'})`.
   */
  public head(url: string, options?: OnmsHTTPOptions) {
    const realUrl = this.getServer(options).resolveURL(url);
    const opts = this.getConfig(options);

    const urlObj = new URI(realUrl);
    urlObj.search(opts.params);
    log.debug('HEAD ' + urlObj.toString());

    opts.method = 'head';
    opts.url = realUrl;

    return this.getImpl(options).request(opts).then((response) => {
      let type;
      if (response.headers && response.headers['Content-Type']) {
        type = response.headers['Content-Type'];
      }
      return OnmsResult.ok(this.getData(response), undefined, response.status, type);
    }).catch((err) => {
      throw this.handleError(err, opts);
    });
  }

  /**
   * Make an HTTP PUT call using `axios.request({method:'put'})`.
   */
  public put(url: string, options?: OnmsHTTPOptions) {
    const realUrl = this.getServer(options).resolveURL(url);
    const opts = this.getConfig(options);

    const urlObj = new URI(realUrl);
    urlObj.search(opts.params);
    log.debug('PUT ' + urlObj.toString());

    opts.data = Object.assign({}, opts.params);
    opts.method = 'put';
    opts.url = realUrl;

    return this.getImpl(options).request(opts).then((response) => {
      let type;
      if (response.headers && response.headers['Content-Type']) {
        type = response.headers['Content-Type'];
      }
      return OnmsResult.ok(this.getData(response), undefined, response.status, type);
    }).catch((err) => {
      throw this.handleError(err, opts);
    });
  }

  /**
   * Make an HTTP POST call using `axios.request({method:'post'})`.
   */
  public post(url: string, options?: OnmsHTTPOptions) {
    const realUrl = this.getServer(options).resolveURL(url);
    const opts = this.getConfig(options);

    const urlObj = new URI(realUrl);
    urlObj.search(opts.params);
    log.debug('POST ' + urlObj.toString());

    opts.method = 'post';
    opts.url = realUrl;

    return this.getImpl(options).request(opts).then((response) => {
      let type;
      if (response.headers && response.headers['Content-Type']) {
        type = response.headers['Content-Type'];
      }
      return OnmsResult.ok(this.getData(response), undefined, response.status, type);
    }).catch((err) => {
      throw this.handleError(err, opts);
    });
  }

  /**
   * Make an HTTP DELETE call using `axios.request({method:'delete'})`.
   */
  public httpDelete(url: string, options?: OnmsHTTPOptions) {
    const realUrl = this.getServer(options).resolveURL(url);
    const opts = this.getConfig(options);

    const urlObj = new URI(realUrl);
    urlObj.search(opts.params);
    log.debug('DELETE ' + urlObj.toString());

    opts.method = 'delete';
    opts.url = realUrl;

    return this.getImpl(options).request(opts).then((response) => {
        let type;
        if (response.headers && response.headers['Content-Type']) {
            type = response.headers['Content-Type'];
        }
        return OnmsResult.ok(this.getData(response), undefined, response.status, type);
    }).catch((err) => {
      throw this.handleError(err, opts);
    });
  }

  /**
   * Clear the current [[AxiosInstance]] so it is recreated on next request with the
   * new server configuration.
   */
  protected onSetServer() {
    super.onSetServer();
    this.axiosObj = undefined;
  }

  /**
   * Internal method to turn [[OnmsHTTPOptions]] into an [[AxiosRequestConfig]] object.
   * @hidden
   */
  private getConfig(options?: OnmsHTTPOptions): AxiosRequestConfig {
    const allOptions = this.getOptions(options);

    const ret = {
      transformResponse: [], // we do this so we can post-process only on success
    } as AxiosRequestConfig;

    if (allOptions.auth && allOptions.auth.username && allOptions.auth.password) {
      ret.auth = {
        password: allOptions.auth.password,
        username: allOptions.auth.username,
      };
      this.axiosImpl.defaults.auth = cloneDeep(ret.auth);
    }

    if (allOptions.timeout) {
      ret.timeout = allOptions.timeout;
    }

    if (allOptions.headers) {
      ret.headers = cloneDeep(allOptions.headers);
    } else {
      ret.headers = {};
    }

    if (!ret.headers.Accept) {
      ret.headers.Accept = 'application/json';
    }
    if (!ret.headers['Content-Type']) {
      ret.headers['Content-Type'] = 'application/json;charset=utf-8';
    }

    const type = ret.headers.Accept;
    ret.transformResponse = [];
    if (type === 'application/json') {
      ret.responseType = 'json';
    } else if (type === 'text/plain') {
      ret.responseType = 'text';
    } else if (type === 'application/xml') {
      ret.responseType = 'text';
    } else {
      throw new OnmsError('Unhandled "Accept" header: ' + type);
    }

    if (allOptions.parameters) {
      ret.params = cloneDeep(allOptions.parameters);
    }

    if (allOptions.data) {
      ret.data = cloneDeep(allOptions.data);
    }

    return ret;
  }

  /**
   * Internal method for getting/constructing an Axios object on-demand,
   * based on the current server configuration.
   * @hidden
   */
  private getImpl(options?: OnmsHTTPOptions) {
    if (!this.axiosObj) {
      const server = this.getServer(options);
      if (!server) {
        throw new OnmsError('You must set a server before attempting to make queries using Axios!');
      }

      const allOptions = this.getOptions(options);

      const axiosOpts = {
        baseURL: server.url,
        timeout: allOptions.timeout,
        withCredentials: true,
      } as AxiosRequestConfig;

      if (typeof XMLHttpRequest !== 'undefined') {
        axiosOpts.adapter = require('axios/lib/adapters/xhr.js');
      } else if (typeof process !== 'undefined') {
        axiosOpts.adapter = require('axios/lib/adapters/http.js');
      }

      this.axiosObj = this.axiosImpl.create(axiosOpts);
    }

    return this.axiosObj;
  }

}
