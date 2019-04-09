/** @hidden */
declare const Promise, require;

/** @hidden */
// tslint:disable-next-line
const URI = require('urijs');

import {cloneDeep} from 'lodash';

import {AbstractHTTP} from '../../src/rest/AbstractHTTP';

import {OnmsHTTPOptions} from '../../src/api/OnmsHTTPOptions';
import {OnmsResult} from '../../src/api/OnmsResult';

export class MockHTTP21 extends AbstractHTTP {
  /** make an HTTP get call -- this should be overridden by the implementation */
  public get(url: string, options?: OnmsHTTPOptions) {
    const urlObj = new URI(url);
    if (options && options.parameters) {
      urlObj.search(options.parameters);
    }

    switch(urlObj.toString()) {
      case 'http://demo.opennms.org/opennms/rest/info': {
        return Promise.resolve(OnmsResult.ok({'packageDescription':'OpenNMS','displayVersion':'21.0.0','packageName':'opennms','version':'21.0.0'}));
      }
      case 'http://demo.opennms.org/opennms/rest/alarms/count': {
        return Promise.resolve(OnmsResult.ok(1));
      }
      case 'api/v2/alarms/6806': {
        const result = OnmsResult.ok(require('./21.0.0/get/api/v2/alarms/6806.json'));
        result.type = 'application/json';
        return Promise.resolve(result);
      }
      case 'api/v2/alarms/82416': {
        const result = OnmsResult.ok(require('./21.0.0/get/api/v2/alarms/82416.json'));
        result.type = 'application/json';
        return Promise.resolve(result);
      }
      case 'api/v2/alarms?limit=1000&_s=alarmAckTime%21%3D%00': {
        const ret =cloneDeep(require('./21.0.0/get/api/v2/alarms/id.eq.6806.json'));
        ret.alarm[0].ackTime = 1495806508530;
        ret.alarm[0].ackUser = 'ranger';
        const result = OnmsResult.ok(ret);
        result.type = 'application/json';
        return Promise.resolve(result);
      }
      case 'api/v2/alarms?limit=1000&_s=alarmAckTime%3D%3D%00': {
        const ret = cloneDeep(require('./21.0.0/get/api/v2/alarms/id.eq.6806.json'));
        delete ret.alarm[0].ackId;
        delete ret.alarm[0].ackTime;
        delete ret.alarm[0].ackUser;
        const result = OnmsResult.ok(ret);
        result.type = 'application/json';
        return Promise.resolve(result);
      }
      case 'api/v2/alarms?limit=1000&_s=alarm.id%3D%3D6806': {
        const result = OnmsResult.ok(require('./21.0.0/get/api/v2/alarms/id.eq.6806.json'));
        result.type = 'application/json';
        return Promise.resolve(result);
      }
      case 'api/v2/alarms?limit=1000&_s=alarm.uei%3D%3Dshould-not-exist': {
        return Promise.resolve(OnmsResult.noContent());
      }
      case 'api/v2/alarms/properties': {
        const result = OnmsResult.ok(require('./21.0.0/get/api/v2/alarms/properties.json'));
        result.type = 'application/json';
        return Promise.resolve(result);
      }
      case 'api/v2/nodes/81': {
        const result = OnmsResult.ok(require('./21.0.0/get/api/v2/nodes/81.json'));
        result.type = 'application/json';
        return Promise.resolve(result);
      }
      case 'api/v2/nodes/81/snmpinterfaces': {
        const result = OnmsResult.ok(require('./21.0.0/get/api/v2/nodes/81.snmpinterfaces.json'));
        result.type = 'application/json';
        return Promise.resolve(result);
      }
      case 'api/v2/nodes/81/ipinterfaces': {
        const result = OnmsResult.ok(require('./21.0.0/get/api/v2/nodes/81.ipinterfaces.json'));
        result.type = 'application/json';
        return Promise.resolve(result);
      }
      case 'api/v2/nodes/81/ipinterfaces/127.0.0.1/services': {
        const result = OnmsResult.ok(require('./21.0.0/get/api/v2/nodes/81.ipinterfaces.127.0.0.1.services.json'));
        result.type = 'application/json';
        return Promise.resolve(result);
      }
      case 'api/v2/nodes/81/ipinterfaces/172.20.1.110/services': {
        const result = OnmsResult.ok(require('./21.0.0/get/api/v2/nodes/81.ipinterfaces.172.20.1.110.services.json'));
        result.type = 'application/json';
        return Promise.resolve(result);
      }
      case 'api/v2/nodes?limit=1000&_s=id%3D%3D81': {
        const result = OnmsResult.ok(require('./21.0.0/get/api/v2/nodes/81.ipinterfaces.172.20.1.110.services.json'));
        result.type = 'application/json';
        return Promise.resolve(result);
      }
    }

    throw new Error('21: Not yet implemented: GET ' + urlObj.toString());
  }

