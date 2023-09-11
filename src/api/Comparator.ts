import {OnmsEnum} from '../internal/OnmsEnum';

/**
 * Represents a filter comparator.
 * @category Filtering
 */
export class Comparator extends OnmsEnum<number> {
  /** Find the comparator that matches the given comparator string. */
  public static find(comparator: string) {
    for (const key of Object.keys(Comparators)) {
      const comp = Comparators[key];
      if (comp.matches(comparator)) {
        return comp;
      }
    }
    return null;
  }

  /** Aliases for the command-line. */
  private aliases = [] as string[];

  constructor(id: number, label: string, ...aliases: string[]) {
    super(id, label);
    this.aliases = aliases;
  }

  /** Whether this comparator matches the given comparator string. */
  public matches(comparator: string) {
    const compareTo = comparator.toUpperCase();
    return (compareTo === this.label.toUpperCase())
      || this.aliases.indexOf(compareTo) >= 0;
  }
}

/* eslint-disable */

/**
 * Contains constant instances of all available comparators.
 * @category Filtering
 */
export const Comparators = {
  /** Equals (`=` or `==`) */
  EQ: new Comparator(1, 'EQ', '=', '=='),

  /** Not Equals (`!=`) */
  NE: new Comparator(2, 'NE', '!='),

  /** Case-Insensitive Substring Match (`ILIKE`) */
  ILIKE: new Comparator(3, 'ILIKE'),

  /** Case-Sensitive Substring Match (`LIKE`) */
  LIKE: new Comparator(4, 'LIKE'),

  /** Greater Than (`>`) */
  GT: new Comparator(5, 'GT', '>'),

  /** Less Than (`<`) */
  LT: new Comparator(6, 'LT', '<'),

  /** Greater Than or Equal To (`>=`) */
  GE: new Comparator(7, 'GE', '>='),

  /** Less Than or Equal To (`<=`) */
  LE: new Comparator(8, 'LE', '<='),

  /** Is Null (`NULL`) */
  NULL: new Comparator(9, 'NULL', 'ISNULL'),

  /** Is Not Null (`NOTNULL`) */
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
} as { [key: string]: Comparator };
Object.freeze(Comparators);
