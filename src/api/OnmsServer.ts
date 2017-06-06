// import moment from 'moment/src/moment';

/** @hidden */
// tslint:disable-next-line
const URI = require('urijs');

import {OnmsAuthConfig} from '../api/OnmsAuthConfig';
import {ServerMetadata} from './ServerMetadata';
import {UUID} from '../internal/UUID';

/**
 * Represents a remote OpenNMS server.
 * @module OnmsServer
 */ /** */
export class OnmsServer {
  /** A unique identifier for this server */
  public id: string;

  /** A name associated with this server (undefined is allowed) */
  public name: string;

  /** The base URL to the server */
  public url: string;

  /** The authorization configuration associated with the server */
  public auth: OnmsAuthConfig;

  /** The capabilities of the server */
  public metadata: ServerMetadata;

  /**
   * Construct a new OnmsServer object representing a remote server.
   * @constructor
   */
  constructor(name?: string, url?: string, auth?: OnmsAuthConfig) {
    this.id = UUID.generate();
    this.name = name;
    this.url = url;
    this.auth = auth;
  }

  /**
   * Given a relative URL fragment, construct a URL for that fragment on the server.
   * @param forFragment - the URL fragment to append to the server URL
   * @returns a complete URL
   */
  public resolveURL(forFragment?: string) {
    if (!this.url) {
      return undefined;
    }
    if (forFragment === undefined) {
      return this.url;
    }
    if (forFragment.indexOf('/') === 0 || forFragment.indexOf('http') === 0) {
      return forFragment;
    }
    return URI(this.url).segment(forFragment).toString();
  }

  /**
   * Return the hostname portion of the URL associated with this server.
   */
  get host() {
    if (!this.url) {
      return undefined;
    }
    return URI(this.url).hostname();
  }
}
