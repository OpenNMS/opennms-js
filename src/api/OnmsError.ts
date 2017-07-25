/**
 * Represents an OpenNMS.js error.  This will eventually have custom stuff to do... stuff.
 * @module OnmsError
 */
export class OnmsError {
  /** The error code associated with this error. */
  public code: number;

  /** The stack trace when this error is created. */
  public stack;

  /** The JS Error class associated with this error. */
  private error: Error;

  /**
   * Create a new error.
   * @constructor
   * @param message - The error message.
   * @param code - An optional error code to associate with the error.
   */
  constructor(public message: string, code?: number) {
    this.error = new Error(message);
    this.code = code;
    this.stack = this.error.stack;
  }

  /**
   * Returns a string representation of this error.
   */
  public toString() {
    if (this.code) {
      return 'Error ' + this.code + ': ' + this.error.message;
    } else {
      return 'Error: ' + this.error.message;
    }
  }
}
