declare const Promise;

import {OnmsHTTPOptions} from './OnmsHTTPOptions';
import {OnmsResult} from './OnmsResult';
import {OnmsServer} from '../model/OnmsServer';

/**
 * Interface for making ReST calls to an HTTP server.
 * @interface
 * @module OnmsHTTP
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
 */ /** */

export interface IOnmsHTTP {
  /** the server associated with this instance */
  server: OnmsServer;

  /** the options used when making requests */
  options: OnmsHTTPOptions;

  /**
   * Perform an HTTP get to the provided URL.
   * @param url the URL to connect to
   * @param options the {@link OnmsHTTPOptions} options to use when connecting
   * @returns an {@link OnmsResult} result object
   */
  get(url: string, options?: OnmsHTTPOptions): Promise<OnmsResult>;
}
