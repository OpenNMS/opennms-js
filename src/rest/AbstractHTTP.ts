import {IOnmsHTTP} from '../api/OnmsHTTP';

import {OnmsAuthConfig} from '../api/OnmsAuthConfig';
import {OnmsError} from '../api/OnmsError';
import {OnmsHTTPOptions} from '../api/OnmsHTTPOptions';
import {OnmsResult} from '../api/OnmsResult';
import {OnmsServer} from '../api/OnmsServer';

/** @hidden */
// tslint:disable-next-line
const X2JS = require('x2js');

/** @hidden */
const xmlParser = new X2JS();

/**
 * Implementation of the OnmsHTTP interface using Axios: https://github.com/mzabriskie/axios
 * @module AxiosHTTP
 * @implements OnmsHTTP
 */ /** */
export abstract class AbstractHTTP implements IOnmsHTTP {
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
  public abstract get(url: string, options?: OnmsHTTPOptions): Promise<OnmsResult<any>>;

  /** a convenience method for implementers to use to turn JSON into a javascript object */
  protected transformJSON(data: any) {
    if (typeof data === 'string') {
      return JSON.parse(data);
    } else {
      // assume it's already parsed
      return data;
    }
  }

  /** a convenience method for implementers to use to turn XML into a javascript object */
  protected transformXML(data: any) {
    if (typeof data === 'string') {
      return xmlParser.xml2js(data);
    } else {
      // assume it's already parsed
      return data;
    }
  }

  /** combine all options from the given options, the current server, and the default options */
  protected getOptions(options?: OnmsHTTPOptions) {
    let ret = Object.assign({auth: {}}, this.options);
    if (this.timeout) {
      ret.timeout = this.timeout;
    }
    if (this.serverObj && this.serverObj.auth) {
      ret.auth = Object.assign(ret.auth, this.serverObj.auth);
    }
    ret = Object.assign(ret, options);
    return ret;
  }

  /** useful for performing an action (like clearing caches) when the server is set */
  protected onSetServer() {
    // do nothing by default
  }
}
