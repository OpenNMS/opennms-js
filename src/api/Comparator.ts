import {OnmsEnum} from '../internal/OnmsEnum';

/**
 * Represents a filter comparator.
 * @module Comparator
 */ /** */
export class Comparator extends OnmsEnum {
  /** aliases for the command-line */
  private aliases = [] as string[];

  constructor(id: number, label: string, ...aliases: string[]) {
    super(id, label);
    this.aliases = aliases;
  }

  /** whether this comparator matches the given comparator string */
  public matches(comparator: string) {
    return (comparator.toLowerCase() === this.label.toLowerCase())
      || this.aliases.indexOf(comparator) >= 0;
  }
}

/* tslint:disable:object-literal-sort-keys */

/** @hidden */
export const Comparators = Object.freeze({
  EQ: new Comparator(1, 'EQ', '=', '=='),
  NE: new Comparator(2, 'NE', '!='),
  ILIKE: new Comparator(3, 'ILIKE'),
  LIKE: new Comparator(4, 'LIKE'),
  GT: new Comparator(5, 'GT', '>'),
  LT: new Comparator(6, 'LT', '<'),
  GE: new Comparator(7, 'GE', '>='),
  LE: new Comparator(8, 'LE', '<='),
  NULL: new Comparator(9, 'NULL'),
  NOTNULL: new Comparator(10, 'NOTNULL'),

  /*
  ALL: new Comparator(9, 'ALL'),
  ANY: new Comparator(10, 'ANY'),
  BETWEEN: new Comparator(15, 'BETWEEN'),
  NOT: new Comparator(14, 'NOT'),
  IN: new Comparator(13, 'IN'),
  IPLIKE: new Comparator(17, 'IPLIKE'),
  SQL: new Comparator(16, 'SQL'),
  */
});
