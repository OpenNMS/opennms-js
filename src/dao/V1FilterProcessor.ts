import {IHash} from '../internal/IHash';
import {OnmsEnum} from '../internal/OnmsEnum';
import {Util} from '../internal/Util';

import {IFilterProcessor} from '../api/IFilterProcessor';

import {Filter} from '../api/Filter';
import {Comparators} from '../api/Comparator';
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
const isExclusive = (comparator) => {
  return nonExclusiveComparators.indexOf(comparator) < 0;
};

/**
 * Converts a [[Filter]] into ReSTv1 parameters.
 * @module V1FilterProcessor
 */
export class V1FilterProcessor implements IFilterProcessor {
  /** Given a filter, return a hash of URL parameters. */
  public getParameters(filter: Filter) {
    const ret = {} as IHash<string>;

    if (filter.limit !== undefined) {
      ret.limit = '' + filter.limit;
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
          ret[restriction.attribute] = 'null';
          break;
        }
        case Comparators.NOTNULL: {
          ret[restriction.attribute] = 'notnull';
          break;
        }
        default: {
          const comp = restriction.comparator.label.toLowerCase();
          if (ret.comparator && ret.comparator !== comp) {
            throw new OnmsError('V1 only supports one restriction comparator type!');
          }
          ret.comparator = comp;
          if (restriction.value instanceof OnmsEnum) {
            ret[restriction.attribute] = (restriction.value as OnmsEnum<any>).label;
          } else if (Util.isDateObject(restriction.value)) {
            ret[restriction.attribute] = Util.toDateString(restriction.value);
          } else {
            ret[restriction.attribute] = '' + restriction.value;
          }
        }
      }
    }

    return ret;
  }
}
