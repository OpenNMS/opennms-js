import {OnmsIpInterface} from '../../src/model/OnmsIpInterface';
import {OnmsMonitoredService} from '../../src/model/OnmsMonitoredService';
import {OnmsOutage} from '../../src/model/OnmsOutage';
import {OnmsSnmpInterface} from '../../src/model/OnmsSnmpInterface';

/**
 * `fromData` is called with whatever the ReST layer hands back, which is not always an object.
 * OnmsEvent, OnmsNode and OnmsOutage have always returned undefined for an empty body; these
 * three did not, and dereferenced it instead.
 */
describe('model fromData returns undefined for an empty body', () => {
  const EMPTY: [string, any][] = [['null', null], ['undefined', undefined]];

  for (const [label, body] of EMPTY) {
    it('OnmsIpInterface.fromData(' + label + ')', () => {
      expect(OnmsIpInterface.fromData(body)).toBeUndefined();
    });
    it('OnmsMonitoredService.fromData(' + label + ')', () => {
      expect(OnmsMonitoredService.fromData(body)).toBeUndefined();
    });
    it('OnmsSnmpInterface.fromData(' + label + ')', () => {
      expect(OnmsSnmpInterface.fromData(body)).toBeUndefined();
    });
  }
});

describe('OnmsOutage.fromData tolerates a missing monitoredService', () => {
  // OnmsOutage.fromData calls OnmsMonitoredService.fromData(data.monitoredService)
  // unconditionally, so before the guard this threw on any outage without one.
  it('does not throw, and leaves monitoredService undefined', () => {
    const outage = OnmsOutage.fromData({id: 1, foreignSource: 'fs'});
    expect(outage).toBeDefined();
    expect(outage!.id).toEqual(1);
    expect(outage!.monitoredService).toBeUndefined();
  });
});
