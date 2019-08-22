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
   */
  private readonly data: any;

  /**
   * The options provided as part of the request that resulted in this erro.
   */
  private readonly options: any;

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
      // workaround, see http://bit.ly/2vllGdD
      Object.setPrototypeOf(this, OnmsError.prototype);
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
