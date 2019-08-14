/** @hidden */
declare const require;

import {cloneDeep} from 'lodash';

import {AbstractMockHTTP} from './AbstractMockHTTP';
import {OnmsHTTPOptions} from '../../src/api/OnmsHTTPOptions';
import {OnmsResult} from '../../src/api/OnmsResult';

/** Mock OpenNMS 19.x HTTP implementation */
export class MockHTTP19 extends AbstractMockHTTP {
  /** @inheritdoc */
  public onGet(url: string, options?: OnmsHTTPOptions) {
    switch (url) {
      case 'http://demo.opennms.org/opennms/rest/info': {
        return this.okJson({
          displayVersion: '19.1.0',
          packageDescription: 'OpenNMS',
          packageName: 'opennms',
          version: '19.1.0',
        });
      }
      case 'http://demo.opennms.org/opennms/rest/alarms/count': {
        return OnmsResult.ok(1);
      }
      case 'rest/alarms/404725': {
        return this.okJsonFile('./19.1.0/get/rest/alarms/404725.json');
      }
      case 'rest/alarms?limit=1000&alarmAckTime=notnull': {
        const ret = cloneDeep(require('./19.1.0/get/rest/alarms/id.eq.404725.json'));
        ret.alarm[0].ackTime = 1495806508530;
        ret.alarm[0].ackUser = 'ranger';
        return this.okJson(ret);
      }
      case 'rest/alarms?limit=1000&alarmAckTime=null': {
        const ret = cloneDeep(require('./19.1.0/get/rest/alarms/id.eq.404725.json'));
        delete ret.alarm[0].ackId;
        delete ret.alarm[0].ackTime;
        delete ret.alarm[0].ackUser;
        return this.okJson(ret);
      }
      case 'rest/alarms?limit=1000&comparator=eq&id=404725': {
        return this.okJsonFile('./19.1.0/get/rest/alarms/id.eq.404725.json');
      }
      case 'rest/nodes/43': {
        return this.okJsonFile('./19.1.0/get/rest/nodes/43.json');
      }
      case 'rest/nodes?limit=1000&comparator=eq&id=43': {
        return this.okJsonFile('./19.1.0/get/rest/nodes/id.eq.43.json');
      }
      case 'rest/nodes/43/snmpinterfaces': {
        return this.okJsonFile('./19.1.0/get/rest/nodes/43.snmpinterfaces.json');
      }
      case 'rest/nodes/43/ipinterfaces': {
        return this.okJsonFile('./19.1.0/get/rest/nodes/43.ipinterfaces.json');
      }
      case 'rest/nodes/43/ipinterfaces/172.20.1.14/services': {
        return this.okJsonFile('./19.1.0/get/rest/nodes/43.ipinterfaces.172.20.1.14.services.json');
      }
      case 'rest/nodes/43/ipinterfaces/192.168.122.1/services': {
        return this.okJsonFile('./19.1.0/get/rest/nodes/43.ipinterfaces.192.168.122.1.services.json');
      }
    }
  }

  /** @inheritdoc */
  public onPut(url: string, options?: OnmsHTTPOptions) {
    switch(url) {
      case 'rest/alarms/404725?ack=true': {
        return OnmsResult.ok('', undefined, undefined, 'text/plain');
      }
      case 'rest/alarms/404725?ack=true&ackUser=ranger': {
        return OnmsResult.ok('', undefined, undefined, 'text/plain');
      }
      case 'rest/alarms/404725?ack=false&ackUser=ranger': {
        return OnmsResult.ok('', undefined, undefined, 'text/plain');
      }
      case 'rest/alarms/404725?ack=false': {
        return OnmsResult.ok('', undefined, undefined, 'text/plain');
      }
      case 'rest/alarms/404725?escalate=true': {
        return OnmsResult.ok('', undefined, undefined, 'text/plain');
      }
      case 'rest/alarms/404725?clear=true': {
        return OnmsResult.ok('', undefined, undefined, 'text/plain');
      }
      case 'rest/alarms/404725?ticketId=abcde': {
        return OnmsResult.ok('', undefined, undefined, 'text/plain');
      }
      case 'rest/alarms/404725?ticketState=RESOLVED': {
        return OnmsResult.ok('', undefined, undefined, 'text/plain');
      }
    }
  }
}
