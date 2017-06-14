declare const await, describe, beforeEach, it, xit, expect, jest;

import {log,catRoot,setLogLevel} from '../../src/api/Log';
import {LogLevel} from 'typescript-logging';

setLogLevel(LogLevel.Debug, catRoot);

import {IFilterProcessor} from '../../src/api/IFilterProcessor';

import {Client} from '../../src/Client';

import {OnmsAuthConfig} from '../../src/api/OnmsAuthConfig';
import {OnmsError} from '../../src/api/OnmsError';
import {OnmsServer} from '../../src/api/OnmsServer';

import {Comparator, Comparators} from '../../src/api/Comparator';
import {Filter} from '../../src/api/Filter';
import {Restriction} from '../../src/api/Restriction';

import {AlarmDAO} from '../../src/dao/AlarmDAO';

import {OnmsAlarm} from '../../src/model/OnmsAlarm';
import {OnmsSeverity, Severities} from '../../src/model/OnmsSeverity';

import {V1FilterProcessor} from '../../src/dao/V1FilterProcessor';

import {MockHTTP} from '../rest/MockHTTP';

const SERVER_NAME='Demo';
const SERVER_URL='http://demo.opennms.org/opennms/';
const SERVER_USER='demo';
const SERVER_PASSWORD='demo';

let opennms : Client, server, auth, mockHTTP, dao : AlarmDAO;

describe('AlarmDAO', () => {
  beforeEach(() => {
    auth = new OnmsAuthConfig(SERVER_USER, SERVER_PASSWORD);
    server = new OnmsServer(SERVER_NAME, SERVER_URL, auth);
    mockHTTP = new MockHTTP(server);
    opennms = new Client(mockHTTP);
    dao = new AlarmDAO(mockHTTP);
  });
  it('AlarmDAO.get(404725)', () => {
    return dao.get(404725).then((alarm) => {
      expect(alarm.id).toEqual(404725);
    });
  });
  it('AlarmDAO.find(id=404725)', () => {
    const filter = new Filter<OnmsAlarm>();
    filter.restrictions.push(new Restriction('id', Comparators.EQ, 404725));
    return dao.find(filter).then((alarms) => {
      expect(alarms.length).toEqual(1);
    });
  });
});

/*
describe('V1FilterProcessor', () => {
  it('default alarm filter', () => {
    const filter = new Filter<OnmsAlarm>();
    const proc = new V1FilterProcessor();
    const params = proc.getParameters(filter);
    expect(Object.keys(params).length).toEqual(1);
    expect(params.limit).toEqual('1000');
  });
  it('alarm filter with no parameters', () => {
    const filter = new Filter<OnmsAlarm>();
    filter.limit = undefined;
    const proc = new V1FilterProcessor();
    const params = proc.getParameters(filter);
    expect(Object.keys(params).length).toEqual(0);
  });
  it('alarm filter: id=notnull', () => {
    const filter = new Filter<OnmsAlarm>();
    filter.restrictions.push(new Restriction('id', Comparators.NOTNULL));
    const proc = new V1FilterProcessor();
    const params = proc.getParameters(filter);
    expect(Object.keys(params).length).toEqual(2);
    expect(params.id).toEqual('notnull');
  });
  it('alarm filter: id=notnull, ackTime=null', () => {
    const filter = new Filter<OnmsAlarm>();
    filter.restrictions.push(new Restriction('id', Comparators.NOTNULL));
    filter.restrictions.push(new Restriction('ackTime', Comparators.NULL));
    const proc = new V1FilterProcessor();
    const params = proc.getParameters(filter);
    expect(Object.keys(params).length).toEqual(3);
    expect(params.id).toEqual('notnull');
    expect(params.ackTime).toEqual('null');
  });
  it('alarm filter: id=notnull, severity="MINOR"', () => {
    const filter = new Filter<OnmsAlarm>();
    filter.restrictions.push(new Restriction('id', Comparators.NOTNULL));
    filter.restrictions.push(new Restriction('severity', Comparators.EQ, 'MINOR'));
    const proc = new V1FilterProcessor();
    const params = proc.getParameters(filter);
    expect(Object.keys(params).length).toEqual(4);
    expect(params.comparator).toEqual('eq');
    expect(params.id).toEqual('notnull');
    expect(params.severity).toEqual('MINOR');
  });
  it('alarm filter: id=notnull, severity=OnmsSeverity.MINOR', () => {
    const filter = new Filter<OnmsAlarm>();
    filter.restrictions.push(new Restriction('id', Comparators.NOTNULL));
    filter.restrictions.push(new Restriction('severity', Comparators.EQ, Severities.MINOR));
    const proc = new V1FilterProcessor();
    const params = proc.getParameters(filter);
    expect(Object.keys(params).length).toEqual(4);
    expect(params.comparator).toEqual('eq');
    expect(params.id).toEqual('notnull');
    expect(params.severity).toEqual('MINOR');
  });
  it('alarm filter: severity=OnmsSeverity.MINOR, id!=0', () => {
    const filter = new Filter<OnmsAlarm>();
    filter.restrictions.push(new Restriction('severity', Comparators.EQ, Severities.MINOR));
    filter.restrictions.push(new Restriction('id', Comparators.NE, 0));
    const proc = new V1FilterProcessor();
    expect(() => {
      proc.getParameters(filter);
    }).toThrow(OnmsError);
  });
});
*/
