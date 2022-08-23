import {AbstractMockHTTP} from './AbstractMockHTTP';
import {OnmsHTTPOptions} from '../../src/api/OnmsHTTPOptions';

/** Mock OpenNMS 28.x HTTP implementation */
export class MockHTTP30 extends AbstractMockHTTP {
  /** @inheritdoc */
  public onGet(url: string, options?: OnmsHTTPOptions) {
    switch(url) {
      case 'http://demo.opennms.org/opennms/rest/info': {
        return this.okJson({
          displayVersion: '30.0.0',
          packageDescription: 'OpenNMS',
          packageName: 'opennms',
          version: '30.0.0',
        });
      }
      // Use the v30 responses   
      case 'api/v2/snmpinterfaces': {
        return this.okJsonFile('./30.0.0/get/api/v2/snmpinterfaces.json');
      } 
      case 'api/v2/snmpinterfaces/properties': {
        return this.okJsonFile('./30.0.0/get/api/v2/snmpinterfaces.properties.json');
      } 
      case 'api/v2/snmpinterfaces?limit=1000&_s=ifName%3D%3Dsome-test':{
        return this.okJsonFile('./30.0.0/get/api/v2/snmpinterfaces.filtered.json');
      }    

    }
  }
}
