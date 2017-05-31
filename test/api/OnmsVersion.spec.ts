declare const describe, beforeEach, it, expect;

import {OnmsVersion} from '../../src/api/OnmsVersion';

let ver;

describe('new OnmsVersion()', () => {
  beforeEach(() => {
    ver = new OnmsVersion();
  });
  it('it should have a version of "0.0.0"', () => {
    expect(ver.version).toBe('0.0.0');
  });
  it('it should have a display version of "0.0.0"', () => {
    expect(ver.displayVersion).toBe('0.0.0');
  });
  it('comparator: lt', () => {
    expect(ver.lt('0.0.0')).toEqual(false);
    expect(ver.lt('0.1.0')).toEqual(true);
    expect(ver.lt(undefined)).toEqual(false);
  });
  it('comparator: le', () => {
    expect(ver.le('0.0.0')).toEqual(true);
    expect(ver.le('0.1.0')).toEqual(true);
    expect(ver.le(undefined)).toEqual(true);
  });
  it('comparator: eq', () => {
    expect(ver.eq('0.0.0')).toEqual(true);
    expect(ver.eq('0.1.0')).toEqual(false);
    expect(ver.eq(undefined)).toEqual(true);
  });
  it('comparator: ge', () => {
    expect(ver.ge('0.0.0')).toEqual(true);
    expect(ver.ge('0.1.0')).toEqual(false);
    expect(ver.ge(undefined)).toEqual(true);
  });
  it('comparator: gt', () => {
    expect(ver.gt('0.0.0')).toEqual(false);
    expect(ver.gt('0.1.0')).toEqual(false);
    expect(ver.gt(undefined)).toEqual(false);
  });
});

describe('new OnmsVersion("14.0.0", "14.0.0-SNAPSHOT")', () => {
  beforeEach(() => {
    ver = new OnmsVersion('14.0.0', '14.0.0-SNAPSHOT');
  });
  it('it should have a version of "14.0.0"', () => {
    expect(ver.version).toBe('14.0.0');
  });
  it('it should have a display version of "14.0.0-SNAPSHOT"', () => {
    expect(ver.displayVersion).toBe('14.0.0-SNAPSHOT');
  });
  it('comparator: lt', () => {
    expect(ver.lt('0.0.0')).toEqual(false);
    expect(ver.lt('0.1.0')).toEqual(false);
    expect(ver.lt('14.0.0')).toEqual(false);
    expect(ver.lt('14.0.1')).toEqual(true);
    expect(ver.lt('15.0.0')).toEqual(true);
    expect(ver.lt('2016.1.0')).toEqual(true);
    expect(ver.lt(undefined)).toEqual(false);
  });
  it('comparator: le', () => {
    expect(ver.le('0.0.0')).toEqual(false);
    expect(ver.le('0.1.0')).toEqual(false);
    expect(ver.le('14.0.0')).toEqual(true);
    expect(ver.le('14.0.1')).toEqual(true);
    expect(ver.le('15.0.0')).toEqual(true);
    expect(ver.le('2016.1.0')).toEqual(true);
    expect(ver.le(undefined)).toEqual(false);
  });
  it('comparator: eq', () => {
    expect(ver.eq('0.0.0')).toEqual(false);
    expect(ver.eq('0.1.0')).toEqual(false);
    expect(ver.eq('14.0.0')).toEqual(true);
    expect(ver.eq('14.0.1')).toEqual(false);
    expect(ver.eq('15.0.0')).toEqual(false);
    expect(ver.eq('2016.1.0')).toEqual(false);
    expect(ver.eq(undefined)).toEqual(false);
  });
  it('comparator: ge', () => {
    expect(ver.ge('0.0.0')).toEqual(true);
    expect(ver.ge('0.1.0')).toEqual(true);
    expect(ver.ge('14.0.0')).toEqual(true);
    expect(ver.ge('14.0.1')).toEqual(false);
    expect(ver.ge('15.0.0')).toEqual(false);
    expect(ver.ge('2016.1.0')).toEqual(false);
    expect(ver.ge(undefined)).toEqual(true);
  });
  it('comparator: gt', () => {
    expect(ver.gt('0.0.0')).toEqual(true);
    expect(ver.gt('0.1.0')).toEqual(true);
    expect(ver.gt('14.0.0')).toEqual(false);
    expect(ver.gt('14.0.1')).toEqual(false);
    expect(ver.gt('15.0.0')).toEqual(false);
    expect(ver.gt('2016.1.0')).toEqual(false);
    expect(ver.gt(undefined)).toEqual(true);
  });
});
