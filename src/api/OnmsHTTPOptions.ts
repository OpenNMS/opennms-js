import {OnmsAuthConfig} from './OnmsAuthConfig';
import {OnmsServer} from './OnmsServer';
import {IHash} from '../internal/IHash';

import {cloneDeep} from 'lodash';

export const DEFAULT_TIMEOUT = 10000;

export const TIMEOUT_PROP = Symbol.for('timeout');
export const AUTH_PROP = Symbol.for('auth');

/**
 * Options to be used when making HTTP ReST calls.
 * @module OnmsHTTPOptions
 */
export class OnmsHTTPOptions {
  /** How long to wait for ReST calls to time out. */
  public get timeout(): number | undefined {
    return this[TIMEOUT_PROP] || undefined;
  }

  /** The authentication config that should be used. */
  public get auth(): OnmsAuthConfig | undefined {
    const auth = this[AUTH_PROP];
    if (auth !== null && auth !== undefined) {
      return auth;
    }
    if (this.server && this.server.auth) {
      return this.server.auth;
    }
    return undefined;
  }

  /** The server to use instead of that provided by the HTTP implementation. */
  public readonly server: OnmsServer | null;

  /** HTTP headers to be passed to the request. */
  public readonly headers = {} as IHash<string>;

  /** HTTP parameters to be passed on the URL. */
  public readonly parameters = {} as IHash<string | string[]>;

  /** HTTP data to be passed when POSTing */
  public readonly data: any;

  /**
   * The default timeout associated with these options.
   *
   * This is a trick for making sure serialization to JSON happens properly
   * without exposing internals.
   */
  private readonly [TIMEOUT_PROP]: number | null;

  /**
   * The default authentication credentials associated with these options.
   *
   * This is a trick for making sure serialization to JSON happens properly
   * without exposing internals.
   */
  private [AUTH_PROP]: OnmsAuthConfig | null;

  /**
   * Construct a new OnmsHTTPOptions object.
   * @constructor
   */
  constructor(
    timeout?: number,
    server?: OnmsServer,
    auth?: OnmsAuthConfig,
    headers?: IHash<string>,
    parameters?: IHash<string | string[]>,
    data?: any,
  ) {
    this[TIMEOUT_PROP] = timeout || DEFAULT_TIMEOUT;
    this.server = server || null;
    this[AUTH_PROP] = null;
    if (server && auth && auth !== server.auth) {
      this[AUTH_PROP] = auth;
    }
    this.headers = headers || {} as IHash<string>;
    this.parameters = parameters || {} as IHash<string | string[]>;
    this.data = data;
  }

  /**
   * Create a copy of these options with the given timeout set.
   * If no timeout is provided, the default timeout will be (re)set.
   * @param timeout the new timeout
   */
  public withTimeout(timeout?: number) {
    // tslint:disable-next-line:max-line-length
    return new OnmsHTTPOptions(timeout, this.server || undefined, this.auth, this.headers, this.parameters, this.data);
  }

  /**
   * Create a copy of these options, overriding the server with the provided option.
   * If no server is provided, the default server will be (re)set.
   * @param server the new server
   */
  public withServer(server?: OnmsServer) {
    return new OnmsHTTPOptions(this.timeout || undefined, server, this.auth, this.headers, this.parameters, this.data);
  }

  /**
   * Set a header
   * @param header the header name
   * @param value the header's value
   */
  public withHeader(header: string, value?: any): OnmsHTTPOptions {
    const newHeaders = cloneDeep(this.headers);
    if (newHeaders) {
      delete newHeaders[header];
      delete newHeaders[header.toLowerCase()];
      if (value !== undefined) {
        newHeaders[header] = value;
      }
    }
    Object.freeze(newHeaders);
    // tslint:disable-next-line:max-line-length
    return new OnmsHTTPOptions(this.timeout || undefined, this.server || undefined, this.auth, newHeaders, this.parameters, this.data);
  }

  /**
   * Set a header
   * @param header the header name
   * @param value the header's value
   */
  public withHeaders(headers?: IHash<string>): OnmsHTTPOptions {
    const newHeaders = cloneDeep(headers);
    Object.freeze(newHeaders);
    // tslint:disable-next-line:max-line-length
    return new OnmsHTTPOptions(this.timeout || undefined, this.server || undefined, this.auth, newHeaders, this.parameters, this.data);
  }

  /**
   * Add a URL parameter.
   * @param key - the parameter's key
   * @param value - the parameter's value
   */
  public withParameter(key: string, value?: any): OnmsHTTPOptions {
    const newParms = cloneDeep(this.parameters || {});

    // Since parameters can be repeated an arbitrary number of times we will store them in an array in the map
    // as soon as the occurrence of a given key is > 1
    if (newParms[key]) {
      if (value === undefined) {
        delete newParms[key];
      } else {
        const currentValue = newParms[key];
        if (Array.isArray(currentValue)) {
          currentValue.push('' + value);
        } else {
          const newArrayValue = [];
          newArrayValue.push(currentValue);
          newArrayValue.push(value);
          newParms[key] = newArrayValue;
        }
      }
    } else {
      if (value) {
        newParms[key] = '' + value;
      }
    }
    Object.freeze(newParms);
    // tslint:disable-next-line:max-line-length
    return new OnmsHTTPOptions(this.timeout || undefined, this.server || undefined, this.auth, this.headers, newParms, this.data);
  }

  /**
   * Replace the URL parameters in this set of options.
   * @param params the replacement parameters
   */
  public withParameters(params?: IHash<string | string[]>) {
    const newParams = cloneDeep(params);
    Object.freeze(newParams);
    // tslint:disable-next-line:max-line-length
    return new OnmsHTTPOptions(this.timeout || undefined, this.server || undefined, this.auth, this.headers, newParams, this.data);
  }

  /**
   * Set the data on these options.
   */
  public withData(data?: any) {
    // tslint:disable-next-line:max-line-length
    return new OnmsHTTPOptions(this.timeout || undefined, this.server || undefined, this.auth, this.headers, this.parameters, data);
  }

  /**
   * Convert the options to a plain JSON object.
   */
  public toJSON(): object {
    const ret = Object.assign({} as any, this);
    if (this[TIMEOUT_PROP]) {
      ret.timeout = this[TIMEOUT_PROP];
    }
    if (this[AUTH_PROP]) {
      ret.auth = this[AUTH_PROP];
    }
    return ret;
  }
}
