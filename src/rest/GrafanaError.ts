import {OnmsError} from '../api/OnmsError';

/**
 * A Grafana error object.
 * @category Rest
 */
export class GrafanaError extends OnmsError {
  /**
   * The request options (configuration).
   *
   * Note: this holds the same object as [[OnmsError.options]], which for authenticated
   * requests includes an `Authorization` header and the credentials it was derived from.
   * Do not log it or serialize it into user-visible output.
   * @hidden
   */
  public readonly config?: any;

  /**
   * Construct a new Grafana error.
   * @param message - The status message associated with the result.
   * @param code - The response code of the response.
   * @param options - The request options (configuration).
   * @param data - The payload of the response.
   */
  constructor(message: string, code?: number, options?: any, data?: any) {
    super(message, code, options, data);
    if (options) {
      this.config = options;
    }
  }

}
