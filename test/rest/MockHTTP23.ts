import {AbstractMockHTTP} from './AbstractMockHTTP';
import {OnmsHTTPOptions} from '../../src/api/OnmsHTTPOptions';

/** Mock OpenNMS 23.x HTTP implementation */
export class MockHTTP23 extends AbstractMockHTTP {
  /** @inheritdoc */
  public onGet(url: string, options?: OnmsHTTPOptions) {
    switch (url) {
      case 'http://demo.opennms.org/opennms/rest/info':
      case 'http://demo1.opennms.org/opennms/rest/info':
      case 'http://demo2.opennms.org/opennms/rest/info':
        {
          return this.okJson({
            displayVersion: '23.0.0',
            packageDescription: 'OpenNMS',
            packageName: 'opennms',
            version: '23.0.0',
          });
        }
      case 'api/v2/alarms/8': {
        return this.okJsonFile('./23.0.0/get/api/v2/alarms/8.json');
      }
      case 'api/v2/alarms?limit=1000&_s=alarm.id%3D%3D8': {
        return this.okJsonFile('./23.0.0/get/api/v2/alarms/8.json');
      }
      case 'rest/situation-feedback/210': {
        return this.okJsonFile('./23.0.0/get/rest/situation-feedback/feedback.json');
      }
      case 'api/v2/alarms?limit=1000&_s=isSituation%3D%3Dtrue': {
        return this.okJsonFile('./23.0.0/get/api/v2/alarms/243.json');
      }
      case 'api/v2/alarms/properties': {
        switch (this.server.url) {
          case 'http://demo1.opennms.org/opennms/':
            return this.okJsonFile('./23.0.0/get/api/v2/alarms/properties-demo1.json');
          case 'http://demo2.opennms.org/opennms/':
            return this.okJsonFile('./23.0.0/get/api/v2/alarms/properties-demo2.json');
          default:
            return this.okJsonFile('./23.0.0/get/api/v2/alarms/properties.json');
        }
      }
      case 'api/v2/alarms/properties?cache=1': {
        return this.okJsonFile('./23.0.0/get/api/v2/alarms/properties-1.json');
      }
      case 'api/v2/alarms/properties?cache=2': {
        return this.okJsonFile('./23.0.0/get/api/v2/alarms/properties-2.json');
      }
      case 'api/v2/alarms/properties?cache=3': {
        return this.okJsonFile('./23.0.0/get/api/v2/alarms/properties-3.json');
      }
    }
  }
}
