import {OnmsEnum} from '../internal/OnmsEnum';

/**
 * Represents a filter comparator.
 * @module Comparator
 */ /** */
export class Operator extends OnmsEnum<number> {
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
export const Operators = Object.freeze({
  AND: new Operator(1, 'AND'),
  OR: new Operator(2, 'OR'),
});
