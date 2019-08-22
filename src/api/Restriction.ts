import {Comparator, Comparators} from './Comparator';
import {log} from './Log';

/** @hidden */
const namePattern = /^(.*?)\s+(eq|ne|ilike|like|gt|lt|ge|le|null|isnull|notnull)\s+(.*?)$/i;

/** @hidden */
const symbolPattern = /^(\w+?)\s*(\=\=|\=|\!\=|\>\=|\<\=|\>|\<)\s*(\w+?)$/;

/**
 * A query restriction.
 * @category Filtering API
 */
export class Restriction {
  /** Given a restriction JSON structure, return a Restriction object. */
  public static fromJson(restriction: any) {
    const comparator = Comparator.find(restriction.comparator.label);
    if (!comparator) {
      log.warn('Restriction.fromString: unable to match comparator: ' + JSON.stringify(restriction.comparator));
    }
    return new Restriction(restriction.attribute, comparator || Comparators.EQ, restriction.value);
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
        '", but was unable to match "' + match[2] + '" to a comparator.');
    } else {
      log.debug('Restriction.fromString failed to match "' + filter + '".');
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
