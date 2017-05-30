declare const Promise;

import {AbstractHTTP} from '../../src/rest/AbstractHTTP';

import {OnmsHTTPOptions} from '../../src/api/OnmsHTTPOptions';
import {OnmsResult} from '../../src/api/OnmsResult';

export class MockHTTP extends AbstractHTTP {
  /** make an HTTP get call -- this should be overridden by the implementation */
  public get(url: string, options?: OnmsHTTPOptions) {
  	switch(url) {
  		case 'http://demo.opennms.org/opennms/rest/info': {
  			return Promise.resolve(OnmsResult.ok({'packageDescription':'OpenNMS','displayVersion':'19.1.0','packageName':'opennms','version':'19.1.0'}));
  		}
  	}
    return Promise.reject(OnmsResult.error('Not yet implemented.'));
  }
}