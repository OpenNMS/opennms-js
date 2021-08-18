import {AbstractMockHTTP} from './AbstractMockHTTP';
import {OnmsHTTPOptions} from '../../src/api/OnmsHTTPOptions';

/** Mock OpenNMS 28.x HTTP implementation */
export class MockHTTP28 extends AbstractMockHTTP {
  /** @inheritdoc */
  public onGet(url: string, options?: OnmsHTTPOptions) {
    switch(url) {
      case 'http://demo.opennms.org/opennms/rest/info': {
        return this.okJson({
          displayVersion: '28.0.0',
          packageDescription: 'OpenNMS',
          packageName: 'opennms',
          version: '28.0.0',
        });
      }
      // Use the v28 responses
      case 'rest/flows/dscp': {
        return this.okJsonFile('./28.0.0/get/rest/flows/dscp/summaries.json');
      }
      case 'rest/flows/dscp/enumerate': {
        return this.okJsonFile('./28.0.0/get/rest/flows/dscp/enumerate.json');
      }
      case 'rest/flows/dscp/series': {
        return this.okJsonFile('./28.0.0/get/rest/flows/dscp/series.json');
      }

      case 'api/v2/ipinterfaces': {
        return this.okJsonFile('./28.0.0/get/api/v2/ipinterfaces.json');
      }
      case 'api/v2/ipinterfaces?_s=isManaged==M': {
        return this.okJsonFile('./28.0.0/get/api/v2/ipinterfaces.json');
      }
      case 'api/v2/ipinterfaces/properties': {
        return this.okJsonFile('./28.0.0/get/api/v2/ipinterfaces.properties.json');
      }
    }
  }
}
