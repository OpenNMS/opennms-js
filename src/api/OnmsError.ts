/**
 * Represents an OpenNMS.js error.  This will eventually have custom stuff to do... stuff.
 * @module OnmsError
 */
export class OnmsError extends Error {
  /**
   * The response status code, if any.
   * @hidden
   */
  private statusCode: number;

  private data: any;

  private options: any;

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
