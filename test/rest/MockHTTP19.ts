/** @hidden */
declare const Promise, require;

/** @hidden */
// tslint:disable-next-line
const URI = require('urijs');

import {cloneDeep} from 'lodash';

import {AbstractHTTP} from '../../src/rest/AbstractHTTP';

import {OnmsHTTPOptions} from '../../src/api/OnmsHTTPOptions';
import {OnmsResult} from '../../src/api/OnmsResult';

export class MockHTTP19 extends AbstractHTTP {
  /** make an HTTP get call -- this should be overridden by the implementation */
  public get(url: string, options?: OnmsHTTPOptions) {
    const urlObj = new URI(url);
    if (options && options.parameters) {
      urlObj.search(options.parameters);
    }

    switch(urlObj.toString()) {
      case 'http://demo.opennms.org/opennms/rest/info': {
        return Promise.resolve(OnmsResult.ok({'packageDescription':'OpenNMS','displayVersion':'19.1.0','packageName':'opennms','version':'19.1.0'}));
      }
      case 'http://demo.opennms.org/opennms/rest/alarms/count': {
        return Promise.resolve(OnmsResult.ok(1));
      }
      case 'rest/alarms/404725': {
        const result = OnmsResult.ok(require('./19.1.0/get/rest/alarms/404725.json'));
        result.type = 'application/json';
        return Promise.resolve(result);
      }
      case 'rest/alarms?limit=1000&alarmAckTime=notnull': {
        const ret = cloneDeep(require('./19.1.0/get/rest/alarms/id.eq.404725.json'));
        ret.alarm[0].ackTime = 1495806508530;
        ret.alarm[0].ackUser = 'ranger';
        const result = OnmsResult.ok(ret);
        result.type = 'application/json';
        return Promise.resolve(result);
      }
      case 'rest/alarms?limit=1000&alarmAckTime=null': {
        const ret = cloneDeep(require('./19.1.0/get/rest/alarms/id.eq.404725.json'));
        delete ret.alarm[0].ackId;
        delete ret.alarm[0].ackTime;
        delete ret.alarm[0].ackUser;
        const result = OnmsResult.ok(ret);
        result.type = 'application/json';
        return Promise.resolve(result);
      }
      case 'rest/alarms?limit=1000&comparator=eq&id=404725': {
        const result = OnmsResult.ok(require('./19.1.0/get/rest/alarms/id.eq.404725.json'));
        result.type = 'application/json';
        return Promise.resolve(result);
      }
      case 'rest/nodes/43': {
        const result = OnmsResult.ok(require('./19.1.0/get/rest/nodes/43.json'));
        result.type = 'application/json';
        return Promise.resolve(result);
      }
      case 'rest/nodes?limit=1000&comparator=eq&id=43': {
        const result = OnmsResult.ok(require('./19.1.0/get/rest/nodes/id.eq.43.json'));
        result.type = 'application/json';
        return Promise.resolve(result);
      }
      case 'rest/nodes/43/snmpinterfaces': {
        const result = OnmsResult.ok(require('./19.1.0/get/rest/nodes/43.snmpinterfaces.json'));
        result.type = 'application/json';
        return Promise.resolve(result);
      }
      case 'rest/nodes/43/ipinterfaces': {
        const result = OnmsResult.ok(require('./19.1.0/get/rest/nodes/43.ipinterfaces.json'));
        result.type = 'application/json';
        return Promise.resolve(result);
      }
      case 'rest/nodes/43/ipinterfaces/172.20.1.14/services': {
        const result = OnmsResult.ok(require('./19.1.0/get/rest/nodes/43.ipinterfaces.172.20.1.14.services.json'));
        result.type = 'application/json';
        return Promise.resolve(result);
      }
      case 'rest/nodes/43/ipinterfaces/192.168.122.1/services': {
        const result = OnmsResult.ok(require('./19.1.0/get/rest/nodes/43.ipinterfaces.192.168.122.1.services.json'));
        result.type = 'application/json';
        return Promise.resolve(result);
      }
    }

    throw new Error('19: Not yet implemented: GET ' + urlObj.toString());
  }

  public put(url: string, options?: OnmsHTTPOptions) {
    const urlObj = new URI(url);
    if (options && options.parameters) {
      urlObj.search(options.parameters);
    }

    switch(urlObj.toString()) {
      case 'rest/alarms/404725?ack=true': {
        const result = OnmsResult.ok('');
        result.type = 'text/plain';
        return Promise.resolve(result);
      }
      case 'rest/alarms/404725?ack=true&ackUser=ranger': {
        const result = OnmsResult.ok('');
        result.type = 'text/plain';
        return Promise.resolve(result);
      }
      case 'rest/alarms/404725?ack=false&ackUser=ranger': {
        const result = OnmsResult.ok('');
        result.type = 'text/plain';
        return Promise.resolve(result);
      }
      case 'rest/alarms/404725?ack=false': {
        const result = OnmsResult.ok('');
        result.type = 'text/plain';
        return Promise.resolve(result);
      }
      case 'rest/alarms/404725?escalate=true': {
        const result = OnmsResult.ok('');
        result.type = 'text/plain';
        return Promise.resolve(result);
      }
      case 'rest/alarms/404725?clear=true': {
        const result = OnmsResult.ok('');
        result.type = 'text/plain';
        return Promise.resolve(result);
      }
      case 'rest/alarms/404725?ticketId=abcde': {
        const result = OnmsResult.ok('');
        result.type = 'text/plain';
        return Promise.resolve(result);
      }
      case 'rest/alarms/404725?ticketState=RESOLVED': {
        const result = OnmsResult.ok('');
        result.type = 'text/plain';
        return Promise.resolve(result);
      }
    }

    throw new Error('19: Not yet implemented: PUT ' + urlObj.toString());
  }

  public post(url: string, options?: OnmsHTTPOptions): Promise<OnmsResult<any>> {
    const urlObj = new URI(url);
    if (options && options.parameters) {
      urlObj.search(options.parameters);
    }

    switch(urlObj.toString()) {
      /*
      case 'rest/alarms/404725?ack=true': {
        const result = OnmsResult.ok('');
        result.type = 'text/plain';
        return Promise.resolve(result);
      }
      */
    }

    throw new Error('19: Not yet implemented: POST ' + urlObj.toString());
  }

  public httpDelete(url: string, options?: OnmsHTTPOptions): Promise<OnmsResult<any>> {
    const urlObj = new URI(url);
    throw new Error('19: Not yet implemented: DELETE ' + urlObj.toString());
  }
}
