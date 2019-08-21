declare const await, describe, beforeEach, it, xit, expect, jest, require;

import {Client} from '../../src/Client';

import {Comparators} from '../../src/api/Comparator';
import {Filter} from '../../src/api/Filter';
import {Restriction} from '../../src/api/Restriction';

import {OnmsAuthConfig} from '../../src/api/OnmsAuthConfig';
import {OnmsServer} from '../../src/api/OnmsServer';

import {OnmsCategory} from '../../src/model/OnmsCategory';
import {OnmsNodeType} from '../../src/model/OnmsNodeType';
import {SnmpStatusTypes} from '../../src/model/OnmsSnmpStatusType';

import {NodeDAO} from '../../src/dao/NodeDAO';

import {MockHTTP19} from '../rest/MockHTTP19';
import {MockHTTP21} from '../rest/MockHTTP21';

/** @hidden */
// tslint:disable-next-line
const moment = require('moment');

const SERVER_NAME = 'Demo';
const SERVER_URL = 'http://demo.opennms.org/opennms/';
const SERVER_USER = 'demo';
const SERVER_PASSWORD = 'demo';

let opennms: Client, server, auth, mockHTTP, dao: NodeDAO;

describe('NodeDAO with v1 API', () => {
  beforeEach((done) => {
    auth = new OnmsAuthConfig(SERVER_USER, SERVER_PASSWORD);
    const builder = OnmsServer.newBuilder(SERVER_URL).setName(SERVER_NAME).setAuth(auth);
    server = builder.build();
    mockHTTP = new MockHTTP19(server);
    opennms = new Client(mockHTTP);
    dao = new NodeDAO(mockHTTP);
    Client.getMetadata(server, mockHTTP).then((metadata) => {
      server = builder.setMetadata(metadata).build();
      mockHTTP.server = server;
      done();
    });
  });
  it('NodeDAO.get(43, [recurse=false])', () => {
    return dao.get(43).then((node) => {
      expect(node.id).toEqual(43);
      expect(node.categories.length).toEqual(2);
      expect(node.categories[0]).toBeInstanceOf(OnmsCategory);
      expect(node.foreignSource).toBeUndefined();
      expect(node.createTime).toBeInstanceOf(moment);
      expect(node.type).toBeDefined();
      expect(node.type).toBeInstanceOf(OnmsNodeType);
    });
  });
  it('NodeDAO.get(43, recurse=true)', () => {
    return dao.get(43, true).then((node) => {
      expect(node.id).toEqual(43);
      expect(node.categories.length).toEqual(2);
      expect(node.categories[0]).toBeInstanceOf(OnmsCategory);
      expect(node.foreignSource).toBeUndefined();
      expect(node.createTime).toBeInstanceOf(moment);
      expect(node.type).toBeDefined();
      expect(node.type).toBeInstanceOf(OnmsNodeType);

      expect(node.snmpInterfaces.length).toEqual(6);

      const snmp = node.snmpInterfaces[2];
      expect(snmp.ifIndex).toEqual(4);
      expect(snmp.ifSpeed).toEqual(0);
      expect(snmp.ifAdminStatus).toEqual(SnmpStatusTypes['1']);
      expect(snmp.ifOperStatus).toEqual(SnmpStatusTypes['1']);
      expect(snmp.ifName).toEqual('br0');
      expect(snmp.physAddr).toBeDefined();
      expect(snmp.physAddr.toString()).toEqual('40:8D:5C:55:55:A2');

      expect(node.ipInterfaces.length).toEqual(2);
      const ip = node.ipInterfaces[0];
      expect(ip.hostname).toEqual('butters.internal.opennms.com');
      expect(ip.services.length).toEqual(5);

      expect(ip.snmpInterface).toEqual(snmp);
    });
  });
  it('NodeDAO.find(id=43)', () => {
    const filter = new Filter();
    filter.withOrRestriction(new Restriction('id', Comparators.EQ, 43));
    return dao.find(filter).then((nodes) => {
      expect(nodes.length).toEqual(1);
    });
  });
  it('NodeDAO.properties() should reject', () => {
    return expect(dao.searchProperties()).rejects.toBeDefined();
  });
});

describe('NodeDAO with v2 API', () => {
  beforeEach((done) => {
    auth = new OnmsAuthConfig(SERVER_USER, SERVER_PASSWORD);
    const builder = OnmsServer.newBuilder(SERVER_URL).setName(SERVER_NAME).setAuth(auth);
    server = builder.build();
    mockHTTP = new MockHTTP21(server);
    opennms = new Client(mockHTTP);
    dao = new NodeDAO(mockHTTP);
    Client.getMetadata(server, mockHTTP).then((metadata) => {
      server = builder.setMetadata(metadata).build();
      mockHTTP.server = server;
      done();
    });
  });
  it('NodeDAO.get(81, [recurse=false])', () => {
    return dao.get(81).then((node) => {
      expect(node.id).toEqual(81);
      expect(node.categories.length).toEqual(1);
      expect(node.categories[0]).toBeInstanceOf(OnmsCategory);
      expect(node.foreignSource).toEqual('test');
      expect(node.createTime).toBeInstanceOf(moment);
      expect(node.type).toBeDefined();
      expect(node.type).toBeInstanceOf(OnmsNodeType);
    });
  });
  it('NodeDAO.get(81, recurse=true)', () => {
    return dao.get(81, true).then((node) => {
      expect(node.id).toEqual(81);
      expect(node.categories.length).toEqual(1);
      expect(node.categories[0]).toBeInstanceOf(OnmsCategory);
      expect(node.foreignSource).toEqual('test');
      expect(node.createTime).toBeInstanceOf(moment);
      expect(node.type).toBeDefined();
      expect(node.type).toBeInstanceOf(OnmsNodeType);

      expect(node.snmpInterfaces.length).toEqual(10);

      const snmp = node.snmpInterfaces[2];
      expect(snmp.ifIndex).toEqual(3);
      expect(snmp.ifSpeed).toEqual(0);
      expect(snmp.ifAdminStatus).toEqual(SnmpStatusTypes['2']);
      expect(snmp.ifOperStatus).toEqual(SnmpStatusTypes['2']);
      expect(snmp.ifName).toEqual('stf0');

      expect(node.ipInterfaces.length).toEqual(2);
      const ip = node.ipInterfaces[1];
      expect(ip.hostname).toEqual('172.20.1.110');
      expect(ip.services.length).toEqual(3);

      expect(ip.snmpInterface).toBeUndefined();
    });
  });
  /* find is currently broken in v2
  it('NodeDAO.find(id=81)', () => {
    const filter = new Filter();
    filter.withOrRestriction(new Restriction('id', Comparators.EQ, 81));
    return dao.find(filter).then((nodes) => {
      expect(nodes.length).toEqual(1);
    });
  });
  */
  it('NodeDAO.properties() should reject until it is implemented', () => {
    return expect(dao.searchProperties()).rejects.toBeDefined();
  });
});
