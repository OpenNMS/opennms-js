/** @hidden */
declare const Promise, require;

/** @hidden */
// tslint:disable-next-line
const URI = require('urijs');

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
      case 'api/v2/alarms?limit=1000&_s=alarm.id%3D%3D6806': {
        const result = OnmsResult.ok(require('./21.0.0/get/api/v2/alarms/id.eq.6806.json'));
        result.type = 'application/json';
        return Promise.resolve(result);
      }
      case 'api/v2/alarms?limit=1000&_s=alarm.uei%3D%3Dshould-not-exist': {
        return Promise.resolve(OnmsResult.noContent());
      }
    }
    return Promise.reject(OnmsResult.error('Not yet implemented: ' + urlObj.toString()));
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
    }

    return Promise.reject(OnmsResult.error('Not yet implemented: PUT ' + urlObj.toString()));
  }
}