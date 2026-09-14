/**
 * Represents an OpenNMS.js error.
 * @category Internal
 */
export class OnmsError extends Error {
  /**
   * The response status code, if any.
   * @hidden
   */
  private readonly statusCode?: number;

  /**
   * The data (payload) associated with a response.
   * @hidden
   */
  public readonly data: any;

  /**
   * The options provided as part of the request that resulted in this error.
   *
   * Note: for requests that used authentication this holds the request configuration,
   * including an `Authorization` header and the credentials it was derived from. Do not
   * log it or serialize it into user-visible output.
   * @hidden
   */
  public readonly options: any;

  /** The error code associated with this error. */
  public get code() {
    return this.statusCode;
  }

  /**
   * Create a new error.
   * @constructor
   * @param message - The error message.
   * @param code - An optional error code to associate with the error.
   */
  constructor(message: string, code?: number, options?: any, data?: any) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = code;
    this.data = data;
    this.options = options;
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error(message)).stack;
    }
    // Restore the prototype chain, which extending a built-in like Error otherwise breaks.
    // Use `new.target` rather than `OnmsError.prototype`, so that a subclass such as
    // [[GrafanaError]] stays `instanceof` itself; see http://bit.ly/2vllGdD
    Object.setPrototypeOf(this, (new.target && new.target.prototype) || OnmsError.prototype);
  }

  /**
   * Returns a string representation of this error.
   */
  public toString() {
    if (this.code) {
      return 'Error ' + this.code + ': ' + this.message;
    } else {
      return 'Error: ' + this.message;
    }
  }
}
