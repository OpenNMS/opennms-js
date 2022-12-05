// tslint:disable:max-classes-per-file

/** @hidden */
// tslint:disable-next-line
const URI = require('urijs');

import {OnmsAuthConfig} from '../api/OnmsAuthConfig';
import {ServerMetadata} from './ServerMetadata';
import {ServerTypes} from './ServerType';

import {MD5} from 'object-hash';

/**
 * A builder for [[OnmsServer]].  Create a new one with [[OnmsServer.newBuilder]].
 * @category Rest
 */
// tslint:disable:completed-docs variable-name whitespace
export class OnmsServerBuilder {
  /** @hidden */
  private _name?: string;
  /** @hidden */
  private _url?: string;
  /** @hidden */
  private _auth?: OnmsAuthConfig;
  /** @hidden */
  private _metadata?: ServerMetadata;

  /**
   * Construct a new builder from an existing options object, if provided.
   */
  public constructor(url?: string) {
    this._url = url;
  }

  /** Build the [[OnmsServer]] object. */
  public build(): OnmsServer {
    return new OnmsServer(this);
  }

  /**
   * The display name of the server.
   *
   * If `undefined` is passed, the name will be unset.
   * @param name the server name
   */
  public setName(name?: string) {
    this._name = name;
    return this;
  }

  /**
   * The URL of the server.
   *
   * If `undefined` is passed, the URL will be unset.
   * @param url the server's URL
   */
  public setUrl(url?: string) {
    this._url = url;
    return this;
  }

  /**
   * The authentication config to use when connecting.
   *
   * If `undefined` is passed, the default authentication settings will be used.
   * @param auth the authentication config
   */
  public setAuth(auth?: OnmsAuthConfig) {
    this._auth = auth;
    return this;
  }

  /**
   * The server metadata to associate with the server.
   *
   * If `undefined` is passed, no metadata will be used.
   * @param metadata the metadata
   */
  public setMetadata(metadata?: ServerMetadata) {
    this._metadata = metadata;
    return this;
  }

  public get name() {
    return this._name;
  }

  public get url() {
    return this._url;
  }

  public get auth() {
    return this._auth;
  }

  public get metadata() {
    return this._metadata;
  }
}
// tslint:enable:completed-docs variable-name whitespace

/**
 * Represents a remote OpenNMS server.
 * @category Rest
 */
export class OnmsServer {
  /**
   * Create a new builder for an [[OnmsServer]] object.
   * @param server if an existing server object is passed, the builder will be pre-populated
   */
  public static newBuilder(url?: string) {
    return new OnmsServerBuilder(url);
  }

  /** A unique identifier for this server. */
  public readonly id: string;

  /** An optional name associated with this server. */
  public readonly name?: string;

  /** The base URL to the server. */
  public readonly url: string;

  /** The authorization configuration associated with the server. */
  public readonly auth: OnmsAuthConfig | null;

  /** The capabilities of the server */
  public readonly metadata: ServerMetadata | null;

  /**
   * Construct a new OnmsServer object representing a remote server.
   * @example
   * <caption>provide a pre-existing [[OnmsAuthConfig]] for auth</caption>
   * ```javascript
   * const server = new OnmsServer('Test', 'https://myserver/opennms/', auth);
   * ```
   *
   * @constructor
   * @param name - A name for the server suitable for display.
   * @param url - The URL to the server.
   * @param auth - An [[OnmsAuthConfig]], or the username to authorize as.
   * @param password - The password to authorize with if a username was
   *                   supplied to the `auth` parameter.
   */
  public constructor(serverBuilder: OnmsServerBuilder) {
    if (!serverBuilder.url) {
      throw new TypeError('URL is a required field!');
    }
    this.name = serverBuilder.name;
    this.url = serverBuilder.url;
    this.auth = serverBuilder.auth || null;
    this.metadata = serverBuilder.metadata || null;
    this.id = MD5(JSON.stringify([this.name, this.url, this.auth, this.metadata]));
  }

  /**
   * Given a relative URL fragment, construct a URL for that fragment on the server.
   * @param forFragment - The URL fragment to append to the server URL.
   * @parm withQuery - Query parameters to be appended to the URL.
   * @returns A complete URL.
   */
  public resolveURL(forFragment?: string, withQuery?: any) {
    if (!this.url) {
      return undefined;
    }
    if (forFragment === undefined) {
      return this.url;
    }
    let uri = URI(this.url);
    if (forFragment.indexOf('/') === 0 || forFragment.indexOf('http') === 0) {
      uri = URI(forFragment);
    } else {
      uri = uri.segment(forFragment);
    }
    if (withQuery !== undefined) {
        uri = uri.addQuery(withQuery);
    }
    return uri.toString();
  }

  /**
   * Check whether the provided server has the same settings as this one.
   */
  public equals(that?: OnmsServer | null) {
    return that
      && this.id === that.id;
  }

  /**
   * Create a new server object from this existing one, with the same ID.
   */
  public clone() {
    const auth = this.auth ? this.auth.clone() : undefined;
    const metadata = this.metadata ? this.metadata.clone() : undefined;
    return new OnmsServerBuilder(this.url)
      .setName(this.name)
      .setAuth(this.auth || undefined)
      .setMetadata(this.metadata || undefined)
      .build();
  }

  /**
   * Get the hostname portion of the URL associated with this server.
   */
  get host() {
    if (!this.url) {
      return undefined;
    }
    return URI(this.url).hostname();
  }

  /** A string representation of this server suitable for display. */
  public toString() {
    if (this.metadata) {
      return 'OpenNMS '
        + (this.metadata.type === ServerTypes.MERIDIAN ? 'Meridian' : 'Horizon')
        + ' ' + this.metadata.version.displayVersion
        + ' at ' + (this.host || this.url);
    } else {
      return 'OpenNMS at ' + (this.host || this.url);
    }
  }
}
