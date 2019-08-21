// tslint:disable:max-classes-per-file

import {OnmsAuthConfig} from './OnmsAuthConfig';
import {OnmsServer} from './OnmsServer';
import {IHash} from '../internal/IHash';
import {Util} from '../internal/Util';

import {cloneDeep} from 'lodash';

export const DEFAULT_TIMEOUT = 10000;

export const TIMEOUT_PROP = Symbol.for('timeout');
export const AUTH_PROP = Symbol.for('auth');

/** @hidden */
const isString = (v?: any) => {
  return v && (typeof v === 'string' || v instanceof String);
};

/**
 * A builder for [[OnmsHTTPOptions]].  Create a new one with `OnmsHTTPOptions.newBuilder()`.
 */
// tslint:disable:completed-docs variable-name whitespace
export class OnmsHTTPOptionsBuilder {
  private _timeout?: number;
  private _server?: OnmsServer;
  private _auth?: OnmsAuthConfig;
  private _headers = {} as IHash<string>;
  private _parameters = {} as IHash<string | string[]>;
  private _data?: any;

  /**
   * Construct a new builder from an existing options object, if provided.
   *
   * NOTE: server, auth, headers, and parameters are cloned, but data is left alone
   * and assumed to be mutable autside of the builder or elsewhere.
   */
  public constructor(options?: OnmsHTTPOptions) {
    if (options) {
      this._timeout = options.timeout;
      this._server = options.server ? options.server.clone() : undefined;
      this._auth = options.auth ? options.auth.clone() : undefined;
      this._headers = options.headers ? cloneDeep(options.headers) : {};
      this._parameters = options.parameters ? cloneDeep(options.parameters) : {};
      this._data = options.data;
    }
  }

  /** Build the [[OnmsHTTPOptions]] object. */
  public build(): OnmsHTTPOptions {
    return new OnmsHTTPOptions(
      this._timeout,
      this._server,
      this._auth,
      cloneDeep(this._headers),
      cloneDeep(this._parameters),
      this._data,
    );
  }

  /**
   * Merge the contents of the provided [[OnmsHTTPOptions]] object, additively.
   * Timeout, server, auth, and data will be replaced only if set, and headers and parameters
   * will be overlayed on top of existing.
   * @param options the options to merge with this builder's current values
   */
  public merge(options?: OnmsHTTPOptions) {
    if (options) {
      if (options.timeout) {
        this.timeout(options.timeout);
      }
      if (options.server) {
        this.server(options.server);
      }
      if (options.auth) {
        this.authConfig(options.auth);
      }
      if (options.headers) {
        for (const header of Object.keys(options.headers)) {
          this.header(header, options.headers[header]);
        }
      }
      if (options.parameters) {
        for (const parameter of Object.keys(options.parameters)) {
          this.parameter(parameter, options.parameters[parameter]);
        }
      }
      if (options.data) {
        this.data(options.data);
      }
    }
    return this;
  }

  /**
   * The connection timeout for the request.
   *
   * If `undefined` is passed, the default timeout will be used.
   * @param timeout the new timeout
   */
  public timeout(timeout?: number) {
    this._timeout = timeout;
    return this;
  }

  /**
   * The [[OnmsServer]] to connect to.
   *
   * If `undefined` is passed, the default server will be used.
   * @param server the new server
   */
  public server(server?: OnmsServer) {
    this._server = server;
    return this;
  }

  /**
   * The authentication config to use when connecting.
   *
   * If `undefined` is passed, the default authentication settings will be used.
   * @param auth the authentication config
   */
  public authConfig(auth?: OnmsAuthConfig) {
    this._auth = auth;
    return this;
  }

  /**
   * The headers to set in the request.
   *
   * If `undefined` is passed, all headers in the builder will be reset and the default headers will be used.
   * @param headers the headers to use (or `undefined`)
   */
  public headers(headers?: IHash<string>) {
    this._headers = headers || {};
    return this;
  }

  /**
   * A header to set in the request.
   *
   * If `undefined` is passed, that header will be reset to defaults.
   * @param header the header name
   * @param value the value of the header
   */
  public header(header: string, value?: string | number | boolean) {
    const v = value ? String(value) : undefined;
    const actualKey = Util.insensitiveKey(header, this._headers);
    delete this._headers[header];

    if (actualKey) {
      delete this._headers[actualKey];
    }

    if (v !== undefined) {
      this._headers[header] = v;
    }
    return this;
  }

  /**
   * A header to set in the request only if it is not already set.
   * @param header the header name
   * @param value the value of the header
   */
  public defaultHeader(header: string, value: string | number | boolean) {
    const actualKey = Util.insensitiveKey(header, this._headers);
    if (!actualKey) {
      this._headers[header] = String(value);
    }
    return this;
  }

  /**
   * The parameters to pass to the request.
   *
   * If `undefined` is passed, all parameters in the builder will be reset.
   * @param parameters the parameters to use (or `undefined`)
   */
  public parameters(parameters?: IHash<string|string[]>) {
    if (!parameters) {
      this._parameters = {};
    } else {
      this._parameters = parameters;
    }
    return this;
  }

  /**
   * A parameter to add or append to the request.
   *
   * If `undefined` is passed, that parameter will be reset to defaults.
   * If the value is a string array, the existing value in the builder will be replaced.
   * Otherwise, if the parameter already exists in the builder, the parameter will be converted to an array
   * if necessary and this parameter will be added to it.
   * @param parameter the parameter name
   * @param value the value of the parameter to add (or `undefined`)
   */
  public parameter(parameter: string, value?: string | string[] | number | boolean) {
    const v = (value && !isString(value)) ? String(value) : value;

    // Since parameters can be repeated an arbitrary number of times we will store them in an array in the map
    // as soon as the occurrence of a given key is > 1
    if (this._parameters[parameter]) {
      if (v === undefined) {
        delete this._parameters[parameter];
      } else if (Array.isArray(v)) {
        this._parameters[parameter] = v.map((obj) => String(obj));
      } else {
        const currentValue = this._parameters[parameter];
        if (Array.isArray(currentValue)) {
          currentValue.push(String(v));
        } else {
          const newArrayValue = [];
          newArrayValue.push(currentValue);
          newArrayValue.push(String(v));
          this._parameters[parameter] = newArrayValue;
        }
      }
    } else {
      if (v) {
        if (Array.isArray(v)) {
          this._parameters[parameter] = v.map((obj) => String(obj));
        } else {
          this._parameters[parameter] = String(v);
        }
      }
    }
    return this;
  }

  /**
   * The data to use in the request.
   *
   * If `undefined` is passed, the data will be cleared.
   * @param data the data
   */
  public data(data?: any) {
    this._data = data;
    return this;
  }
}
// tslint:enable:completed-docs variable-name whitespace

/**
 * Options to be used when making HTTP ReST calls.
 * @module OnmsHTTPOptions
 */
export class OnmsHTTPOptions {
  /**
   * Create a new builder for an [[OnmsHTTPOptions]] object.
   * @param options if an existing options object is passed, the builder will be pre-populated
   */
  public static newBuilder(options?: OnmsHTTPOptions) {
    return new OnmsHTTPOptionsBuilder(options);
  }

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
  private readonly [AUTH_PROP]: OnmsAuthConfig | null;

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
