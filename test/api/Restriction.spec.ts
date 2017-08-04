declare const describe, beforeEach, it, expect;

import {Comparators} from '../../src/api/Comparator';
import {Restriction} from '../../src/api/Restriction';

import {Util} from '../../src/internal/Util';

const filterMatches = {
  '': null,
  'foo eq bar': Comparators.EQ,
  'foo == bar': Comparators.EQ,
  'foo==bar': Comparators.EQ,
  'foo>=bar': Comparators.GE,
};

describe('Restriction.fromString()', () => {
  for (const filter in filterMatches) {
    if (filterMatches[filter] === null) {
      it(filter, () => {
        expect(Restriction.fromString(filter)).toBeNull();
      });
    } else {
      it(filter, () => {
        expect(Restriction.fromString(filter)).toMatchObject({
          comparator: filterMatches[filter],
        });
      });
    }
  }
});
