/** @hidden */
declare const Promise, require;

/** @hidden */
// tslint:disable-next-line
const URI = require('urijs');

import {AbstractHTTP} from '../../src/rest/AbstractHTTP';

import {OnmsHTTPOptions} from '../../src/api/OnmsHTTPOptions';
import {OnmsResult} from '../../src/api/OnmsResult';

/** Mock OpenNMS 24.x HTTP */
export class MockHTTP24 extends AbstractHTTP {
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
          OnmsResult.ok({displayVersion: '24.0.0', packageDescription: 'OpenNMS',
          packageName: 'opennms', version: '24.0.0'}));
      }
      case 'rest/situation-feedback/616': {
        const result = OnmsResult.ok(require('./24.0.0/get/rest/situation-feedback/616.json'));
        result.type = 'application/json';
        return Promise.resolve(result);
      }
      case 'rest/situation-feedback/tags': {
        const result = OnmsResult.ok(require('./24.0.0/get/rest/situation-feedback/tags.json'));
        result.type = 'application/json';
        return Promise.resolve(result);
      }
    }
    throw new Error('Not yet implemented: GET ' + urlObj.toString());
  }

  /** @inheritdoc */
  public put(url: string, options?: OnmsHTTPOptions): Promise<OnmsResult<any>> {
    const urlObj = new URI(url);
    throw new Error('Not yet implemented: PUT ' + urlObj.toString());
  }

  /** @inheritdoc */
  public post(url: string, options?: OnmsHTTPOptions): Promise<OnmsResult<any>> {
    const urlObj = new URI(url);
    throw new Error('Not yet implemented: POST ' + urlObj.toString());
  }

  /** @inheritdoc */
  public head(url: string, options?: OnmsHTTPOptions): Promise<OnmsResult<any>> {
    const urlObj = new URI(url);
    throw new Error('19: Not yet implemented: HEAD ' + urlObj.toString());
  }

  /** @inheritdoc */
  public httpDelete(url: string, options?: OnmsHTTPOptions): Promise<OnmsResult<any>> {
    const urlObj = new URI(url);
    throw new Error('Not yet implemented: DELETE ' + urlObj.toString());
  }
}
