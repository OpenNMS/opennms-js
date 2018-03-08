/** @hidden */
declare const Promise, require;

/** @hidden */
// tslint:disable-next-line
const URI = require('urijs');

import {AbstractHTTP} from '../../src/rest/AbstractHTTP';

import {OnmsHTTPOptions} from '../../src/api/OnmsHTTPOptions';
import {OnmsResult} from '../../src/api/OnmsResult';

export class MockHTTP22 extends AbstractHTTP {
  /** make an HTTP get call -- this should be overridden by the implementation */
  public get(url: string, options?: OnmsHTTPOptions): Promise<OnmsResult<any>> {
    const urlObj = new URI(url);
    if (options && options.parameters) {
      urlObj.search(options.parameters);
    }

    switch(urlObj.toString()) {
      case 'http://demo.opennms.org/opennms/rest/info': {
        return Promise.resolve(OnmsResult.ok({'packageDescription':'OpenNMS','displayVersion':'22.0.0','packageName':'opennms','version':'22.0.0'}));
      }
      case 'rest/flows/exporters?limit=1': {
        const result = OnmsResult.ok(require('./22.0.0/get/rest/flows/exporters.json'));
        result.type = 'application/json';
        return Promise.resolve(result);
      }
      case 'rest/flows/exporters/test:test-node?limit=1': {
        const result = OnmsResult.ok(require('./22.0.0/get/rest/flows/exporter/test-node.json'));
        result.type = 'application/json';
        return Promise.resolve(result);
      }
      case 'rest/flows/applications': {
        const result = OnmsResult.ok(require('./22.0.0/get/rest/flows/applications.json'));
        result.type = 'application/json';
        return Promise.resolve(result);
      }
      case 'rest/flows/applications/series': {
        const result = OnmsResult.ok(require('./22.0.0/get/rest/flows/applications/series.json'));
        result.type = 'application/json';
        return Promise.resolve(result);
      }
      case 'rest/flows/conversations': {
        const result = OnmsResult.ok(require('./22.0.0/get/rest/flows/conversations.json'));
        result.type = 'application/json';
        return Promise.resolve(result);
      }
      case 'rest/flows/conversations/series': {
        const result = OnmsResult.ok(require('./22.0.0/get/rest/flows/conversations/series.json'));
        result.type = 'application/json';
        return Promise.resolve(result);
      }
    }

    throw new Error('Not yet implemented: GET ' + urlObj.toString());
  }

  public put(url: string, options?: OnmsHTTPOptions): Promise<OnmsResult<any>> {
    const urlObj = new URI(url);
    throw new Error('Not yet implemented: PUT ' + urlObj.toString());
  }

  public post(url: string, options?: OnmsHTTPOptions): Promise<OnmsResult<any>> {
    const urlObj = new URI(url);
    throw new Error('Not yet implemented: POST ' + urlObj.toString());
  }

  public httpDelete(url: string, options?: OnmsHTTPOptions): Promise<OnmsResult<any>> {
    const urlObj = new URI(url);
    throw new Error('Not yet implemented: DELETE ' + urlObj.toString());
  }
}
