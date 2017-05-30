declare const describe, beforeEach, it, expect;

import {OnmsError} from '../../src/api/OnmsError';

let err;

describe('Given an OnmsError without a code...', function () {
  beforeEach(function () {
    err = new OnmsError('blah');
  });

  it('it should return a formatted message when I call toString()', function() {
    expect(err.toString()).toBe('Error: blah');
  });
});

describe('Given an OnmsError with a code...', function () {
  beforeEach(function () {
    err = new OnmsError('blah', 404);
  });

  it('it should return a formatted message when I call toString()', function() {
    expect(err.toString()).toBe('Error 404: blah');
  });
});

