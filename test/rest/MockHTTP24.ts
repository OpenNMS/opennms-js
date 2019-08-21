import {AbstractMockHTTP} from './AbstractMockHTTP';
import {OnmsHTTPOptions} from '../../src/api/OnmsHTTPOptions';

/** Mock OpenNMS 24.x HTTP implementation */
export class MockHTTP24 extends AbstractMockHTTP {
  /** @inheritdoc */
  public onGet(url: string, options?: OnmsHTTPOptions) {
    switch (url) {
      case 'http://demo.opennms.org/opennms/rest/info': {
        return this.okJson({
            displayVersion: '24.0.0',
            packageDescription: 'OpenNMS',
            packageName: 'opennms', version: '24.0.0'
          });
      }
      case 'rest/situation-feedback/616': {
        return this.okJsonFile('./24.0.0/get/rest/situation-feedback/616.json');
      }
      case 'rest/situation-feedback/tags': {
        return this.okJsonFile('./24.0.0/get/rest/situation-feedback/tags.json');
      }
      case 'rest/situation-feedback/tags?prefix=ba': {
        return this.okJsonFile('./24.0.0/get/rest/situation-feedback/tags.json');
      }
    }
  }
}
