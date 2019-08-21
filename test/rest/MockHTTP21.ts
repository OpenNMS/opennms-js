/** @hidden */
declare const require;

import {cloneDeep} from 'lodash';

import {AbstractMockHTTP} from './AbstractMockHTTP';
import {OnmsHTTPOptions} from '../../src/api/OnmsHTTPOptions';
import {OnmsResult} from '../../src/api/OnmsResult';

/** Mock OpenNMS 21.x HTTP implementation */
export class MockHTTP21 extends AbstractMockHTTP {
  /** make an HTTP get call -- this should be overridden by the implementation */
  public onGet(url: string, options?: OnmsHTTPOptions) {
    switch(url) {
      case 'http://demo.opennms.org/opennms/rest/info': {
        return this.okJson({
          displayVersion: '21.0.0',
          packageDescription: 'OpenNMS',
          packageName: 'opennms',
          version: '21.0.0',
        });
      }
      case 'http://demo.opennms.org/opennms/rest/alarms/count': {
        return OnmsResult.ok(1);
      }
      case 'api/v2/alarms/6806': {
        return this.okJsonFile('./21.0.0/get/api/v2/alarms/6806.json');
      }
      case 'api/v2/alarms/82416': {
        return this.okJsonFile('./21.0.0/get/api/v2/alarms/82416.json');
      }
      case 'api/v2/alarms?limit=1000&_s=alarmAckTime%21%3D%00': {
        const ret = cloneDeep(require('./21.0.0/get/api/v2/alarms/id.eq.6806.json'));
        ret.alarm[0].ackTime = 1495806508530;
        ret.alarm[0].ackUser = 'ranger';
        return this.okJson(ret);
      }
      case 'api/v2/alarms?limit=1000&_s=alarmAckTime%3D%3D%00': {
        const ret = cloneDeep(require('./21.0.0/get/api/v2/alarms/id.eq.6806.json'));
        delete ret.alarm[0].ackId;
        delete ret.alarm[0].ackTime;
        delete ret.alarm[0].ackUser;
        return this.okJson(ret);
      }
      case 'api/v2/alarms?limit=1000&_s=alarm.id%3D%3D6806': {
        return this.okJsonFile('./21.0.0/get/api/v2/alarms/id.eq.6806.json');
      }
      case 'api/v2/alarms?limit=1000&_s=alarm.uei%3D%3Dshould-not-exist': {
        return OnmsResult.noContent();
      }
      case 'api/v2/alarms/properties': {
        return this.okJsonFile('./21.0.0/get/api/v2/alarms/properties.json');
      }
      case 'api/v2/nodes/81': {
        return this.okJsonFile('./21.0.0/get/api/v2/nodes/81.json');
      }
      case 'api/v2/nodes/81/snmpinterfaces': {
        return this.okJsonFile('./21.0.0/get/api/v2/nodes/81.snmpinterfaces.json');
      }
      case 'api/v2/nodes/81/ipinterfaces': {
        return this.okJsonFile('./21.0.0/get/api/v2/nodes/81.ipinterfaces.json');
      }
      case 'api/v2/nodes/81/ipinterfaces/127.0.0.1/services': {
        return this.okJsonFile('./21.0.0/get/api/v2/nodes/81.ipinterfaces.127.0.0.1.services.json');
      }
      case 'api/v2/nodes/81/ipinterfaces/172.20.1.110/services': {
        return this.okJsonFile('./21.0.0/get/api/v2/nodes/81.ipinterfaces.172.20.1.110.services.json');
      }
      case 'api/v2/nodes?limit=1000&_s=id%3D%3D81': {
        return this.okJsonFile('./21.0.0/get/api/v2/nodes/81.ipinterfaces.172.20.1.110.services.json');
      }
    }
  }

  /** @inheritdoc */
  public onPut(url: string, options?: OnmsHTTPOptions) {
    switch(url) {
      case 'api/v2/alarms/404725?ack=true': {
        return OnmsResult.ok('', undefined, undefined, 'text/plain');
      }
      case 'api/v2/alarms/404725?ack=true&ackUser=ranger': {
        return OnmsResult.ok('', undefined, undefined, 'text/plain');
      }
      case 'api/v2/alarms/404725?ack=false&ackUser=ranger': {
        return OnmsResult.ok('', undefined, undefined, 'text/plain');
      }
      case 'api/v2/alarms/404725?ack=false': {
        return OnmsResult.ok('', undefined, undefined, 'text/plain');
      }
      case 'api/v2/alarms/404725?escalate=true': {
        return OnmsResult.ok('', undefined, undefined, 'text/plain');
      }
      case 'api/v2/alarms/404725?clear=true': {
        return OnmsResult.ok('', undefined, undefined, 'text/plain');
      }
      case 'api/v2/alarms/404725?ticketId=abcde': {
        return OnmsResult.ok('', undefined, undefined, 'text/plain');
      }
      case 'api/v2/alarms/404725?ticketState=RESOLVED': {
        return OnmsResult.ok('', undefined, undefined, 'text/plain');
      }
      case 'api/v2/alarms/404725/memo?body=test': {
        return OnmsResult.ok('', undefined, 204, 'text/plain');
      }
      case 'api/v2/alarms/404725/journal?body=test': {
        return OnmsResult.ok('', undefined, 204, 'text/plain');
      }
    }
  }

  /** @inheritdoc */
  public onPost(url: string, options?: OnmsHTTPOptions) {
    switch(url) {
      case 'api/v2/alarms/404725/ticket/create': {
        return OnmsResult.ok('', undefined, 202, 'text/plain');
      }
      case 'api/v2/alarms/404725/ticket/update': {
        return OnmsResult.ok('', undefined, 202, 'text/plain');
      }
      case 'api/v2/alarms/404725/ticket/close': {
        return OnmsResult.ok('', undefined, 202, 'text/plain');
      }
    }
  }

  /** @inheritdoc */
  public onDelete(url: string, options?: OnmsHTTPOptions) {
    switch (url) {
      case 'api/v2/alarms/404725/memo': {
        return OnmsResult.ok('', undefined, 204, 'text/plain');
      }
      case 'api/v2/alarms/404725/journal': {
        return OnmsResult.ok('', undefined, 204, 'text/plain');
      }
    }
  }
}