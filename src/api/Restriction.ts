import {Comparator, Comparators} from './Comparator';
import {log, catAPI} from './Log';

const namePattern = /^(.*?)\s+(eq|ne|ilike|like|gt|lt|ge|le|null|isnull|notnull)\s+(.*?)$/i;
const symbolPattern = /^(\w+?)\s*(\=\=|\=|\!\=|\>\=|\<\=|\>|\<)\s*(\w+?)$/;

/**
 * A query restriction.
 * @module Restriction
 */
export class Restriction {
  /** Given a restriction JSON structure, return a Restriction object. */
  public static fromJson(restriction) {
    const comparator = Comparator.find(restriction.comparator.label);
    return new Restriction(restriction.attribute, comparator, restriction.value);
  }

  /**
   * Convert a filter string into a restriction.
   */
  public static fromString(filter: string) {
    let match = filter.match(namePattern);
    if (!match) {
      match = filter.match(symbolPattern);
    }
    if (match) {
      const comp = Comparator.find(match[2]);
      if (comp) {
        return new Restriction(match[1], comp, match[3]);
      }
      log.warn('Restriction.fromString matched "' + filter +
        '", but was unable to match "' + match[2] + '" to a comparator.', catAPI);
    } else {
      log.debug('Restriction.fromString failed to match "' + filter + '".', catAPI);
    }
    return null;
  }

  /** The model attribute (name, id, etc.) to query. */
  public attribute: string;

  /** The comparator to use when querying. */
  public comparator: Comparator;

  /** The value to compare the attribute property to. */
  public value?: any;

  constructor(attribute: string, comparator: Comparator, value?: any) {
    this.attribute = attribute;
    this.comparator = comparator;
    this.value = value;
  }

  /** A human-readable string for this restriction. */
  public toString() {
    return this.attribute + ' ' + this.comparator.label + (this.value === undefined ? '' : ' ' + this.value);
  }
}
