import { AbstractMockHTTP } from './AbstractMockHTTP';
import { OnmsHTTPOptions } from '../../src/api/OnmsHTTPOptions';

/** Mock OpenNMS 32.x HTTP implementation */
export class MockHTTP32 extends AbstractMockHTTP {
  /** @inheritdoc */
  public onGet(url: string, options?: OnmsHTTPOptions) {
    switch(url) {
      case 'http://demo.opennms.org/opennms/rest/info': {
        return this.okJson({
          displayVersion: '32.0.0',
          packageDescription: 'OpenNMS',
          packageName: 'opennms',
          version: '32.0.0',
        });
      }

      // Use the v32 responses   
      case 'api/v2/ifservices': {
        return this.okJsonFile('./32.0.0/get/api/v2/ifServices.json');
      } 
      case 'api/v2/ifservices/4': {
        return this.okJsonFile('./32.0.0/get/api/v2/4.json');
      } 
      case 'api/v2/ifservices/99': {
        return this.okJsonFile('./32.0.0/get/api/v2/99.json');
      }
    }
  }
}
