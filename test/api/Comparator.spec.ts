declare const describe, beforeEach, it, expect;

import {Comparator, Comparators} from '../../src/api/Comparator';

const matches = {
  '=': Comparators.EQ,
  '==': Comparators.EQ,
  'eq': Comparators.EQ,
  '!=': Comparators.NE,
  'ne': Comparators.NE,
  'ilike': Comparators.ILIKE,
  'like': Comparators.LIKE,
  '>': Comparators.GT,
  'gt': Comparators.GT,
  '<': Comparators.LT,
  'lt': Comparators.LT,
  '>=': Comparators.GE,
  'ge': Comparators.GE,
  '<=': Comparators.LE,
  'le': Comparators.LE,
  'null': Comparators.NULL,
  'isnull': Comparators.NULL,
  'notnull': Comparators.NOTNULL
}

describe('Comparators: Lower-Case', () => {
  for (const match in matches) {
    const comparator = matches[match];
    it(comparator.label + ' should match ' + match.toLowerCase(), () => {
      expect(comparator.matches(match.toLowerCase())).toBeTruthy();
    });
  }
});

describe('Comparators: Upper-Case', () => {
  for (const match in matches) {
    const comparator = matches[match];
    it(comparator.label + ' should match ' + match.toUpperCase(), () => {
      expect(comparator.matches(match.toUpperCase())).toBeTruthy();
    });
  }
});
