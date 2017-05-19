/**
 * Represents an OpenNMS.js error.  This will eventually have custom stuff to do... stuff.
 * @class
 */
export class OnmsError {
  /** the JS Error class associated with this object */
  private error: Error;

  /**
   * Create a new error with the given message.
   * @constructor
   * @param message - the message
   */
  constructor(public message: string) {
    this.error = new Error(message);
  }

  /**
   * Returns a string representation of this error.
   */
  public toString() {
    return this.error.message;
  }
}
