import { HTTP } from '@ionic-native/http/ngx';
import { cloneDeep } from 'lodash';

import { OnmsError } from '../api/OnmsError';
import { OnmsHTTPOptions } from '../api/OnmsHTTPOptions';
import { OnmsResult } from '../api/OnmsResult';
import { OnmsServer } from '../api/OnmsServer';
import { AbstractHTTP } from './AbstractHTTP';

/**
 * Implementation of the [[IOnmsHTTP]] interface using the Cordova Advanced HTTP
 * plugin: https://github.com/silkimen/cordova-plugin-advanced-http
 *
 * @module CordovaNativeHTTP
 * @implements IOnmsHTTP
 */
export class CordovaAdvancedHTTP extends AbstractHTTP {
  /** True if `cordova.plugins.http` is available. */
  public static isValid() {
    const c = cordova as any;
    return c && c.plugin && c.plugins.http && c.plugins.http.sendRequest;
  }

  /** @inheritdoc */
  private http?: HTTP;

  /**
   * Create a new CordovaAdvancedHTTP instance.
   * @param server the server definition to use
   * @param timeout the default timeout for HTTP requests
   */
  public constructor(server?: OnmsServer, timeout?: number) {
    super(server, timeout);
    this.setTimeout(timeout);
  }

  /** @inheritdoc */
  public async get(url: string, options?: OnmsHTTPOptions): Promise<OnmsResult<any>> {
    throw new Error('Method not implemented.');
  }

  /** @inheritdoc */
  public async head(url: string, options?: OnmsHTTPOptions): Promise<OnmsResult<any>> {
    throw new Error('Method not implemented.');
  }

  /** @inheritdoc */
  public async put(url: string, options?: OnmsHTTPOptions): Promise<OnmsResult<any>> {
    throw new Error('Method not implemented.');
  }

  /** @inheritdoc */
  public async post(url: string, options?: OnmsHTTPOptions): Promise<OnmsResult<any>> {
    throw new Error('Method not implemented.');
  }

  /** @inheritdoc */
  public async httpDelete(url: string, options?: OnmsHTTPOptions): Promise<OnmsResult<any>> {
    throw new Error('Method not implemented.');
  }

  /** @inheritdoc */
  public setTimeout(timeout?: number) {
    if (timeout) {
      this.timeout = timeout;
      if (this.http) {
        this.http.setRequestTimeout(timeout / 1000.0);
      }
    }
  }

  /**
   * Set the behavior when making SSL connections to servers.
   * @param mode the server trust mode to use
   * @param http an optional HTTP implementation to update rather than the one associated with this impl
   */
  public async setServerTrustMode(mode: undefined|'default'|'legacy'|'nocheck'|'pinned', http?: HTTP) {
    const h = http || this.http;
    if (h) {
      const m = mode || 'default';
      await h.setSSLCertMode(m);
    } else {
      throw new OnmsError('Failed to set server trust mode to ' + mode + ', no HTTP interface initialized yet.');
    }
  }

  /** @inheritdoc */
  protected onBasicAuth(username: string, password: string, newHash: string, oldHash: string) {
    super.onBasicAuth(username, password, newHash, oldHash);
    if (this.http) {
      this.http.useBasicAuth(username, password);
    }
  }

  /** @inheritdoc */
  protected async ensureInitialized(options?: OnmsHTTPOptions) {
    if (!this.http) {
      this.http = new HTTP();
      this.http.setDataSerializer('urlencoded');
      await this.setServerTrustMode('nocheck', this.http);
      this.setTimeout(this.timeout);
    }
    if (options && options.auth && options.auth.username) {
      this.useBasicAuth(options.auth.username, options.auth.password);
    }
  }

  /** Initialize default options for cordova-plugin-advanced-http calls. */
  private async getConfig(options?: OnmsHTTPOptions) {
    const ret = {} as any;

    await this.ensureInitialized();
    const allOptions = this.getOptions(options);

    if (allOptions.headers) {
      ret.headers = cloneDeep(allOptions.headers);
    } else {
      ret.headers = {};
    }

    if (allOptions.parameters) {
      ret.params = cloneDeep(allOptions.parameters);
    }

    if (allOptions.data) {
      ret.data = cloneDeep(allOptions.data);
    }

    return ret;
  }

}
