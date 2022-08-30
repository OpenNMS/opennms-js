declare const describe, beforeEach, it, expect;

import { Client } from '../../src/Client';

import { OnmsAuthConfig } from '../../src/api/OnmsAuthConfig';
import { OnmsServer } from '../../src/api/OnmsServer';

import { Comparators } from '../../src/api/Comparator';
import { Filter } from '../../src/api/Filter';
import { Restriction } from '../../src/api/Restriction';

import { SnmpInterfaceDAO } from '../../src/dao/SnmpInterfaceDAO';

import { MockHTTP30 } from '../rest/MockHTTP30';

const SERVER_NAME = 'Demo';
const SERVER_URL = 'http://demo.opennms.org/opennms/';
const SERVER_USER = 'demo';
const SERVER_PASSWORD = 'demo';

let opennms: Client, server, auth, mockHTTP, dao: SnmpInterfaceDAO;

describe('SnmpInterfaceDAO with v2 API', () => {
  beforeEach((done) => {
    auth = new OnmsAuthConfig(SERVER_USER, SERVER_PASSWORD);
    const builder = OnmsServer.newBuilder(SERVER_URL).setName(SERVER_NAME).setAuth(auth);
    server = builder.build();
    mockHTTP = new MockHTTP30(server);
    opennms = new Client(mockHTTP);
    dao = new SnmpInterfaceDAO(mockHTTP);
    Client.getMetadata(server, mockHTTP).then((metadata) => {
      server = builder.setMetadata(metadata).build();
      mockHTTP.server = server;
      done();
    });
  });

  it('SnmpInterfaceDAO.getOptions()', (done) => {
    (dao as any).getOptions().then((opts) => {
      expect(opts.build()).toMatchObject({});
      done();
    });
  });

  it('SnmpInterfaceDAO.getOptions(ifName=some-test)', (done) => {
    const filter = new Filter().withOrRestriction(new Restriction('ifName', Comparators.EQ, 'some-test'));
    (dao as any).getOptions(filter).then((o) => {
      const opts = o.build();
      expect(opts.parameters).toBeDefined();
      expect(opts.parameters._s).toEqual('ifName==some-test');
      done();
    });
  });

  it('SnmpInterfaceDAO.find()', () => {
    const filter = new Filter();
    return dao.find().then((ifaces) => {
      expect(ifaces.length).toEqual(5);
      expect(ifaces[0].id).toEqual(169);
    });
  });

  it('SnmpInterfaceDAO.find(ifName=some-test)', () => {
    const filter = new Filter();
    filter.withOrRestriction(new Restriction('ifName', Comparators.EQ, 'some-test'));
    return dao.find(filter).then((ifaces) => {
      expect(ifaces.length).toEqual(3);
      expect(ifaces[0].id).toEqual(171);
      expect(ifaces[0].nodeId).toEqual(27);
    });
  });
})