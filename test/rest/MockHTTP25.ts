import {AbstractMockHTTP} from './AbstractMockHTTP';
import {OnmsHTTPOptions} from '../../src/api/OnmsHTTPOptions';

/** Mock OpenNMS 25.x HTTP implementation */
export class MockHTTP25 extends AbstractMockHTTP {
  /** @inheritdoc */
  public onGet(url: string, options?: OnmsHTTPOptions) {
    switch(url) {
      case 'http://demo.opennms.org/opennms/rest/info': {
        return this.okJson({
          displayVersion: '25.0.0',
          packageDescription: 'OpenNMS',
          packageName: 'opennms',
          version: '25.0.0',
        });
      }
      // Use the v22 responses
      case 'rest/flows/applications': {
        return this.okJsonFile('./22.0.0/get/rest/flows/applications.json');
      }
      case 'rest/flows/applications/series': {
        return this.okJsonFile('./22.0.0/get/rest/flows/applications/series.json');
      }
      case 'rest/flows/conversations': {
        return this.okJsonFile('./22.0.0/get/rest/flows/conversations.json');
      }
      case 'rest/flows/conversations/series': {
        return this.okJsonFile('./22.0.0/get/rest/flows/conversations/series.json');
      }
      // Use the v25 responses
      case 'rest/flows/applications/enumerate': {
        return this.okJsonFile('./25.0.0/get/rest/flows/applications/enumerate.json');
      }
      case 'rest/flows/hosts/enumerate': {
        return this.okJsonFile('./25.0.0/get/rest/flows/hosts/enumerate.json');
      }
      case 'rest/flows/hosts': {
        return this.okJsonFile('./25.0.0/get/rest/flows/hosts.json');
      }
      case 'rest/flows/hosts/series': {
        return this.okJsonFile('./25.0.0/get/rest/flows/hosts/series.json');
      }
    }
  }
}
