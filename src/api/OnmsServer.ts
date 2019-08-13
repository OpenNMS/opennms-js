/** @hidden */
// tslint:disable-next-line
const URI = require('urijs');

import {OnmsAuthConfig} from '../api/OnmsAuthConfig';
import {ServerMetadata} from './ServerMetadata';
import {ServerTypes} from './ServerType';

import {MD5} from 'object-hash';

/**
 * Represents a remote OpenNMS server.
 * @module OnmsServer
 */
export class OnmsServer {
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
   * Create a new server object from this existing one, with the provided authentication settings.
   * @param auth The authentication config
   */
  public withAuth(auth: OnmsAuthConfig) {
    const metadata = this.metadata ? this.metadata.clone() : undefined;
    return new OnmsServer(this.name, this.url, auth, metadata);
  }

  /**
   * Create a new server object from this existing one, with the provided server metadata.
   */
  public withMetadata(metadata: ServerMetadata) {
    const auth = this.auth ? this.auth.clone() : undefined;
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
