declare const describe, beforeEach, it, expect;

import {Client} from '../../src/Client';

import {OnmsAuthConfig} from '../../src/api/OnmsAuthConfig';
import {OnmsServer} from '../../src/api/OnmsServer';

import {Comparators} from '../../src/api/Comparator';
import {Filter} from '../../src/api/Filter';
import {Restriction} from '../../src/api/Restriction';

import {IpInterfaceDAO} from '../../src/dao/IpInterfaceDAO';

import {MockHTTP28} from '../rest/MockHTTP28';
import {ManagedTypes} from '../../src/model/OnmsManagedType';

const SERVER_NAME = 'Demo';
const SERVER_URL = 'http://demo.opennms.org/opennms/';
const SERVER_USER = 'demo';
const SERVER_PASSWORD = 'demo';

let opennms: Client, server, auth, mockHTTP, dao: IpInterfaceDAO;

describe('IpInterfaceDAO with v2 API', () => {
  beforeEach((done) => {
    auth = new OnmsAuthConfig(SERVER_USER, SERVER_PASSWORD);
    const builder = OnmsServer.newBuilder(SERVER_URL).setName(SERVER_NAME).setAuth(auth);
    server = builder.build();
    mockHTTP = new MockHTTP28(server);
    opennms = new Client(mockHTTP);
    dao = new IpInterfaceDAO(mockHTTP);
    Client.getMetadata(server, mockHTTP).then((metadata) => {
      server = builder.setMetadata(metadata).build();
      mockHTTP.server = server;
      done();
    });
  });
  it('IpInterfaceDAO.getOptions()', (done) => {
    (dao as any).getOptions().then((opts) => {
      expect(opts.build()).toMatchObject({});
      done();
    });
  });
  it('IpInterfaceDAO.getOptions(ipAddress=192.168.211.6)', (done) => {
    const filter = new Filter().withOrRestriction(new Restriction('ipAddress', Comparators.EQ, '192.168.211.6'));
    (dao as any).getOptions(filter).then((o) => {
      const opts = o.build();
      expect(opts.parameters).toBeDefined();
      expect(opts.parameters._s).toEqual('ipAddress==192.168.211.6');
      done();
    });
  });
  it('IpInterfaceDAO.find()', () => {
    const filter = new Filter();
    return dao.find().then((ifaces) => {
      expect(ifaces.length).toEqual(2);
      expect(ifaces[0].id).toEqual(1);
    });
  });
  it('IpInterfaceDAO.find(isManaged=M)', () => {
    const filter = new Filter();
    filter.withOrRestriction(new Restriction('isManaged', Comparators.EQ, ManagedTypes.MANAGED));
    return dao.find().then((ifaces) => {
      expect(ifaces.length).toEqual(2);
      expect(ifaces[0].id).toEqual(1);
    });
  });
});
