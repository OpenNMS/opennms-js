/** @hidden */
declare const Promise, require;

/** @hidden */
// tslint:disable-next-line
const URI = require('urijs');

import {AbstractHTTP} from '../../src/rest/AbstractHTTP';

import {OnmsHTTPOptions} from '../../src/api/OnmsHTTPOptions';
import {OnmsResult} from '../../src/api/OnmsResult';

/** Mock OpenNMS 23.x HTTP */
export class MockHTTP23 extends AbstractHTTP {
  /** Mock HTTP servers have no external dependencies. ;) */
  public static isValid() {
    return true;
  }

  /** make an HTTP get call -- this should be overridden by the implementation */
  public get(url: string, options?: OnmsHTTPOptions): Promise<OnmsResult<any>> {
    const urlObj = new URI(url);
    if (options && options.parameters) {
      urlObj.search(options.parameters);
    }

    switch (urlObj.toString()) {
      case 'http://demo.opennms.org/opennms/rest/info': {
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
    }

    throw new Error('23: Not yet implemented: GET ' + urlObj.toString());
  }

  /** @inheritdoc */
  public put(url: string, options?: OnmsHTTPOptions): Promise<OnmsResult<any>> {
    const urlObj = new URI(url);
    throw new Error('23: Not yet implemented: PUT ' + urlObj.toString());
  }

  /** @inheritdoc */
  public post(url: string, options?: OnmsHTTPOptions): Promise<OnmsResult<any>> {
    const urlObj = new URI(url);
    throw new Error('23: Not yet implemented: POST ' + urlObj.toString());
  }

  /** @inheritdoc */
  public head(url: string, options?: OnmsHTTPOptions): Promise<OnmsResult<any>> {
    const urlObj = new URI(url);
    throw new Error('19: Not yet implemented: HEAD ' + urlObj.toString());
  }

  /** @inheritdoc */
  public httpDelete(url: string, options?: OnmsHTTPOptions): Promise<OnmsResult<any>> {
    const urlObj = new URI(url);
    throw new Error('23: Not yet implemented: DELETE ' + urlObj.toString());
  }
}
