import {OnmsError} from './OnmsError';

/**
 * An {@link OnmsHTTP} query result.
 * @module OnmsResult
 */ /** */
export class OnmsResult<T> {
  /** create a new error result */
  public static error(message: string, code?: number) {
    return new OnmsResult(undefined, message, code);
  }

  /** create a new "OK" result */
  public static ok(response: any, message?: string, code?: number, type?: string) {
    return new OnmsResult(response, message || 'OK', code || 200, type);
  }

  /** the data, if any */
  public data: T;

  /** the request type, if any */
  public type: string;

  /** the status message associated with this result */
  public message: string;

  /** the response code associated with this result */
  public code: number;

  /**
   * construct a new result
   * @param message the status message
   * @param code the response code
   */
  constructor(data: T, message?: string, code?: number, type?: string) {
    this.data = data;
    this.message = message;
    this.code = code;
    this.type = type;
  }

  /** whether this response is a successful response */
  public isSuccess() {
    return this.code === 200 || this.code === 204;
  }
}
