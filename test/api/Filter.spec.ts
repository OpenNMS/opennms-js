declare const describe, it, expect;

// import {Clause} from '../../src/api/Clause';
import {Comparators} from '../../src/api/Comparator';
import {Filter} from '../../src/api/Filter';
import {NestedRestriction} from '../../src/api/NestedRestriction';
// import {Operators} from '../../src/api/Operator';
import {Restriction} from '../../src/api/Restriction';

describe('Filter.fromJson', () => {
  const apiFilter = new Filter()
    .withAndRestriction(new Restriction('key', Comparators.EQ, 'value'))
    .withAndRestriction(new Restriction('key2', Comparators.EQ, 'value2'))
    .withAndRestriction(new NestedRestriction()
      .withOrRestriction(new Restriction('key3', Comparators.NE, 'value3')));

  it('should clone already initialized', (done) => {
    const otherFilter = Filter.fromJson(apiFilter);
    expect(apiFilter).toEqual(otherFilter);

    done();
  });

  it('should clone', (done) => {
    const jsonString = JSON.stringify(apiFilter);
    const object = JSON.parse(jsonString);
    expect(object).not.toBeInstanceOf(Filter);

    const filterObject = Filter.fromJson(object);
    expect(filterObject).toBeInstanceOf(Filter);
    expect(apiFilter).toEqual(filterObject);

    done();
  });
});
