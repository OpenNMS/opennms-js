export class OnmsError {
  private _error: Error;

  constructor(public message: string) {
    this._error = new Error(message);
  }

  toString() {
    return this._error.message;
  }
}