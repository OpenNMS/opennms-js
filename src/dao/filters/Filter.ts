import {OnmsHTTPOptions} from '../../api/OnmsHTTPOptions';

/**
 * A query filter for DAOs.
 * @module Filter
 * @param T the model type (OnmsAlarm, OnmsEvent, etc.)
 */ /** */
export class Filter<T> {
  /** get the HTTP options associated with this filter */
  public getOptions() {
    return new OnmsHTTPOptions();
  }
}
