/** @hidden */
declare const Promise, require;

/** @hidden */
// tslint:disable-next-line
const URI = require('urijs');

import {AbstractHTTP} from '../../src/rest/AbstractHTTP';

import {OnmsHTTPOptions} from '../../src/api/OnmsHTTPOptions';
import {OnmsResult} from '../../src/api/OnmsResult';

/** Mock OpenNMS 25.x HTTP */
export class MockHTTP25 extends AbstractHTTP {
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
        return Promise.resolve(OnmsResult.ok({
          displayVersion: '25.0.0',
          packageDescription: 'OpenNMS',
          packageName: 'opennms',
          version: '25.0.0',
        }));
      }
      // Use the v22 responses
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
      // Use the v25 responses
      case 'rest/flows/applications/enumerate': {
        const result = OnmsResult.ok(require('./25.0.0/get/rest/flows/applications/enumerate.json'));
        result.type = 'application/json';
        return Promise.resolve(result);
      }
      case 'rest/flows/hosts/enumerate': {
        const result = OnmsResult.ok(require('./25.0.0/get/rest/flows/hosts/enumerate.json'));
        result.type = 'application/json';
        return Promise.resolve(result);
      }
      case 'rest/flows/hosts': {
        const result = OnmsResult.ok(require('./25.0.0/get/rest/flows/hosts.json'));
        result.type = 'application/json';
        return Promise.resolve(result);
      }
      case 'rest/flows/hosts/series': {
        const result = OnmsResult.ok(require('./25.0.0/get/rest/flows/hosts/series.json'));
        result.type = 'application/json';
        return Promise.resolve(result);
      }
    }

    throw new Error('25: Not yet implemented: GET ' + urlObj.toString());
  }

  /** @inheritdoc */
  public put(url: string, options?: OnmsHTTPOptions): Promise<OnmsResult<any>> {
    const urlObj = new URI(url);
    throw new Error('25: Not yet implemented: PUT ' + urlObj.toString());
  }

  /** @inheritdoc */
  public post(url: string, options?: OnmsHTTPOptions): Promise<OnmsResult<any>> {
    const urlObj = new URI(url);
    throw new Error('25: Not yet implemented: POST ' + urlObj.toString());
  }

  /** @inheritdoc */
  public head(url: string, options?: OnmsHTTPOptions): Promise<OnmsResult<any>> {
    const urlObj = new URI(url);
    throw new Error('19: Not yet implemented: HEAD ' + urlObj.toString());
  }

  /** @inheritdoc */
  public httpDelete(url: string, options?: OnmsHTTPOptions): Promise<OnmsResult<any>> {
    const urlObj = new URI(url);
    throw new Error('25: Not yet implemented: DELETE ' + urlObj.toString());
  }
}
