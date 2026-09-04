import {IOnmsHTTP} from '../../src/api/IOnmsHTTP';
import {OnmsResult} from '../../src/api/OnmsResult';
import {OnmsServer} from '../../src/api/OnmsServer';
import {ServerMetadata} from '../../src/api/ServerMetadata';
import {ServerTypes} from '../../src/api/ServerType';

import {log} from '../../src/api/Log';

import {IpInterfaceDAO} from '../../src/dao/IpInterfaceDAO';
import {MonitoredServiceDAO} from '../../src/dao/MonitoredServiceDAO';
import {NodeDAO} from '../../src/dao/NodeDAO';
import {SnmpInterfaceDAO} from '../../src/dao/SnmpInterfaceDAO';

/**
 * Before the model `fromData` guards landed, a null element in one of these lists threw a
 * TypeError out of the DAO. Now it is dropped -- but it must not be dropped silently, which
 * is what AlarmDAO.find and EventDAO.find have always done for the same situation.
 */

const metadata = new ServerMetadata('30.0.0', ServerTypes.HORIZON);
const server = OnmsServer.newBuilder('http://localhost/opennms/')
  .setName('test').setMetadata(metadata).build();

/** These endpoints return a `{count, <key>: [...]}` envelope, which find() unwraps. */
const envelopeHTTP = (key: string, items: any[]) => ({
  get: () => Promise.resolve(
    OnmsResult.ok({count: items.length, totalCount: items.length, [key]: items}, 'OK', 200, 'application/json')),
} as unknown as IOnmsHTTP);

describe('DAOs warn when they drop unparseable list elements', () => {
  let warn: jest.SpyInstance;

  beforeEach(() => {
    warn = jest.spyOn(log, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => {
    warn.mockRestore();
  });

  it('IpInterfaceDAO.find drops the bad element and says so', async () => {
    const dao = new IpInterfaceDAO(envelopeHTTP('ipInterface', [{id: 1, ipAddress: '127.0.0.1'}, null]));
    dao.server = server;
    const ifaces = await dao.find();
    expect(ifaces.length).toEqual(1);
    expect(warn).toHaveBeenCalledWith(
      'IpInterfaceDAO.find ReST request succeeded, but 1 IP interfaces could not be parsed.');
  });

  it('SnmpInterfaceDAO.find drops the bad element and says so', async () => {
    const dao = new SnmpInterfaceDAO(envelopeHTTP('snmpInterface', [{id: 1, ifName: 'eth0'}, null]));
    dao.server = server;
    const ifaces = await dao.find();
    expect(ifaces.length).toEqual(1);
    expect(warn).toHaveBeenCalledWith(
      'SnmpInterfaceDAO.find ReST request succeeded, but 1 SNMP interfaces could not be parsed.');
  });

  it('MonitoredServiceDAO.find drops the bad element and says so', async () => {
    const dao = new MonitoredServiceDAO(envelopeHTTP('service', [{id: 1}, null]));
    dao.server = server;
    const services = await dao.find();
    expect(services.length).toEqual(1);
    expect(warn).toHaveBeenCalledWith(
      'MonitoredServiceDAO.find ReST request succeeded, but 1 monitored services could not be parsed.');
  });

  it('NodeDAO.ipInterfaces drops the bad element and says so', async () => {
    const dao = new NodeDAO(envelopeHTTP('ipInterface', [{id: 1, ipAddress: '127.0.0.1'}, null]));
    dao.server = server;
    const ifaces = await dao.ipInterfaces(1);
    expect(ifaces.length).toEqual(1);
    expect(warn).toHaveBeenCalledWith(
      'NodeDAO.ipInterfaces ReST request succeeded, but 1 IP interfaces could not be parsed.');
  });

  it('a clean list produces no warning', async () => {
    const dao = new IpInterfaceDAO(envelopeHTTP('ipInterface', [{id: 1, ipAddress: '127.0.0.1'}]));
    dao.server = server;
    const ifaces = await dao.find();
    expect(ifaces.length).toEqual(1);
    expect(warn).not.toHaveBeenCalled();
  });
});
