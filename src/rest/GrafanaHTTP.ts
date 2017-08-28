import {AbstractHTTP} from './AbstractHTTP';
import {OnmsError} from '../api/OnmsError';
import {OnmsHTTPOptions} from '../api/OnmsHTTPOptions';
import {OnmsResult} from '../api/OnmsResult';
import {OnmsServer} from '../api/OnmsServer';

import {log, catRest} from '../api/Log';
import {Category} from 'typescript-logging';

import * as clonedeep from 'lodash.clonedeep';
import {GrafanaError} from './GrafanaError';

/** @hidden */
const catGrafana = new Category('grafana', catRest);

/**
 * Implementation of the [[IOnmsHTTP]] interface for Grafana.
 * @module GrafanaHTTP
 * @implements IOnmsHTTP
 */
export class GrafanaHTTP extends AbstractHTTP {
  /**
   * The Grafana backend object we'll use for making ReST calls.
   * @hidden
   */
  private backendSrv: any;

  /**
   * Construct a new GrafanaHTTP implementation.
   * @constructor
   * @param backendSrv - The Grafana BackendSrv object to use for requests.
   * @param server - The OpenNMS server to make requests to.
   */
  constructor(backendSrv: any, server?: OnmsServer) {
    super(server, undefined);
    this.backendSrv = backendSrv;
  }

  /** Make an HTTP GET call using the Grafana `BackendSrv`. */
  public get(url: string, options?: OnmsHTTPOptions) {
    const realUrl = this.getServer(options).resolveURL(url);
    log.debug('GET ' + realUrl);
    const query = this.getConfig(options);
    query.method = 'GET';
    query.url = realUrl;
    return this.backendSrv.datasourceRequest(query).then((response) => {
      let type = 'application/xml';
      if (query && query.headers && query.headers.accept) {
        type = query.headers.accept;
      }
      if (response.headers && response.headers['content-type']) {
        type = response.headers['content-type'];
      }
      return OnmsResult.ok(this.getData(response), undefined, response.status, type);
    }).catch((e) => {
      this.handleError(e, query);
    });
  }

  /** Make an HTTP PUT call using the Grafana `BackendSrv`. */
  public put(url: string, options?: OnmsHTTPOptions) {
    const realUrl = this.getServer(options).resolveURL(url);
    log.debug('PUT ' + realUrl);
    const query = this.getConfig(options);
    query.method = 'PUT';
    query.url = realUrl;
    query.data = Object.apply({}, query.parameters);
    return this.backendSrv.datasourceRequest(query).then((response) => {
      let type = 'application/xml';
      if (query && query.headers && query.headers.accept) {
        type = query.headers.accept;
      }
      if (response.headers && response.headers['content-type']) {
        type = response.headers['content-type'];
      }
      return OnmsResult.ok(this.getData(response), undefined, response.status, type);
    }).catch((e) => {
      this.handleError(e, query);
    });
  }

  /** Make an HTTP POST call using the Grafana `BackendSrv`. */
  public post(url: string, options?: OnmsHTTPOptions) {
    const realUrl = this.getServer(options).resolveURL(url);
    log.debug('POST ' + realUrl);
    const query = this.getConfig(options);
    query.method = 'POST';
    query.url = realUrl;
    return this.backendSrv.datasourceRequest(query).then((response) => {
      let type = 'application/xml';
      if (query && query.headers && query.headers.accept) {
        type = query.headers.accept;
      }
      if (response.headers && response.headers['content-type']) {
        type = response.headers['content-type'];
      }
      return OnmsResult.ok(this.getData(response), undefined, response.status, type);
    }).catch((e) => {
      this.handleError(e, query);
    });
  }

  /** Make an HTTP DELETE call using the Grafana `BackendSrv`. */
  public httpDelete(url: string, options?: OnmsHTTPOptions) {
    const realUrl = this.getServer(options).resolveURL(url);
    log.debug('DELETE ' + realUrl);
    const query = this.getConfig(options);
    query.method = 'DELETE';
    query.url = realUrl;
    return this.backendSrv.datasourceRequest(query).then((response) => {
      let type = 'application/xml';
      if (query && query.headers && query.headers.accept) {
        type = query.headers.accept;
      }
      if (response.headers && response.headers['content-type']) {
        type = response.headers['content-type'];
      }
      return OnmsResult.ok(this.getData(response), undefined, response.status, type);
    }).catch((e) => {
        this.handleError(e, query);
    });
  }

    /**
     * A callback to handle any request errors.
     * @hidden
     */
    protected handleError(err: any, options?: any): never {
      let message = AbstractHTTP.extractMessage(err);
      if (err && err.data && err.data.response && (typeof (err.data.response) === 'string')) {
          message = err.data.response;
      }
      const status = AbstractHTTP.extractStatus(err);
      throw new GrafanaError(message, status, options, err);
    }

  /**
   * Internal method to turn [[OnmsHTTPOptions]] into a Grafana `BackendSrv` request object.
   * @hidden
   */
  private getConfig(options?: OnmsHTTPOptions): any {
    const allOptions = this.getOptions(options);
    const ret = clonedeep(allOptions);
    ret.transformResponse = []; // we do this so we can post-process only on success

    if (!allOptions.headers) {
      ret.headers = clonedeep(allOptions.headers);
    } else {
      ret.headers = {};
    }

    // Enforce Accept-Header
    if (!ret.headers.accept) {
      ret.headers.accept = 'application/json';
    }
    // Enforce Content-Type-Header when data is being sent
    if (ret.data && !ret.headers['content-type']) {
      ret.headers['content-type'] = 'application/json;charset=utf-8';
    }
    if (ret.parameters && Object.keys(ret.parameters).length > 0) {
      ret.params = ret.parameters;
      delete ret.parameters;
    }
    return ret;
  }

}
