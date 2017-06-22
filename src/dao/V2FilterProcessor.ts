import {IHash} from '../internal/IHash';

import {IFilterProcessor} from '../api/IFilterProcessor';

import {Filter} from '../api/Filter';
import {Comparator, Comparators} from '../api/Comparator';
import {Restriction} from '../api/Restriction';
import {OnmsError} from '../api/OnmsError';

/**
 * OpenNMS V2 ReST filter processor
 * @module V2FilterProcessor
 */ /** */
export class V2FilterProcessor implements IFilterProcessor {

  /** constant used to represent null values in the V2 API */
  public static NULL_VALUE = '\u0000';

  /** constant used to represent null dates in the V2 API
   *  this must be explicitly set as the restriction value when using
   *  either the NULL or NOTNULL comparators on date fields
   */
  public static NULL_DATE = '1970-01-01T00:00:00.000+0000';

  /**
   * given a comparator, convert it to a correspond comparator
   * that can be used in the FIQL expression
   */
  private static getFIQLComparator(comparator: Comparator) {
    switch (comparator) {
      case Comparators.EQ:
      case Comparators.NULL:
        return '==';
      case Comparators.NE:
      case Comparators.NOTNULL:
        return '!=';
      case Comparators.GT:
        return '=gt=';
      case Comparators.LT:
        return '=lt=';
      case Comparators.GE:
        return '=ge=';
      case Comparators.LE:
        return '=le=';
      case Comparators.LIKE:
        return '==';
      case Comparators.ILIKE:
      default:
        throw new OnmsError('Unsupported comparator type: ' + comparator);
    }
  }

  /**
   * given a restriction, compute the value to use in the FIQL expression
   */
  private static getFIQLValue(restriction: Restriction) {
    switch (restriction.comparator) {
      case Comparators.NULL:
      case Comparators.NOTNULL:
        return restriction.value === undefined ? V2FilterProcessor.NULL_VALUE : restriction.value;
      case Comparators.LIKE:
        return '*' + restriction.value + '*';
      default:
        return restriction.value;
    }
  }

  /** given a filter, return a hash of URL parameters */
  public getParameters(filter: Filter) {
    const ret = {} as IHash<string>;

    if (filter.limit !== undefined) {
      ret.limit = '' + filter.limit;
    }

    const terms = [];
    for (const restriction of filter.restrictions) {
      const comp = V2FilterProcessor.getFIQLComparator(restriction.comparator);
      const value = V2FilterProcessor.getFIQLValue(restriction);
      terms.push([restriction.attribute, comp, value].join(''));
    }

    if (terms.length > 0) {
      ret.search = terms.join(';');
    }

    return ret;
  }

}
