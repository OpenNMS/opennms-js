import {IHash} from '../internal/IHash';
import {OnmsEnum} from '../internal/OnmsEnum';

import {IFilterProcessor} from '../api/IFilterProcessor';

import {Filter} from '../api/Filter';
import {Comparator, COMPARATORS} from '../api/Comparator';
import {OnmsError} from '../api/OnmsError';

const nonExclusiveComparators = [
  COMPARATORS.NULL,
  COMPARATORS.NOTNULL,
];

const isExclusive = (comparator) => {
  return nonExclusiveComparators.indexOf(comparator) < 0;
};

/**
 * OpenNMS V1 ReST filter processor
 * @module V1FilterProcessor
 */ /** */
export class V1FilterProcessor implements IFilterProcessor {
  /** given a filter, return a hash of URL parameters */
  public getParameters(filter: Filter<any>) {
    const ret = {} as IHash<string>;

    if (filter.limit !== undefined) {
      ret.limit = '' + filter.limit;
    }

    for (const restriction of filter.restrictions) {
      switch (restriction.comparator) {
        case COMPARATORS.NULL: {
          ret[restriction.attribute] = 'null';
          break;
        }
        case COMPARATORS.NOTNULL: {
          ret[restriction.attribute] = 'notnull';
          break;
        }
        default: {
          const comp = restriction.comparator.label.toLowerCase();
          if (ret.comparator && ret.comparator !== comp) {
            throw new OnmsError('V1 only supports one restriction comparator type!');
          }
          ret.comparator = comp;
          let value = '' + restriction.value;
          if (restriction.value instanceof OnmsEnum) {
            value = (restriction.value as OnmsEnum).label;
          }
          ret[restriction.attribute] = value;
        }
      }
    }

    return ret;
  }
}
