import {OnmsEnum, forId, forLabel} from '../internal/OnmsEnum';
import {Comparator, Comparators} from './Comparator';

/**
 * Represents a search property type.
 * @module SearchPropertyType
 */
export class SearchPropertyType extends OnmsEnum<string> {
  /** given an ID, return the matching search property type object */
  public static forId(id: string) {
    return forId(SearchPropertyTypes, id);
  }

  /** supported comparators. */
  private comparators: Comparator[];

  constructor(id: string, label: string, someComparators: Comparator[]) {
    super(id, label);
    this.comparators = someComparators;
  }

  /**
   * Returns the comparators supported by this type.
   *
   * @returns {Comparator[]} the supported comparators.
   */
  public getComparators() {
    return this.comparators;
  }
}

/** @hidden */
const StringComparators = [
    Comparators.EQ, Comparators.NE,
];

/** @hidden */
const NumberComparators = [
    Comparators.EQ, Comparators.NE,
    Comparators.GE, Comparators.GT,
    Comparators.LE, Comparators.LT,
];

const SearchPropertyTypes = {
  FLOAT: new SearchPropertyType('FLOAT', 'floating-point number', NumberComparators),
  INTEGER: new SearchPropertyType('INTEGER', 'integer', NumberComparators),
  IP_ADDRESS: new SearchPropertyType('IP_ADDRESS', 'IP address', StringComparators),
  LONG: new SearchPropertyType('LONG', 'long integer', NumberComparators),
  STRING: new SearchPropertyType('STRING', 'string', StringComparators),
  TIMESTAMP: new SearchPropertyType('TIMESTAMP', 'date and time', NumberComparators),
};

/** @hidden */
const frozen = Object.freeze(SearchPropertyTypes);
export {frozen as SearchPropertyTypes};
