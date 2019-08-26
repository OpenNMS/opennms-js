import {OnmsHTTPOptions} from './OnmsHTTPOptions';
import {OnmsResult} from './OnmsResult';
import {OnmsServer} from './OnmsServer';

/**
 * Interface for making ReST calls to an HTTP server.
 *
 * Notes to implementors:
 * - Implementations of this interface MUST have a constructor that allows an empty
 *   constructor to be passed (although it is OK to take optional arguments for
 *   the purposes of unit testing or convenience).
 * - Implementations MUST always use the current state of the `server` config property
 *   when creating requests.  If the `server` property changes, the implementation
 *   should do whatever is necessary to reconfigure itself.
 * - Implementations MUST follow this precedence for resolving the preferred
 *   [[OnmsServer]] object to use when making an individual connection:
 *   1. The `server` property on the passed [[OnmsHTTPOptions]] on individual
 *      method calls.
 *   2. The `server` property in the `options` property of the implementation.
 *   3. The `server` property of the implementation.
 * - Implementations MUST follow this precedence for resolving the preferred
 *   [[OnmsAuthConfig]] to use when making an individual connection:
 *   1. The `auth` property on the passed [[OnmsHTTPOptions]] on individual
 *      method calls.
 *   2. The `auth` property on the `options` property of the implementation.
 *   3. The `auth` property on the `server` property of the implementation.
 *
 * Note that if you subclass [[AbstractHTTP]], [[AbstractHTTP.getOptions]]
 * will automatically provide you a hydrated [[OnmsHTTPOptions]] that handles
 * most of this precedence for combining the server metadata.
 *
 * @interface
 * @category Rest
 */
export interface IOnmsHTTP {
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
