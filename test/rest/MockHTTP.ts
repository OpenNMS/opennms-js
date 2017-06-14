/** @hidden */
declare const Promise, require;

/** @hidden */
// tslint:disable-next-line
const URI = require('urijs');

import {AbstractHTTP} from '../../src/rest/AbstractHTTP';

import {OnmsHTTPOptions} from '../../src/api/OnmsHTTPOptions';
import {OnmsResult} from '../../src/api/OnmsResult';

export class MockHTTP extends AbstractHTTP {
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
        const result = OnmsResult.ok(require('./responses/get/rest/alarms/404725.json'));
        result.type = 'application/json';
        return Promise.resolve(result);
      }
      case 'rest/alarms?limit=1000&comparator=eq&id=404725': {
        const result = OnmsResult.ok(require('./responses/get/rest/alarms/id.eq.404725.json'));
        result.type = 'application/json';
        return Promise.resolve(result);
      }
    }
    return Promise.reject(OnmsResult.error('Not yet implemented: ' + urlObj.toString()));
  }
}