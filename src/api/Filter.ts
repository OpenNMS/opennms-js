import {NestedRestriction} from './NestedRestriction';
import {OrderBy} from './OrderBy';

/**
 * A query filter for DAOs.
 * @category Filtering
 */
export class Filter extends NestedRestriction {
  /** given a filter JSON structure, return a Filter object */
  public static fromJson(filter: any): Filter {
    const newFilter = new Filter();
    if (filter) {
      newFilter.limit = filter.limit;
      const nested = NestedRestriction.fromJson(filter);
      newFilter.clauses = nested.clauses;
      if (filter.orderBy && filter.orderBy.length > 0) {
        newFilter.orderBy = filter.orderBy.map((o: any) => OrderBy.fromJson(o));
      }
    }
    return newFilter;
  }

  /** how many results to get back by default */
  public limit = 1000;

  /** how to sort results */
  public orderBy: OrderBy[] = [];

  /** Add the given order criteria to the filter. */
  public withOrderBy(order: OrderBy) {
    this.orderBy.push(order);
    return this;
  }
}
