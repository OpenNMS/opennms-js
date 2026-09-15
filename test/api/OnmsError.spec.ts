
import {OnmsError} from '../../src/api/OnmsError';
import {GrafanaError} from '../../src/rest/GrafanaError';

let err;

describe('Given an OnmsError without a code...', () => {
  beforeEach(() => {
    err = new OnmsError('blah');
  });

  it('it should return a formatted message when I call toString()', () => {
    expect(err.toString()).toBe('Error: blah');
  });
});

describe('Given an OnmsError with a code...', () => {
  beforeEach(() => {
    err = new OnmsError('blah', 404);
  });

  it('it should return a formatted message when I call toString()', () => {
    expect(err.toString()).toBe('Error 404: blah');
  });
});

describe('Given an error subclass...', () => {
  it('it should be an instance of itself, not just of OnmsError', () => {
    const grafanaErr = new GrafanaError('blah', 500);
    expect(grafanaErr instanceof GrafanaError).toBe(true);
    expect(grafanaErr instanceof OnmsError).toBe(true);
    expect(grafanaErr instanceof Error).toBe(true);
  });

  it('it should report the subclass as its constructor and name', () => {
    const grafanaErr = new GrafanaError('blah', 500);
    expect(grafanaErr.constructor.name).toBe('GrafanaError');
    expect(grafanaErr.name).toBe('GrafanaError');
  });

  it('it should leave OnmsError itself unaffected', () => {
    const onmsErr = new OnmsError('blah', 404);
    expect(onmsErr instanceof OnmsError).toBe(true);
    expect(onmsErr.constructor.name).toBe('OnmsError');
    expect(onmsErr.toString()).toBe('Error 404: blah');
  });
});
