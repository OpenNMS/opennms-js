import {IOnmsHTTP} from '../../src/api/IOnmsHTTP';
import {OnmsResult} from '../../src/api/OnmsResult';
import {OnmsServer} from '../../src/api/OnmsServer';
import {ServerMetadata} from '../../src/api/ServerMetadata';
import {ServerTypes} from '../../src/api/ServerType';

import {AlarmDAO} from '../../src/dao/AlarmDAO';
import {EventDAO} from '../../src/dao/EventDAO';
import {NodeDAO} from '../../src/dao/NodeDAO';
import {OutageDAO} from '../../src/dao/OutageDAO';

/**
 * These DAOs used to report `id={id}` literally: the messages were written as plain strings
 * rather than template literals, so the placeholder never interpolated. Assert the id being
 * requested actually reaches the message, so the diagnostic stays useful.
 */

// 30.0.0 Horizon reports apiVersion 2, which the v2-only DAOs assert on.
const metadata = new ServerMetadata('30.0.0', ServerTypes.HORIZON);
const server = OnmsServer.newBuilder('http://localhost/opennms/')
  .setName('test').setMetadata(metadata).build();

/** A 200 whose body yields no valid model object, which is what drives `get()` to throw. */
const emptyBodyHTTP = () => ({
  get: () => Promise.resolve(OnmsResult.ok(null, 'OK', 200, 'application/json')),
} as unknown as IOnmsHTTP);

// IpInterfaceDAO, MonitoredServiceDAO and SnmpInterfaceDAO are deliberately absent:
// OnmsIpInterface.fromData, OnmsMonitoredService.fromData and OnmsSnmpInterface.fromData
// lack the `if (!data) { return undefined; }` guard their siblings have, so they dereference
// a null body and throw a TypeError before the DAO's own `if (!x)` check can run. Those
// three messages are unreachable today; the no-restricted-syntax lint rule covers them, and
// the same rule covers the two `${diff}` warnings and AlarmDAO's `${alarm.id}`, which are
// log output rather than thrown errors.
const CASES: [string, (http: IOnmsHTTP) => any, number][] = [
  ['AlarmDAO', (http) => new AlarmDAO(http), 101],
  ['EventDAO', (http) => new EventDAO(http), 102],
  ['NodeDAO', (http) => new NodeDAO(http), 103],
  ['OutageDAO', (http) => new OutageDAO(http), 106],
];

describe('DAO error messages interpolate the requested id', () => {
  for (const [name, make, id] of CASES) {
    it(name + '.get(' + id + ') names the id it failed on', async () => {
      const dao = make(emptyBodyHTTP());
      dao.server = server;
      await expect(dao.get(id)).rejects.toThrow(
        new RegExp('^' + name + '\\.get id=' + id + ' ReST request succeeded'),
      );
    });
  }
});
