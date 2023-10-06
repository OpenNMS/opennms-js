declare const describe, beforeEach, it, expect;

import { Client} from '../../src/Client';

import { OnmsAuthConfig} from '../../src/api/OnmsAuthConfig';
import { OnmsServer} from '../../src/api/OnmsServer';
import { MonitoredServiceDAO } from '../../src/dao/MonitoredServiceDAO';
import { OnmsMonitoredService } from '../../src/model/OnmsMonitoredService';
import { MockHTTP32} from '../rest/MockHTTP32';

const SERVER_NAME = 'Demo';
const SERVER_URL = 'http://demo.opennms.org/opennms/';
const SERVER_USER = 'demo';
const SERVER_PASSWORD = 'demo';

let opennms: Client, server, auth, mockHTTP, dao: MonitoredServiceDAO;

describe('MonitoredServiceDAO with v2 API', () => {
  beforeEach((done) => {
    auth = new OnmsAuthConfig(SERVER_USER, SERVER_PASSWORD);
    const builder = OnmsServer.newBuilder(SERVER_URL).setName(SERVER_NAME).setAuth(auth);
    server = builder.build();
    mockHTTP = new MockHTTP32(server);
    opennms = new Client(mockHTTP);
    dao = new MonitoredServiceDAO(mockHTTP);
    Client.getMetadata(server, mockHTTP).then((metadata) => {
      server = builder.setMetadata(metadata).build();
      mockHTTP.server = server;
      done();
    });
  });

  it('MonitoredServiceDAO.getOptions()', (done) => {
    (dao as any).getOptions().then((opts) => {
      expect(opts.build()).toMatchObject({});
      done();
    });
  });

  it('MonitoredServiceDAO.get(4), does not have all fields', () => {
    return dao.get(4).then((service: OnmsMonitoredService) => {
      expect(service.id).toEqual(4);

      // Spot check some of the known properties
      expect(service.down).toBeTruthy();
      expect(service.lastGood?.valueOf()).toEqual(1651862554301);
      expect(service.lastFail?.valueOf()).toEqual(1663000042923);

      expect(service.type?.id).toEqual(1);
      expect(service.type?.name).toEqual('DeviceConfig-default');

      expect(service.status?.id).toEqual('A');
      expect(service.status?.label).toEqual('MANAGED');

      expect(service.urlValue).toEqual('DeviceConfig-default');

      expect(service.ipInterfaceId).toEqual(1);
      expect(service.ipAddress).not.toBeDefined();
      expect(service.nodeId).not.toBeDefined();
    });
  });

  it('MonitoredServiceDAO.get(99), has all fields', () => {
    return dao.get(99).then((service: OnmsMonitoredService) => {
      expect(service.id).toEqual(99);

      // Spot check some of the known properties
      expect(service.down).toBeTruthy();
      expect(service.lastGood?.valueOf()).toEqual(1651862554301);
      expect(service.lastFail?.valueOf()).toEqual(1663000042923);

      expect(service.type?.id).toEqual(1);
      expect(service.type?.name).toEqual('DeviceConfig-default');

      expect(service.status?.id).toEqual('A');
      expect(service.status?.label).toEqual('MANAGED');

      expect(service.urlValue).toEqual('DeviceConfig-default');

      expect(service.ipInterfaceId).toEqual(101);
      expect(service.ipAddress).toEqual('192.168.1.119');
      expect(service.nodeId).toEqual(142);
      expect(service.nodeLabel).toEqual('node119');
    });
  });

  it('MonitoredServiceDAO.find()', () => {
    return dao.find().then((services: OnmsMonitoredService[]) => {
      expect(services.length).toEqual(10)

      // Spot check some of the known properties
      let service = services[0]
      expect(service.id).toEqual(4);
      expect(service.down).toBeTruthy();
      expect(service.lastGood?.valueOf()).toEqual(1651862554301);
      expect(service.lastFail?.valueOf()).toEqual(1663000042923);
      expect(service.type?.id).toEqual(1);
      expect(service.type?.name).toEqual('DeviceConfig-default');
      expect(service.status?.id).toEqual('A');
      expect(service.status?.label).toEqual('MANAGED');
      expect(service.urlValue).toEqual('DeviceConfig-default');
 
      service = services[1]
      expect(service.id).toEqual(5);
      expect(service.down).toBeTruthy();
      expect(service.lastGood).not.toBeDefined();
      expect(service.lastFail?.valueOf()).toEqual(1663000042923);
      expect(service.type?.id).toEqual(1);
      expect(service.type?.name).toEqual('DeviceConfig-default');
      expect(service.status?.id).toEqual('A');
      expect(service.status?.label).toEqual('MANAGED');
      expect(service.urlValue).toEqual('DeviceConfig-default');

      service = services[5]
      expect(service.id).toEqual(39);
      expect(service.down).toEqual(false);
      expect(service.lastFail?.valueOf()).toEqual();
      expect(service.lastGood?.valueOf()).toEqual(1663000345039);
      expect(service.lastFail).not.toBeDefined();
      expect(service.type?.id).toEqual(3);
      expect(service.type?.name).toEqual('ICMP');
      expect(service.status?.id).toEqual('A');
      expect(service.status?.label).toEqual('MANAGED');
      expect(service.urlValue).toEqual('ICMP');
    });
  });
});
