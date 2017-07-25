import {OnmsEnum} from '../internal/OnmsEnum';

/**
 * Represents a filter comparator.
 * @module Comparator
 */
export class Operator extends OnmsEnum<number> {
  /** Aliases for the command-line. */
  private aliases = [] as string[];

  constructor(id: number, label: string, ...aliases: string[]) {
    super(id, label);
    this.aliases = aliases;
  }

  /** Whether this comparator matches the given comparator string. */
  public matches(comparator: string) {
    return (comparator.toLowerCase() === this.label.toLowerCase())
      || this.aliases.indexOf(comparator) >= 0;
  }
}

/* tslint:disable:object-literal-sort-keys */

const Operators = {
  /** AND (all must match) */
  AND: new Operator(1, 'AND'),

  /** OR (at least one must match) */
  OR: new Operator(2, 'OR'),
};

/** @hidden */
const frozen = Object.freeze(Operators);

export {frozen as Operators};
