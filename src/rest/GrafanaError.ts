import {OnmsError} from '../api/OnmsError';

/**
 * A Grafana error object.
 * @category Rest API
 */
export class GrafanaError extends OnmsError {
  /**
   * The request options (configuration).
   * @hidden
   */
  private config?: any;

  /**
   * Construct a new Grafana error.
   * @param message The status message associated with the result.
   * @param code The response code of the response.
   * @param options The request options (configuration).
   * @param data The payload of the response.
   */
  constructor(message: string, code?: number, options?: any, data?: any) {
    super(message, code, options, data);
    if (options) {
      this.config = options;
    }
  }

}
