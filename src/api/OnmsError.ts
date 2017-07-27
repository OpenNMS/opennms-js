/**
 * Represents an OpenNMS.js error.  This will eventually have custom stuff to do... stuff.
 * @module OnmsError
 */
export class OnmsError {
  /**
   * The response status code, if any.
   * @hidden
   */
  private statusCode: number;

  /**
   * We need a real JS Error because it can't be subclassed.
   * @hidden
   */
  private errorObj: Error;

  /**
   * The stack trace so this object is loggable.
   * @hidden
   */
  private stack;

  /** The error code associated with this error. */
  public get code() {
    return this.statusCode;
  }

  /** The JS Error class associated with this error. */
  public get error() {
    return this.errorObj;
  }

  /** The error message. */
  public get message() {
    return this.errorObj.message;
  }

  /**
   * Create a new error.
   * @constructor
   * @param message - The error message.
   * @param code - An optional error code to associate with the error.
   */
  constructor(public mess: string, code?: number) {
    this.errorObj = new Error(mess);
    this.statusCode = code;
    this.stack = this.errorObj.stack;
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
