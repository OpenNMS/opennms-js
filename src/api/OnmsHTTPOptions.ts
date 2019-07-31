import {OnmsAuthConfig} from './OnmsAuthConfig';
import {OnmsServer} from './OnmsServer';
import {IHash} from '../internal/IHash';

export const DEFAULT_TIMEOUT = 10000;

export const TIMEOUT_PROP = Symbol.for('timeout');
export const AUTH_PROP = Symbol.for('auth');

/**
 * Options to be used when making HTTP ReST calls.
 * @module OnmsHTTPOptions
 */
export class OnmsHTTPOptions {
  /** How long to wait for ReST calls to time out. */
  public get timeout(): number {
    if (this[TIMEOUT_PROP]) {
      return this[TIMEOUT_PROP];
    }
    return DEFAULT_TIMEOUT;
  }

  public set timeout(t: number) {
    this[TIMEOUT_PROP] = t;
  }

  /** The authentication config that should be used. */
  public get auth(): OnmsAuthConfig {
    if (this[AUTH_PROP]) {
      return this[AUTH_PROP];
    }
    if (this.server && this.server.auth) {
      return this.server.auth;
    }
    return {} as OnmsAuthConfig;
  }

  public set auth(a: OnmsAuthConfig) {
    this[AUTH_PROP] = a;
  }

  /** The server to use if no server is set on the HTTP implementation. */
  public server?: OnmsServer | null;

  /** HTTP headers to be passed to the request. */
  public headers = {} as IHash<string>;

  /** HTTP parameters to be passed on the URL. */
  public parameters = {} as IHash<string | string[]>;

  /** HTTP data to be passed when POSTing */
  public data: any;

  /**
   * The default timeout associated with these options.
   *
   * This is a trick for making sure serialization to JSON happens properly
   * without exposing internals.
   */
  private [TIMEOUT_PROP]: number;

  /**
   * The default authentication credentials associated with these options.
   *
   * This is a trick for making sure serialization to JSON happens properly
   * without exposing internals.
   */
  private [AUTH_PROP]: OnmsAuthConfig;

  /**
   * Construct a new OnmsHTTPOptions object.
   * @constructor
   */
  constructor(timeout?: number, auth?: OnmsAuthConfig, server?: OnmsServer) {
    this.timeout = timeout || DEFAULT_TIMEOUT;
    this.auth = auth || new OnmsAuthConfig();
    this.server = server || null;
  }

  /**
   * Add a URL parameter. Returns the OnmsHTTPOptions object so it can be chained.
   * @param key - the parameter's key
   * @param value - the parameter's value
   */
  public withParameter(key: string, value?: any): OnmsHTTPOptions {
    if (value !== undefined) {
      // Since parameters can be repeated an arbitrary number of times we will store them in an array in the map
      // as soon as the occurrence of a given key is > 1
      if (this.parameters[key]) {
        const currentValue = this.parameters[key];
        if (Array.isArray(currentValue)) {
          currentValue.push('' + value);
        } else {
          const newArrayValue = [];
          newArrayValue.push(currentValue);
          newArrayValue.push(value);
          this.parameters[key] = newArrayValue;
        }
      } else {
        this.parameters[key] = '' + value;
      }
    }
    return this;
  }

  /**
   * Convert the options to a plain JSON object.
   */
  public toJSON(): object {
    const ret = Object.assign({}, this);
    if (this[TIMEOUT_PROP]) {
      ret.timeout = this.timeout;
    }
    if (this[AUTH_PROP]) {
      ret.auth = this.auth;
    }
    return ret;
  }
}
