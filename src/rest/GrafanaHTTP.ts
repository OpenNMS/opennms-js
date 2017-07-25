import {AbstractHTTP} from './AbstractHTTP';
import {OnmsError} from '../api/OnmsError';
import {OnmsHTTPOptions} from '../api/OnmsHTTPOptions';
import {OnmsResult} from '../api/OnmsResult';
import {OnmsServer} from '../api/OnmsServer';

import {log, catRest} from '../api/Log';
import {Category} from 'typescript-logging';

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
      return OnmsResult.ok(response.data, undefined, response.status, type);
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
      return OnmsResult.ok(response.data, undefined, response.status, type);
    });
  }

  /**
   * Internal method to turn [[OnmsHTTPOptions]] into a Grafana `BackendSrv` request object.
   * @hidden
   */
  private getConfig(options?: OnmsHTTPOptions): any {
    const allOptions = this.getOptions(options);
    const ret = {} as any;

    if (allOptions.headers) {
      ret.headers = allOptions.headers;
    }

    ret.headers = ret.headers || {};
    if (!ret.headers.accept) {
      ret.headers.accept = 'application/json';
    }
    if (!ret.headers['content-type']) {
      ret.headers['content-type'] = 'application/json;charset=utf-8';
    }

    const type = ret.headers.accept;
    if (type === 'application/json') {
      ret.responseType = 'json';
      ret.transformResponse = this.transformJSON;
    } else if (type === 'text/plain') {
      ret.responseType = 'text';
      delete ret.transformResponse;
    } else if (type === 'application/xml') {
      ret.responseType = 'text';
      ret.transformResponse = this.transformXML;
    } else {
      throw new OnmsError('Unhandled "Accept" header: ' + type);
    }

    if (allOptions.parameters && Object.keys(allOptions.parameters).length > 0) {
      ret.params = options.parameters;
    }

    return ret;
  }

}
