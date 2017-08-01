import {OnmsEnum, forId, forLabel} from '../internal/OnmsEnum';

/**
 * Represents a search property type.
 * @module SearchPropertyType
 */
export class SearchPropertyType extends OnmsEnum<string> {
  /** given an ID, return the matching search property type object */
  public static forId(id: string) {
    return forId(SearchPropertyTypes, id);
  }
}

const SearchPropertyTypes = {
  FLOAT: new SearchPropertyType('FLOAT', 'floating-point number'),
  INTEGER: new SearchPropertyType('INTEGER', 'integer'),
  IP_ADDRESS: new SearchPropertyType('IP_ADDRESS', 'IP address'),
  LONG: new SearchPropertyType('LONG', 'long integer'),
  STRING: new SearchPropertyType('STRING', 'string'),
  TIMESTAMP: new SearchPropertyType('TIMESTAMP', 'date and time'),
};

/** @hidden */
const frozen = Object.freeze(SearchPropertyTypes);
export {frozen as SearchPropertyTypes};
