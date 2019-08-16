// tslint:disable:max-classes-per-file

/** @hidden */
// tslint:disable-next-line
const URI = require('urijs');

import {OnmsAuthConfig} from '../api/OnmsAuthConfig';
import {ServerMetadata} from './ServerMetadata';
import {ServerTypes} from './ServerType';

import {MD5} from 'object-hash';

/**
 * A builder for [[OnmsServer]].  Create a new one with `OnmsServer.newBuilder()`.
 */
// tslint:disable:completed-docs variable-name whitespace
export class OnmsServerBuilder {
  private _name?: string;
  private _url?: string;
  private _auth?: OnmsAuthConfig;
  private _metadata?: ServerMetadata;

  /**
   * Construct a new builder from an existing options object, if provided.
   */
  public constructor(server?: OnmsServer) {
    if (server) {
      this._name = server.name;
      this._url = server.url;
      this._auth = server.auth ? server.auth.clone() : undefined;
      this._metadata = server.metadata ? server.metadata.clone() : undefined;
    }
  }

  /** Build the [[OnmsServer]] object. */
  public build(): OnmsServer {
    if (!this._url) {
      throw new TypeError('URL is a required field!');
    }
    return new OnmsServer(
      this._name,
      this._url,
      this._auth ? this._auth.clone() : undefined,
      this._metadata ? this._metadata.clone() : undefined,
    );
  }

  /**
   * The display name of the server.
   *
   * If `undefined` is passed, the name will be unset.
   * @param name the server name
   */
  public name(name?: string) {
    this._name = name;
    return this;
  }

  /**
   * The URL of the server.
   *
   * If `undefined` is passed, the URL will be unset.
   * @param url the server's URL
   */
  public url(url?: string) {
    this._url = url;
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
   * The server metadata to associate with the server.
   *
   * If `undefined` is passed, no metadata will be used.
   * @param metadata the metadata
   */
  public metadata(metadata?: ServerMetadata) {
    this._metadata = metadata;
    return this;
  }
}
// tslint:enable:completed-docs variable-name whitespace

/**
 * Represents a remote OpenNMS server.
 * @module OnmsServer
 */
export class OnmsServer {
  /**
   * Create a new builder for an [[OnmsServer]] object.
   * @param server if an existing server object is passed, the builder will be pre-populated
   */
  public static newBuilder(server?: OnmsServer) {
    return new OnmsServerBuilder(server);
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
  public constructor(name: string | undefined, url: string, auth?: OnmsAuthConfig, metadata?: ServerMetadata) {
    this.name = name;
    this.url = url;
    this.auth = auth || null;
    this.metadata = metadata || null;
    this.id = MD5([this.name, this.url, this.auth, this.metadata]);
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
    return new OnmsServer(this.name, this.url, auth, metadata);
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
