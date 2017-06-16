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
 * Implementation of the OnmsHTTP interface for Grafana
 * @module GrafanaHTTP
 * @implements IOnmsHTTP
 */ /** */
export class GrafanaHTTP extends AbstractHTTP {
  /** the Grafana backend object we'll use for making ReST calls */
  private backendSrv: any;

  /**
   * Construct a new GrafanaHTTP implementation
   * @constructor
   * @param backendSrv the Grafana BackendSrv object to use for requests
   * @param server the OpenNMS server to make requests to
   * @param timeout
   */
  constructor(backendSrv: any, server?: OnmsServer) {
    super(server, undefined);
    this.backendSrv = backendSrv;
  }

  /** make an HTTP get call -- this should be overridden by the implementation */
  public get(url: string, options?: OnmsHTTPOptions) {
    const realUrl = this.server.resolveURL(url);
    log.debug('getting ' + realUrl);
    const query = this.getConfig(options);
    query.method = 'GET';
    query.url = realUrl;
    return this.backendSrv.datasourceRequest(query).then((response) => {
      let type = 'application/xml';
      if (query && query.headers && query.headers.Accept) {
        type = query.headers.Accept;
      }
      if (response.headers && response.headers['content-type']) {
        type = response.headers['content-type'];
      }
      return OnmsResult.ok(response.data, undefined, response.status, type);
    });
  }

  /** internal method to turn {@link OnmsHTTPOptions} into a Grafana BackendSrv request object. */
  private getConfig(options?: OnmsHTTPOptions): any {
    if (options) {
      const ret = {
        headers: {
          Accept: options.accept,
        },
      } as any;

      if (options.accept === 'application/json') {
        ret.transformResponse = this.transformJSON;
      } else if (options.accept === 'text/plain') {
        // allow, but don't do anything special to it
      } else if (options.accept === 'application/xml') {
        ret.transformResponse = this.transformXML;
      } else {
        throw new OnmsError('Unhandled response type: ' + options.accept);
      }

      if (options.parameters && Object.keys(options.parameters).length > 0) {
        ret.params = options.parameters;
      }

      return ret;
    }
    return {};
  }

}
