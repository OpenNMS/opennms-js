import {OnmsHTTPOptions} from '../api/OnmsHTTPOptions';
import {Restriction} from './Restriction';

/**
 * A query filter for DAOs.
 * @module Filter
 * @param T the model type (OnmsAlarm, OnmsEvent, etc.)
 */ /** */
export class Filter {
  /** how many results to get back by default */
  public limit = 1000;

  /** TODO: add (multiple) orderBy/order support */

  /** the query restrictions to use when making requests */
  public restrictions = [] as Restriction[];

  constructor(...restrictions: Restriction[]) {
    this.restrictions = restrictions;
  }
}
