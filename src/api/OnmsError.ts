/**
 * Represents an OpenNMS.js error.  This will eventually have custom stuff to do... stuff.
 * @module OnmsError
 */ /** */
export class OnmsError {
  /** the error code associated with this error */
  public code: number;

  /** the stack trace when this error is created */
  public stack;

  /** the JS Error class associated with this error */
  private error: Error;

  /**
   * Create a new error with the given message.
   * @constructor
   * @param message - the message
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
