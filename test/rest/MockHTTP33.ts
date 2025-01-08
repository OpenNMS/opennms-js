import { AbstractMockHTTP } from './AbstractMockHTTP';
import { OnmsHTTPOptions } from '../../src/api/OnmsHTTPOptions';

/** Mock OpenNMS 33.x HTTP implementation */
export class MockHTTP33 extends AbstractMockHTTP {
  /** @inheritdoc */
  public onGet(url: string, options?: OnmsHTTPOptions) {
    switch(url) {
      case 'http://demo.opennms.org/opennms/rest/info': {
        return this.okJson({
          displayVersion: '33.0.0',
          packageDescription: 'OpenNMS',
          packageName: 'opennms',
          version: '33.0.0',
        });
      }

      // Use the v33 responses   
      case 'api/v2/nodes/81': {
        return this.okJsonFile('./33.0.0/get/api/v2/nodes/81.json');
      } 
    }
  }
}
