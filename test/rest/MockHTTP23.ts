/** @hidden */
declare const Promise, require;

/** @hidden */
// tslint:disable-next-line
const URI = require('urijs');

import {AbstractHTTP} from '../../src/rest/AbstractHTTP';

import {OnmsHTTPOptions} from '../../src/api/OnmsHTTPOptions';
import {OnmsResult} from '../../src/api/OnmsResult';

export class MockHTTP23 extends AbstractHTTP {
  /** make an HTTP get call -- this should be overridden by the implementation */
  public get(url: string, options?: OnmsHTTPOptions): Promise<OnmsResult<any>> {
    const urlObj = new URI(url);
    if (options && options.parameters) {
      urlObj.search(options.parameters);
    }

    switch (urlObj.toString()) {
      case 'http://demo.opennms.org/opennms/rest/info':
      case 'http://demo1.opennms.org/opennms/rest/info':
      case 'http://demo2.opennms.org/opennms/rest/info':
        {
          return Promise.resolve(
            OnmsResult.ok({displayVersion: '23.0.0', packageDescription: 'OpenNMS',
            packageName: 'opennms', version: '23.0.0'}));
        }
      case 'api/v2/alarms/8': {
        const result = OnmsResult.ok(require('./23.0.0/get/api/v2/alarms/8.json'));
        result.type = 'application/json';
        return Promise.resolve(result);
      }
      case 'api/v2/alarms?limit=1000&_s=alarm.id%3D%3D8': {
        const result = OnmsResult.ok(require('./23.0.0/get/api/v2/alarms/8.json'));
        result.type = 'application/json';
        return Promise.resolve(result);
      }
      case 'rest/situation-feedback/210': {
        const result = OnmsResult.ok(require('./23.0.0/get/rest/situation-feedback/feedback.json'));
        result.type = 'application/json';
        return Promise.resolve(result);
      }
      case 'api/v2/alarms?limit=1000&_s=isSituation%3D%3Dtrue': {
        const result = OnmsResult.ok(require('./23.0.0/get/api/v2/alarms/243.json'));
        result.type = 'application/json';
        return Promise.resolve(result);
      }
      case 'api/v2/alarms/properties': {
        let result;
        switch (this.server.url) {
          case 'http://demo1.opennms.org/opennms/':
            result = OnmsResult.ok(require('./23.0.0/get/api/v2/alarms/properties-demo1.json'));
            break;
          case 'http://demo2.opennms.org/opennms/':
            result = OnmsResult.ok(require('./23.0.0/get/api/v2/alarms/properties-demo2.json'));
            break;
          default:
            result = OnmsResult.ok(require('./23.0.0/get/api/v2/alarms/properties.json'));
        }
        result.type = 'application/json';
        return Promise.resolve(result);
      }
      case 'api/v2/alarms/properties?cache=1': {
        const result = OnmsResult.ok(require('./23.0.0/get/api/v2/alarms/properties-1.json'));
        result.type = 'application/json';
        return Promise.resolve(result);
      }
      case 'api/v2/alarms/properties?cache=2': {
        const result = OnmsResult.ok(require('./23.0.0/get/api/v2/alarms/properties-2.json'));
        result.type = 'application/json';
        return Promise.resolve(result);
      }
      case 'api/v2/alarms/properties?cache=3': {
        const result = OnmsResult.ok(require('./23.0.0/get/api/v2/alarms/properties-3.json'));
        result.type = 'application/json';
        return Promise.resolve(result);
      }
    }

    throw new Error('23: Not yet implemented: GET ' + urlObj.toString());
  }

  public put(url: string, options?: OnmsHTTPOptions): Promise<OnmsResult<any>> {
    const urlObj = new URI(url);
    throw new Error('23: Not yet implemented: PUT ' + urlObj.toString());
  }

  public post(url: string, options?: OnmsHTTPOptions): Promise<OnmsResult<any>> {
    const urlObj = new URI(url);
    throw new Error('23: Not yet implemented: POST ' + urlObj.toString());
  }

  public head(url: string, options?: OnmsHTTPOptions): Promise<OnmsResult<any>> {
    const urlObj = new URI(url);
    throw new Error('19: Not yet implemented: HEAD ' + urlObj.toString());
  }

  public httpDelete(url: string, options?: OnmsHTTPOptions): Promise<OnmsResult<any>> {
    const urlObj = new URI(url);
    throw new Error('23: Not yet implemented: DELETE ' + urlObj.toString());
  }
}