  public put(url: string, options?: OnmsHTTPOptions) {
    const urlObj = new URI(url);
    if (options && options.parameters) {
      urlObj.search(options.parameters);
    }

    switch(urlObj.toString()) {
      case 'api/v2/alarms/404725?ack=true': {
        const result = OnmsResult.ok('');
        result.type = 'text/plain';
        return Promise.resolve(result);
      }
      case 'api/v2/alarms/404725?ack=true&ackUser=ranger': {
        const result = OnmsResult.ok('');
        result.type = 'text/plain';
        return Promise.resolve(result);
      }
      case 'api/v2/alarms/404725?ack=false&ackUser=ranger': {
        const result = OnmsResult.ok('');
        result.type = 'text/plain';
        return Promise.resolve(result);
      }
      case 'api/v2/alarms/404725?ack=false': {
        const result = OnmsResult.ok('');
        result.type = 'text/plain';
        return Promise.resolve(result);
      }
      case 'api/v2/alarms/404725?escalate=true': {
        const result = OnmsResult.ok('');
        result.type = 'text/plain';
        return Promise.resolve(result);
      }
      case 'api/v2/alarms/404725?clear=true': {
        const result = OnmsResult.ok('');
        result.type = 'text/plain';
        return Promise.resolve(result);
      }
      case 'api/v2/alarms/404725?ticketId=abcde': {
        const result = OnmsResult.ok('');
        result.type = 'text/plain';
        return Promise.resolve(result);
      }
      case 'api/v2/alarms/404725?ticketState=RESOLVED': {
        const result = OnmsResult.ok('');
        result.type = 'text/plain';
        return Promise.resolve(result);
      }
      case 'api/v2/alarms/404725/memo?body=test': {
        const result = OnmsResult.ok('');
        result.type = 'text/plain';
        result.code = 204;
        return Promise.resolve(result);
      }
      case 'api/v2/alarms/404725/journal?body=test': {
        const result = OnmsResult.ok('');
        result.type = 'text/plain';
        result.code = 204;
        return Promise.resolve(result);
      }
    }

    throw new Error('21: Not yet implemented: PUT ' + urlObj.toString());
  }

  public post(url: string, options?: OnmsHTTPOptions) {
    const urlObj = new URI(url);
    if (options && options.parameters) {
      urlObj.search(options.parameters);
    }

    switch(urlObj.toString()) {
      case 'api/v2/alarms/404725/ticket/create': {
        const result = OnmsResult.ok('');
        result.type = 'text/plain';
        result.code = 202;
        return Promise.resolve(result);
      }
      case 'api/v2/alarms/404725/ticket/update': {
        const result = OnmsResult.ok('');
        result.type = 'text/plain';
        result.code = 202;
        return Promise.resolve(result);
      }
      case 'api/v2/alarms/404725/ticket/close': {
        const result = OnmsResult.ok('');
        result.type = 'text/plain';
        result.code = 202;
        return Promise.resolve(result);
      }
    }

    throw new Error('21: Not yet implemented: POST ' + urlObj.toString());
  }

  public httpDelete(url: string, options?: OnmsHTTPOptions): Promise<OnmsResult<any>> {
    const urlObj = new URI(url);
    if (options && options.parameters) {
      urlObj.search(options.parameters);
    }

    switch (urlObj.toString()) {
      case 'api/v2/alarms/404725/memo': {
        const result = OnmsResult.ok('');
        result.type = 'text/plain';
        result.code = 204;
        return Promise.resolve(result);
      }
      case 'api/v2/alarms/404725/journal': {
        const result = OnmsResult.ok('');
        result.type = 'text/plain';
        result.code = 204;
        return Promise.resolve(result);
      }
    }

    throw new Error('21: Not yet implemented: DELETE ' + urlObj.toString());
  }
}