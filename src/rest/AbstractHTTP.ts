// tslint:disable-next-line
/// <reference path="../../typings/index.d.ts" />

import {IOnmsHTTP} from '../api/IOnmsHTTP';

import {OnmsError} from '../api/OnmsError';
import {OnmsHTTPOptions} from '../api/OnmsHTTPOptions';
import {OnmsResult} from '../api/OnmsResult';
import {OnmsServer} from '../api/OnmsServer';
import {XmlTransformer} from './XmlTransformer';
import {JsonTransformer} from './JsonTransformer';

// tslint:disable-next-line:no-var-requires
import btoa from 'btoa';

/** @hidden */
const xmlTransformer = new XmlTransformer();

/** @hidden */
const jsonTransformer = new JsonTransformer();

export const OPTIONS_PROP = Symbol.for('options');

/**
 * Abstract implementation of the OnmsHTTP interface meant to be extended by a concrete class.
 * @module AbstractHTTP
 * @implements IOnmsHTTP
 */
export abstract class AbstractHTTP implements IOnmsHTTP {
  /** @inheritdoc */
  public isValid = false;

  /**
   * This is a trick to make sure it doesn't get serialized and is always unique to the impl.
   * @hidden
   */
  private [OPTIONS_PROP] = new OnmsHTTPOptions();

  /**
   * We keep a computed basic auth hash so we can react when user/pass change in the impl.
   * @hidden
   */
  private authHash?: string;

  /** The default set of HTTP options associated with this ReST client. */
  public get options(): OnmsHTTPOptions {
    if (this[OPTIONS_PROP]) {
      return this[OPTIONS_PROP];
    }
    return {} as OnmsHTTPOptions;
  }

  public set options(o: OnmsHTTPOptions) {
    this[OPTIONS_PROP] = o;
  }

  /**
   * The default amount of time to wait before giving up on a request.
   * @deprecated Set `timeout` on the [[OnmsHTTPOptions]] object instead.  This will go away in OpenNMS.js 2.0.
   */
  public get timeout(): number {
    return this.options.timeout;
  }

  public set timeout(t: number) {
    /* tslint:disable:no-console */
    console.warn('The "timeout" property on OnmsHTTP implementations is deprecated ' +
      'and will be removed in OpenNMS.js 2.  Use "options.timeout" instead.');
    this.options.timeout = t;
  }

  /**
   * The server metadata we'll use for constructing ReST calls.
   * @hidden
   */
  private serverObj: OnmsServer | null = null;

  /** The server associated with this HTTP implementation. */
  public get server() {
    return this.serverObj;
  }

  public set server(server: OnmsServer | null) {
    this.serverObj = server;
    this.onSetServer();
  }

  /**
   * Create a new HTTP instance.
   * @constructor
   * @param server - A server object for immediate configuration.
   * @param timeout - How long to wait until timing out requests.
   */
  constructor(server?: OnmsServer, timeout?: number) {
    if (server) {
      this.server = server;
    }
    if (timeout) {
      this.options.timeout = timeout;
    }
  }

  /** Make an HTTP GET call. This must be implemented by the concrete implementation. */
  public abstract get(url: string, options?: OnmsHTTPOptions): Promise<OnmsResult<any>>;

  /** Make an HTTP HEAD call. This must be implemented by the concrete implementation. */
  public abstract head(url: string, options?: OnmsHTTPOptions): Promise<OnmsResult<any>>;

  /** Make an HTTP PUT call. This must be overridden by the concrete implementation. */
  public abstract put(url: string, options?: OnmsHTTPOptions): Promise<OnmsResult<any>>;

  /** Make an HTTP POST call. This must be overridden by the concrete implementation. */
  public abstract post(url: string, options?: OnmsHTTPOptions): Promise<OnmsResult<any>>;

  /** Make an HTTP DELETE call. This must be overridden by the concrete implementation. */
  public abstract httpDelete(url: string, options?: OnmsHTTPOptions): Promise<OnmsResult<any>>;

  /**
   * A convenience method for implementers to use to turn JSON into a javascript object.
   * Use this to process a JSON response before returning it in an [[OnmsResult]] object.
   */
  protected transformJSON(data: any) {
    return jsonTransformer.transform(data);
  }

    /**
     * A convenience method for implementers to use to turn XML into a javascript object.
     * Use this to process an XML response before returning it in an [[OnmsResult]] object.
     */
  protected transformXML(data: any) {
    return xmlTransformer.transform(data);
  }

  /** Attempt to extract the data from a response. */
  protected getData(response: any) {
    const type = this.getType(response);
    if (type === 'json') {
      return this.transformJSON(response.data);
    } else if (type === 'xml') {
      return this.transformXML(response.data);
    } else {
      return response.data;
    }
  }

