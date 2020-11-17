declare const describe, beforeEach, it, expect, require;

import {Util} from '../../src/internal/Util';

import {Address4, Address6} from 'ip-address';

/** @hidden */
// tslint:disable-next-line
const moment = require('moment');

/** @hidden */
const ARBITRARY_STRING = '2017-08-08T12:29:56.000+0000';

/** @hidden */
const ARBITRARY_EPOCH = 1502195396000;

describe('Util.toIPAddress()', () => {
  it('undefined', () => {
    expect(Util.toIPAddress(undefined)).toBeUndefined();
  });
  it('127.0.0.1', () => {
    const addr = Util.toIPAddress('127.0.0.1');
    expect(addr).toBeInstanceOf(Address4);
  });
  it('192.168.0.1', () => {
    const addr = Util.toIPAddress('192.168.0.1');
    expect(addr).toBeInstanceOf(Address4);
  });
  it('2003:dead:beef::1', () => {
    const addr = Util.toIPAddress('2003:dead:beef::1');
    expect(addr).toBeInstanceOf(Address6);
  });
});

describe('Util.isDateObject()', () => {
  it('undefined', () => {
    expect(Util.isDateObject(undefined)).toEqual(false);
  });
  it('null', () => {
    expect(Util.isDateObject(null)).toEqual(false);
  });
  it('moment(0)', () => {
    expect(Util.isDateObject(moment(0))).toEqual(true);
  });
  it('0', () => {
    expect(Util.isDateObject(0)).toEqual(false);
  });
  it('new Date()', () => {
    expect(Util.isDateObject(new Date(ARBITRARY_EPOCH))).toEqual(true);
  });
  it(ARBITRARY_STRING, () => {
    expect(Util.isDateObject(ARBITRARY_STRING)).toEqual(false);
  });
  it('2017-08-08T12:29:56Z', () => {
    expect(Util.isDateObject('2017-08-08T12:29:56Z')).toEqual(false);
  });
  it('new Date(0)', () => {
    expect(Util.isDateObject(new Date(0))).toEqual(true);
  });
});

describe('Util.toMoment()', () => {
  it('undefined', () => {
    expect(Util.toMoment(undefined)).toBeUndefined();
  });
  it('null', () => {
    expect(Util.toMoment(null)).toBeUndefined();
  });
  it('moment(0)', () => {
    expect(Util.toMoment(moment(0)).valueOf()).toEqual(0);
  });
  it('0', () => {
    expect(Util.toMoment(0).valueOf()).toEqual(0);
  });
  it('new Date()', () => {
    expect(Util.toMoment(new Date(ARBITRARY_EPOCH)).valueOf()).toEqual(ARBITRARY_EPOCH);
  });
  it(ARBITRARY_STRING, () => {
    expect(Util.toMoment(ARBITRARY_STRING).valueOf()).toEqual(ARBITRARY_EPOCH);
  });
  it('2017-08-08T12:29:56Z', () => {
    expect(Util.toMoment('2017-08-08T12:29:56Z').valueOf()).toEqual(ARBITRARY_EPOCH);
  });
});

describe('Util.toDateString()', () => {
  it('undefined', () => {
    expect(Util.toDateString(undefined)).toBeUndefined();
  });
  it('null', () => {
    expect(Util.toDateString(null)).toBeUndefined();
  });
  it('moment(0)', () => {
    expect(Util.toDateString(moment(0))).toEqual('1970-01-01T00:00:00.000+0000');
  });
  it('0', () => {
    expect(Util.toDateString(0)).toEqual('1970-01-01T00:00:00.000+0000');
  });
  it('new Date()', () => {
    expect(Util.toDateString(new Date(ARBITRARY_EPOCH))).toEqual(ARBITRARY_STRING);
  });
  it('new Date(0)', () => {
    expect(Util.toDateString(new Date(0))).toEqual('1970-01-01T00:00:00.000+0000');
  });
});
