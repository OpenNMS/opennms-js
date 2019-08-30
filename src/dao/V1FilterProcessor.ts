import {IHash} from '../internal/IHash';
import {OnmsEnum} from '../internal/OnmsEnum';
import {Util} from '../internal/Util';

import {addParameter, IFilterProcessor} from '../api/IFilterProcessor';

import {Filter} from '../api/Filter';
import {Comparator, Comparators} from '../api/Comparator';
import {Operators} from '../api/Operator';
import {OnmsError} from '../api/OnmsError';
import {Restriction} from '../api/Restriction';
import {NestedRestriction} from '../api/NestedRestriction';

/** @hidden */
const nonExclusiveComparators = [
  Comparators.NULL,
  Comparators.NOTNULL,
];

/** @hidden */
const isExclusive = (comparator: Comparator) => {
  return nonExclusiveComparators.indexOf(comparator) < 0;
};

/**
 * Converts a [[Filter]] into ReSTv1 parameters.
 * @category Filtering API
 */
export class V1FilterProcessor implements IFilterProcessor {
  /** Given a filter, return a hash of URL parameters. */
  public getParameters(filter: Filter): IHash<string|string[]> {
    const ret = {} as IHash<string|string[]>;

    if (filter.limit !== undefined) {
      addParameter(ret, 'limit', filter.limit);
    }

    if (!filter.clauses) {
      return ret;
    }

    for (const clause of filter.clauses) {
      if (clause.operator !== Operators.OR) {
        throw new OnmsError('V1 only supports OR operators!');
      }

      if (clause.restriction instanceof NestedRestriction) {
        throw new OnmsError('V1 does not support nested restrictions!');
      }

      const restriction = clause.restriction as Restriction;
      switch (restriction.comparator) {
        case Comparators.NULL: {
          addParameter(ret, restriction.attribute, 'null');
          break;
        }
        case Comparators.NOTNULL: {
          addParameter(ret, restriction.attribute, 'notnull');
          break;
        }
        default: {
          const comp = restriction.comparator.label.toLowerCase();
          addParameter(ret, 'comparator', comp);
          if (Array.isArray(ret.comparator) && ret.comparator.length > 1) {
            throw new OnmsError('V1 only supports one restriction comparator type!');
          }
          if (restriction.value instanceof OnmsEnum) {
            addParameter(ret, restriction.attribute, (restriction.value as OnmsEnum<any>).label);
          } else if (Util.isDateObject(restriction.value)) {
            const v = Util.toDateString(restriction.value);
            if (v) {
              addParameter(ret, restriction.attribute, v);
            }
          } else {
            addParameter(ret, restriction.attribute, restriction.value);
          }
        }
      }
    }

    if (filter.orderBy && filter.orderBy.length > 0) {
      const orders = filter.orderBy.map((o) => o.order.label).filter((val, index, self) => self.indexOf(val) === index);
      if (orders.length > 1) {
        throw new OnmsError('The V1 ReST API only supports one order (ASC or DESC), they cannot be mixed.');
      }
      addParameter(ret, 'order', orders[0] || 'DESC');
      for (const orderBy of filter.orderBy) {
        addParameter(ret, 'orderBy', orderBy.attribute);
      }
    }

    return ret;
  }
}
