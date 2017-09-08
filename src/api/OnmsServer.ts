/** @hidden */
// tslint:disable-next-line
const URI = require('urijs');

import {OnmsAuthConfig} from '../api/OnmsAuthConfig';
import {ServerMetadata} from './ServerMetadata';
import {ServerTypes} from './ServerType';
import {UUID} from '../internal/UUID';

/**
 * Represents a remote OpenNMS server.
 * @module OnmsServer
 */
export class OnmsServer {
  /** A unique identifier for this server. */
  public id: string;

  /** An optional name associated with this server. */
  public name?: string;

  /** The base URL to the server. */
  public url: string;

  /** The authorization configuration associated with the server. */
  public auth: OnmsAuthConfig;

  /** The capabilities of the server */
  public metadata: ServerMetadata;

  /**
   * Construct a new OnmsServer object representing a remote server.
   * @example
   * <caption>provide a pre-existing [[OnmsAuthConfig]] for auth</caption>
   * ```javascript
   * const server = new OnmsServer('Test', 'https://myserver/opennms/', auth);
   * ```
   * @example
   * <caption>provide a username and password for auth</caption>
   * ```javascript
   * const server = new OnmsServer('Test', 'https://myserver/opennms/', 'admin', 'admin');
   * ```
   * @constructor
   * @param name - A name for the server suitable for display.
   * @param url - The URL to the server.
   * @param auth - An [[OnmsAuthConfig]], or the username to authorize as.
   * @param password - The password to authorize with if a username was
   *                   supplied to the `auth` parameter.
   */
  constructor(name?: string, url?: string, auth?: OnmsAuthConfig | string, password?: string) {
    this.id = UUID.generate();
    this.name = name;
    this.url = url;
    if (auth instanceof OnmsAuthConfig) {
      this.auth = auth;
    } else {
      this.auth = new OnmsAuthConfig(auth, password);
    }
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
    if (forFragment.indexOf('/') === 0 || forFragment.indexOf('http') === 0) {
      return forFragment;
    }
    let uri = URI(this.url).segment(forFragment);
    if (withQuery !== undefined) {
        uri = uri.addQuery(withQuery);
    }
    return uri.toString();
  }

  /**
   * Create a new server object from this existing one.
   */
  public clone() {
    const auth = (this.auth ? this.auth.clone() : undefined);
    const ret = new OnmsServer(this.name, this.url, auth);
    ret.metadata = (this.metadata ? this.metadata.clone() : undefined);
    return ret;
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
