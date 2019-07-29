
import {NestedRestriction} from './NestedRestriction';

/**
 * A query filter for DAOs.
 * @module Filter
 * @param T the model type (OnmsAlarm, OnmsEvent, etc.)
 */
export class Filter extends NestedRestriction {
  /** given a filter JSON structure, return a Filter object */
  public static fromJson(filter: any): Filter {
    const newFilter = new Filter();
    if (filter) {
      newFilter.limit = filter.limit;
      const nested = NestedRestriction.fromJson(filter);
      newFilter.clauses = nested.clauses;
    }
    return newFilter;
  }

  /** how many results to get back by default */
  public limit = 1000;

  /** TODO: add (multiple) orderBy/order support */
}
