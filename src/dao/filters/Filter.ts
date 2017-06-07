import {OnmsHTTPOptions} from '../../api/OnmsHTTPOptions';

/**
 * A query filter for DAOs.
 * @module Filter
 * @param T the model type (OnmsAlarm, OnmsEvent, etc.)
 */ /** */
export class Filter<T> {
  /** how many results to get back by default */
  public limit = 1000;

  /** what type of match to use in queries */
  public match?: 'any' | 'all';

  /** the type of comparator to use in queries */
  public comparator?: string;

  /** get the HTTP options associated with this filter */
  public getOptions() {
    const ret = new OnmsHTTPOptions();
    ret.parameters = {
      limit: this.limit,
    };

    if (this.match) {
      ret.parameters.match = this.match;
    }

    if (this.comparator) {
      ret.parameters.comparator = this.comparator;
    }

  	return ret;
  }
}
