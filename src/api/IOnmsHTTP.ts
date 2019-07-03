import {IFilterProcessor} from './IFilterProcessor';

import {OnmsHTTPOptions} from './OnmsHTTPOptions';
import {OnmsResult} from './OnmsResult';
import {OnmsServer} from './OnmsServer';

/**
 * Interface for making ReST calls to an HTTP server.
 * @interface
 * @module IOnmsHTTP
 *
 * Notes to implementors:
 * - Implementations of this interface MUST have a constructor that allows an empty
 *   constructor to be passed (although it is OK to take optional arguments for
 *   the purposes of unit testing).
 * - Implementations MUST always use the current state of the 'server' config property
 *   when creating requests.  If the 'server' property changes, the implementation
 *   should do whatever is necessary to reconfigure itself.
 * - Implementations SHOULD prefer the auth in the OnmsServer (if available)
 *   over the one in the OnmsHTTPOptions, but should fall back if no auth
 *   configuration is supplied in the server property.
 */
export interface IOnmsHTTP {
  /**
   * Whether this plugin is valid and can be initialized.
   *
   * Implementations can use this to signal whether any optional dependencies
   * or other conditions have been met for the plugin to work.
   */
  isValid: boolean;

  /** The server associated with this instance. */
  server?: OnmsServer | null;

  /** The default options used when making requests with this instance. */
  options?: OnmsHTTPOptions | null;

  /**
   * Perform an HTTP GET to the provided URL.
   * @param url The URL to connect to.
   * @param options The [[OnmsHTTPOptions]] options to use when connecting.
   * @returns An [[OnmsResult]] result object.
   */
  get(url: string, options?: OnmsHTTPOptions): Promise<OnmsResult<any>>;

  /**
   * Perform an HTTP HEAD to the provided URL.
   * @param url The URL to connect to.
   * @param options The [[OnmsHTTPOptions]] options to use when connecting.
   * @returns An [[OnmsResult]] result object.
   */
  head(url: string, options?: OnmsHTTPOptions): Promise<OnmsResult<any>>;

  /**
   * Perform an HTTP PUT to the provided URL.
   * @param url The URL to connect to.
   * @param options The [[OnmsHTTPOptions]] options to use when connecting.
   * @returns An [[OnmsResult]] result object.
   */
  put(url: string, options?: OnmsHTTPOptions): Promise<OnmsResult<any>>;

  /**
   * Perform an HTTP POST to the provided URL.
   * @param url The URL to connect to.
   * @param options The [[OnmsHTTPOptions]] options to use when connecting.
   * @returns An [[OnmsResult]] result object.
   */
  post(url: string, options?: OnmsHTTPOptions): Promise<OnmsResult<any>>;

  /**
   * Perform an HTTP DELETE to the provided URL.
   * @param url The URL to connect to.
   * @param options The [[OnmsHTTPOptions]] options to use when connecting.
   * @returns An [[OnmsResult]] result object.
   */
  httpDelete(url: string, options?: OnmsHTTPOptions): Promise<OnmsResult<any>>;
}
