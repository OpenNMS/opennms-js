import {AbstractMockHTTP} from './AbstractMockHTTP';
import {OnmsHTTPOptions} from '../../src/api/OnmsHTTPOptions';

/** Mock OpenNMS 22.x HTTP implementation */
export class MockHTTP22 extends AbstractMockHTTP {
  /** @inheritdoc */
  public onGet(url: string, options?: OnmsHTTPOptions) {
    switch(url) {
      case 'http://demo.opennms.org/opennms/rest/info': {
        return this.okJson({
          displayVersion: '22.0.0',
          packageDescription: 'OpenNMS',
          packageName: 'opennms',
          version: '22.0.0',
        });
      }
      case 'rest/flows/exporters?limit=1': {
        return this.okJsonFile('./22.0.0/get/rest/flows/exporters.json');
      }
      case 'rest/flows/exporters/test:test-node?limit=1': {
        return this.okJsonFile('./22.0.0/get/rest/flows/exporter/test-node.json');
      }
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
    }
  }
}
