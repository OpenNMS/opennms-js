// tslint:disable-next-line
/// <reference path="../../typings/index.d.ts" />

import {IOnmsHTTP} from '../api/IOnmsHTTP';
import {IFilterProcessor} from '../api/IFilterProcessor';

import {OnmsHTTPOptions} from '../api/OnmsHTTPOptions';
import {OnmsResult} from '../api/OnmsResult';
import {OnmsServer} from '../api/OnmsServer';

if (global && !global.window) {
  global.window = {} as Window;
  if (!global.window.DOMParser) {
    // tslint:disable-next-line
    global.window.DOMParser = require('xmldom').DOMParser;
  }
}

/** @hidden */
// tslint:disable-next-line
const X2JS = require('x2js');

/** @hidden */
const xmlParser = new X2JS({
  arrayAccessForm: 'property',
  attributePrefix: '',
  ignoreRoot: true,
});

/**
 * Abstract implementation of the OnmsHTTP interface meant to be extended by a concrete class.
 * @module AbstractHTTP
 * @implements IOnmsHTTP
 */
export abstract class AbstractHTTP implements IOnmsHTTP {
  /** The default amount of time to wait before giving up on a request. */
  public timeout = 10000;

  /** The default set of HTTP options associated with this ReST client. */
  public options: OnmsHTTPOptions;

  /**
   * The server metadata we'll use for constructing ReST calls.
   * @hidden
   */
  private serverObj: OnmsServer;

  /** The server associated with this HTTP implementation. */
  public get server() {
    return this.serverObj;
  }

  public set server(server: OnmsServer) {
    this.serverObj = server;
    this.onSetServer();
  }

  /**
   * Create a new HTTP instance.
   * @constructor
   * @param server - A server object for immediate configuration.
   * @param timeout - How long to wait until timing out requests.
   */
  constructor(server?: OnmsServer, timeout = 10000) {
    this.serverObj = server;
    this.timeout = timeout;
  }

  /** Make an HTTP GET call. This must be implemented by the concrete implementation. */
  public abstract get(url: string, options?: OnmsHTTPOptions): Promise<OnmsResult<any>>;

  /** Make an HTTP PUT call. This must be overridden by the concrete implementation. */
  public abstract put(url: string, options?: OnmsHTTPOptions): Promise<OnmsResult<any>>;

  /** Make an HTTP POST call. This must be overridden by the concrete implementation. */
  public abstract post(url: string, options?: OnmsHTTPOptions): Promise<OnmsResult<any>>;

  /**
   * A convenience method for implementers to use to turn JSON into a javascript object.
   * Use this to process a JSON response before returning it in an [[OnmsResult]] object.
   */
  protected transformJSON(data: any) {
    if (typeof data === 'string') {
      if (data.length < 1) {
        return {};
      } else {
        return JSON.parse(data);
      }
    } else {
      // assume it's already parsed
      return data;
    }
  }

  /**
   * A convenience method for implementers to use to turn XML into a javascript object.
   * Use this to process an XML response before returning it in an [[OnmsResult]] object.
   */
  protected transformXML(data: any) {
    if (typeof data === 'string') {
      return xmlParser.xml2js(data);
    } else {
      // assume it's already parsed
      return data;
    }
  }

  /**
   * Get the [[OnmsServer]] object that should be used for making requests.  Favors the one
   * passed in the [[OnmsHTTPOptions]], otherwise it falls back to the default server associated
   * with the HTTP implementation.
   */
  protected getServer(options?: OnmsHTTPOptions) {
    if (options && options.server) {
      return options.server;
    }
    return this.serverObj;
  }

  /**
   * Get the union of [[OnmsHTTPOptions]] based on the passed options, defaults,
   * and options in the [[OnmsServer]] associated with this request.  Order of
   * precedence is passed options -> server options -> default options.
   */
  protected getOptions(options?: OnmsHTTPOptions): OnmsHTTPOptions {
    let ret = Object.assign({auth: {}}, this.options) as OnmsHTTPOptions;
    if (this.timeout) {
      ret.timeout = this.timeout;
    }
    const server = this.getServer(options);
    if (server && server.auth) {
      ret.auth = Object.assign(ret.auth, server.auth);
    }
    ret = Object.assign(ret, options);
    return ret;
  }

  /**
   * Implementers should override this method if they have actions that need to be performed
   * (like clearing a cache) when server settings change.
   */
  protected onSetServer() {
    // do nothing by default
  }

}