  /**
   * Attempt to determine the type of response.
   * @hidden
   */
  protected getType(response: any) {
    if (response.headers['content-type'] === 'application/json') {
      return 'json';
    } else if (response.config.responseType === 'json') {
      return 'json';
    } else if (response.config.headers.accept === 'application/json') {
      return 'json';
    } else if (response.responseType === 'json') {
      return 'json';
    } else if (response.config.headers.accept === 'application/xml') {
      return 'xml';
    } else if (response.headers['content-type'] === 'application/xml') {
      return 'xml';
    }
    return 'text';
  }

  /**
   * Get the [[OnmsServer]] object that should be used for making requests.  Favors the one
   * passed in the [[OnmsHTTPOptions]], otherwise it falls back to the default server associated
   * with the HTTP implementation.
   */
  protected getServer(options?: OnmsHTTPOptions): OnmsServer {
    if (options && options.server) {
      return options.server;
    }
    if (!this.serverObj) {
      throw new OnmsError('Server not configured!');
    }
    return this.serverObj;
  }

  /**
   * Get the union of [[OnmsHTTPOptions]] based on the passed options, defaults,
   * and options in the [[OnmsServer]] associated with this request.  Order of
   * precedence is passed options -> server options -> default options.
   */
  protected getOptions(options?: OnmsHTTPOptions): OnmsHTTPOptions {
    const ret = new OnmsHTTPOptions();
    Object.assign(ret, this.options);

    const server = this.getServer(options);
    ret.server = server;
    if (server && server.auth) {
      ret.auth = Object.assign(ret.auth, server.auth);
    }
    Object.assign(ret, options);

    if (!ret.headers) {
      ret.headers = {};
    }

    if (!ret.headers.hasOwnProperty('X-Requested-With')) {
      ret.headers['X-Requested-With'] = 'XMLHttpRequest';
    }

    if (!ret.headers.accept && !ret.headers.Accept) {
      ret.headers.accept = 'application/json';
    }
    if (!ret.headers['content-type'] && !ret.headers['Content-Type']) {
      ret.headers['content-type'] = 'application/json;charset=utf-8';
    }

    return ret;
  }

  /**
   * Set or update the basic auth credentials to be used in making connections.
   * @param username The username to connect with
   * @param password The password to connect with
   */
  protected useBasicAuth(username?: string, password?: string) {
    if (username && password) {
      const hash = btoa(username + ':' + password);
      if (hash !== this.authHash) {
        this.onBasicAuth(username, password, hash, this.authHash);
        this.authHash = hash;
      }
    }
  }

  /**
   * Keep the basic auth string in sync when username/password changes.
   * @param username The username
   * @param password The user's password
   * @param newHash The newly-computed hash of username + password
   * @param oldHash The previous hash
   */
  protected onBasicAuth(username: string, password: string, newHash: string, oldHash?: string) {
    // do nothing by default
  }

  /**
   * Implementers should override this method if they have actions that need to be performed
   * (like clearing a cache) when server settings change.
   */
  protected onSetServer() {
    const auth = this.server ? this.server.auth : undefined;
    if (auth && auth.username) {
      this.useBasicAuth(auth.username, auth.password);
    }
  }

  /**
   * Create an [[OnmsError]] from an error response.
   * @hidden
   */
  protected handleError(err: any, options?: any): OnmsError {
    const message = AbstractHTTP.extractMessage(err);
    const status = AbstractHTTP.extractStatus(err);
    const data = AbstractHTTP.extractData(err);
    return new OnmsError(message, status, options, data);
  }

  /* tslint:disable:member-ordering */

  /**
   * Attempt to determine an error message from an error response.
   * @hidden
   */
  protected static extractMessage(err: any): string {
    if (err) {
      if (err.message) {
        return err.message;
      } else if (err.response) {
        return this.extractMessage(err.response);
      } else if (err.data && Object.prototype.toString.call(err) === '[object String]') {
        return err.data;
      } else if (err.statusText) {
        return err.statusText;
      }
      return JSON.stringify(err);
    }
    return 'no error message';
  }

  /**
   * Attempt to determine an error status code from an error response.
   * @hidden
   */
  protected static extractStatus(err: any): number {
    let status = -1;
    if (err.code) {
      status = err.code;
    } else if (err.status) {
      status = err.status;
    } else if (err.response && err.response.status) {
      status = err.response.status;
    }
    return status;
  }

  /**
   * Attempt to determine the data in an error response.
   * @hidden
   */
  protected static extractData(err: any): any {
    if (err && err.response && err.response.data) {
      return err.response.data;
    }
    if (err && err.data && err.data.response && (typeof (err.data.response) === 'string')) {
      return err.data.response;
    }
    return undefined;
  }

}
