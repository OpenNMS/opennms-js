
import {Comparators} from '../../src/api/Comparator';
import {Restriction} from '../../src/api/Restriction';


const filterMatches = {
  '': null,
  'foo == bar': Comparators.EQ,
  'foo eq bar': Comparators.EQ,
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
