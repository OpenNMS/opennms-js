declare const describe, beforeEach, it, expect;

import {Util} from '../../src/internal/Util';
import {Address4, Address6} from 'ip-address';

describe('Util.toIPAddress()', () => {
  it('undefined', () => {
    expect(Util.toIPAddress(undefined)).toBeUndefined();
  });
  it('127.0.0.1', () => {
    const addr = Util.toIPAddress('127.0.0.1');
    expect(addr).toBeInstanceOf(Address4);
    expect(addr.isValid()).toEqual(true);
  });
  it('192.168.0.1', () => {
    const addr = Util.toIPAddress('192.168.0.1');
    expect(addr).toBeInstanceOf(Address4);
    expect(addr.isValid()).toEqual(true);
  });
  it('2003:dead:beef::1', () => {
    const addr = Util.toIPAddress('2003:dead:beef::1');
    expect(addr).toBeInstanceOf(Address6);
    expect(addr.isValid()).toEqual(true);
  });
});
