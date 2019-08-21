declare const describe, beforeEach, it, expect;

import {Client} from '../../src/Client';

import {OnmsAuthConfig} from '../../src/api/OnmsAuthConfig';
import {OnmsResult} from '../../src/api/OnmsResult';
import {OnmsServer} from '../../src/api/OnmsServer';

import {Comparators} from '../../src/api/Comparator';
import {Filter} from '../../src/api/Filter';
import {Restriction} from '../../src/api/Restriction';
import {SearchPropertyTypes} from '../../src/api/SearchPropertyType';

import {AlarmDAO} from '../../src/dao/AlarmDAO';

import {OnmsAlarm} from '../../src/model/OnmsAlarm';
import {TroubleTicketStates} from '../../src/model/OnmsTroubleTicketState';

import {XmlTransformer} from '../../src/rest/XmlTransformer';

import {MockHTTP19} from '../rest/MockHTTP19';
import {MockHTTP21} from '../rest/MockHTTP21';
import {MockHTTP23} from '../rest/MockHTTP23';

const SERVER_NAME = 'Demo';
const SERVER_URL = 'http://demo.opennms.org/opennms/';
const SERVER_USER = 'demo';
const SERVER_PASSWORD = 'demo';

let opennms: Client, server, auth, mockHTTP, dao: AlarmDAO;

describe('AlarmDAO with v1 API', () => {
  beforeEach((done) => {
    auth = new OnmsAuthConfig(SERVER_USER, SERVER_PASSWORD);
    const builder = OnmsServer.newBuilder(SERVER_URL).setName(SERVER_NAME).setAuth(auth);
    server = builder.build();
    mockHTTP = new MockHTTP19(server);
    opennms = new Client(mockHTTP);
    dao = new AlarmDAO(mockHTTP);
    Client.getMetadata(server, mockHTTP).then((metadata) => {
      server = builder.setMetadata(metadata).build();
      mockHTTP.server = server;
      done();
    });
  });
  it('AlarmDAO.getOptions()', (done) => {
    (dao as any).getOptions().then((opts) => {
      expect(opts.build()).toMatchObject({});
      done();
    });
  });
  it('AlarmDAO.getOptions(isAcknowledged=true)', (done) => {
    const filter = new Filter().withOrRestriction(new Restriction('isAcknowledged', Comparators.EQ, 'true'));
    (dao as any).getOptions(filter).then((o) => {
      const opts = o.build();
      expect(opts.parameters).toBeDefined();
      expect(opts.parameters.alarmAckTime).toEqual('notnull');
      done();
    });
  });
  it('AlarmDAO.getOptions(isAcknowledged=false)', (done) => {
    const filter = new Filter().withOrRestriction(new Restriction('isAcknowledged', Comparators.EQ, 'false'));
    (dao as any).getOptions(filter).then((o) => {
      const opts = o.build();
      expect(opts.parameters).toBeDefined();
      expect(opts.parameters.alarmAckTime).toEqual('null');
      done();
    });
  });
  it('AlarmDAO.getOptions(isAcknowledged!=true)', (done) => {
    const filter = new Filter().withOrRestriction(new Restriction('isAcknowledged', Comparators.NE, 'true'));
    (dao as any).getOptions(filter).then((o) => {
      const opts = o.build();
      expect(opts.parameters).toBeDefined();
      expect(opts.parameters.alarmAckTime).toEqual('null');
      done();
    });
  });
  it('AlarmDAO.getOptions(isAcknowledged!=false)', (done) => {
    const filter = new Filter().withOrRestriction(new Restriction('isAcknowledged', Comparators.NE, 'false'));
    (dao as any).getOptions(filter).then((o) => {
      const opts = o.build();
      expect(opts.parameters).toBeDefined();
      expect(opts.parameters.alarmAckTime).toEqual('notnull');
      done();
    });
  });
  it('AlarmDAO.get(404725)', () => {
    return dao.get(404725).then((alarm) => {
      expect(alarm.id).toEqual(404725);
      // Spot check some of the known properties
      expect(alarm.detailsPage).toEqual('http://demo.opennms.org/opennms/alarm/detail.htm?id=404725');
    });
  });
  it('AlarmDAO.find(id=404725)', () => {
    const filter = new Filter();
    filter.withOrRestriction(new Restriction('id', Comparators.EQ, 404725));
    return dao.find(filter).then((alarms) => {
      expect(alarms.length).toEqual(1);
    });
  });
  it('AlarmDAO.find(isAcknowledged=true)', () => {
    const filter = new Filter();
    filter.withOrRestriction(new Restriction('isAcknowledged', Comparators.EQ, 'true'));
    return dao.find(filter).then((alarms) => {
      expect(alarms.length).toEqual(1);
      expect(alarms[0].ackTime).toBeDefined();
      expect(alarms[0].ackTime.valueOf()).toEqual(1495806508530);
      expect(alarms[0].ackUser).toEqual('ranger');
    });
  });
  it('AlarmDAO.find(isAcknowledged=false)', () => {
    const filter = new Filter();
    filter.withOrRestriction(new Restriction('isAcknowledged', Comparators.EQ, 'false'));
    return dao.find(filter).then((alarms) => {
      expect(alarms.length).toEqual(1);
      expect(alarms[0].ackTime).not.toBeDefined();
      expect(alarms[0].ackUser).not.toBeDefined();
    });
  });
  it('AlarmDAO.find(isAcknowledged!=true)', () => {
    const filter = new Filter();
    filter.withOrRestriction(new Restriction('isAcknowledged', Comparators.NE, 'true'));
    return dao.find(filter).then((alarms) => {
      expect(alarms.length).toEqual(1);
      expect(alarms[0].ackTime).not.toBeDefined();
      expect(alarms[0].ackUser).not.toBeDefined();
    });
  });
  it('AlarmDAO.find(isAcknowledged!=false)', () => {
    const filter = new Filter();
    filter.withOrRestriction(new Restriction('isAcknowledged', Comparators.NE, 'false'));
    return dao.find(filter).then((alarms) => {
      expect(alarms.length).toEqual(1);
      expect(alarms[0].ackTime).toBeDefined();
      expect(alarms[0].ackTime.valueOf()).toEqual(1495806508530);
      expect(alarms[0].ackUser).toEqual('ranger');
    });
  });
  it('AlarmDAO.searchProperties() should reject', () => {
    return expect(dao.searchProperties()).rejects.toBeDefined();
  });

  for (const method of ['acknowledge', 'unacknowledge', 'escalate', 'clear']) {
    it('AlarmDAO.' + method + '(id=404725)', () => {
      return dao[method](404725);
    });
    it('AlarmDAO.' + method + '(OnmsAlarm(404725))', () => {
      const alarm = new OnmsAlarm();
      alarm.id = 404725;
      return dao[method](alarm);
    });
  }
  it('AlarmDAO.acknowledge(id=404725, user=ranger)', () => {
    return dao.acknowledge(404725, 'ranger');
  });
  it('AlarmDAO.unacknowledge(id=404725, user=ranger)', () => {
    return dao.unacknowledge(404725, 'ranger');
  });

  it('AlarmDAO.setTTicketId(alarmId=404725, ticketId=abcde)', () => {
    return dao.setTTicketId(404725, 'abcde');
  });
  it('AlarmDAO.setTTicketId(alarm=OnmsAlarm(404725), ticketId=abcde)', () => {
    const alarm = new OnmsAlarm();
    alarm.id = 404725;
    return dao.setTTicketId(alarm, 'abcde');
  });
  it('AlarmDAO.setTTicketState(alarmId=404725, ticketState=RESOLVED)', () => {
    return dao.setTTicketState(404725, TroubleTicketStates.RESOLVED);
  });
  it('AlarmDAO.setTTicketState(alarm=OnmsAlarm(404725), ticketState=RESOLVED)', () => {
    const alarm = new OnmsAlarm();
    alarm.id = 404725;
    return dao.setTTicketState(alarm, TroubleTicketStates.RESOLVED);
  });

  it('AlarmDAO.createTicket(404725) should reject', () => {
    return expect(dao.createTicket(404725)).rejects.toBeDefined();
  });
  it('AlarmDAO.triggerTicketUpdate(404725) should reject', () => {
    return expect(dao.triggerTicketUpdate(404725)).rejects.toBeDefined();
  });
  it('AlarmDAO.closeTicket(404725) should reject', () => {
    return expect(dao.closeTicket(404725)).rejects.toBeDefined();
  });

  it('AlarmDAO.saveStickyMemo(404725, "test") should reject', () => {
    return expect(dao.saveStickyMemo(404725, 'test')).rejects.toBeDefined();
  });
  it('AlarmDAO.saveJournalMemo(404725, "test") should reject', () => {
    return expect(dao.saveJournalMemo(404725, 'test')).rejects.toBeDefined();
  });
  it('AlarmDAO.deleteStickyMemo(404725) should reject', () => {
    return expect(dao.deleteStickyMemo(404725)).rejects.toBeDefined();
  });
  it('AlarmDAO.deleteJournalMemo(404725) should reject', () => {
      return expect(dao.deleteJournalMemo(404725)).rejects.toBeDefined();
  });
  describe('getData()', () => {
      it('Can handle single alarm. See JS-10', () => {
          const rawData = '<?xml version="1.0" encoding="UTF-8"?>\n' +
          '<alarms count="1" totalCount="1">\n' +
          '    <alarm type="1" count="1" id="1" severity="CRITICAL">\n' +
          '        <description>A problem has been triggered.</description>\n' +
          '        <firstEventTime>2017-07-28T20:41:46.236Z</firstEventTime>\n' +
          '        <lastEvent display="Y" log="Y" id="17" severity="CRITICAL">\n' +
          '            <createTime>2017-07-28T20:41:46.239Z</createTime>\n' +
          '            <description>A problem has been triggered.</description>\n' +
          '            <logMessage>A problem has been triggered on //.</logMessage>\n' +
          '            <source>ReST</source>\n' +
          '            <time>2017-07-28T20:41:46.236Z</time>\n' +
          '            <uei>uei.opennms.org/alarms/trigger</uei>\n' +
          '        </lastEvent>\n' +
          '        <lastEventTime>2017-07-28T20:41:46.236Z</lastEventTime>\n' +
          '        <logMessage>A problem has been triggered on //.</logMessage>\n' +
          '        <reductionKey>uei.opennms.org/alarms/trigger:::</reductionKey>\n' +
          '        <suppressedTime>2017-07-28T20:41:46.236Z</suppressedTime>\n' +
          '        <suppressedUntil>2017-07-28T20:41:46.236Z</suppressedUntil>\n' +
          '        <uei>uei.opennms.org/alarms/trigger</uei>\n' +
          '        <x733ProbableCause>0</x733ProbableCause>\n' +
          '    </alarm>\n' +
          '</alarms>';
          const jsonObject = new XmlTransformer().transform(rawData);

          // if this passes, no exception was thrown
          dao.getData({ data: jsonObject } as OnmsResult<any>);
      });
  });
});

describe('AlarmDAO with v2 API', () => {
  beforeEach((done) => {
    auth = new OnmsAuthConfig(SERVER_USER, SERVER_PASSWORD);
    const builder = OnmsServer.newBuilder(SERVER_URL).setName(SERVER_NAME).setAuth(auth);
    server = builder.build();
    mockHTTP = new MockHTTP21(server);
    opennms = new Client(mockHTTP);
    dao = new AlarmDAO(mockHTTP);
    Client.getMetadata(server, mockHTTP).then((metadata) => {
      server = builder.setMetadata(metadata).build();
      mockHTTP.server = server;
      done();
    });
  });
  it('AlarmDAO.getOptions()', (done) => {
    (dao as any).getOptions().then((opts) => {
      expect(opts.build()).toMatchObject({});
      done();
    });
  });
  it('AlarmDAO.getOptions(isAcknowledged=true)', (done) => {
    const filter = new Filter().withOrRestriction(new Restriction('isAcknowledged', Comparators.EQ, 'true'));
    (dao as any).getOptions(filter).then((o) => {
      const opts = o.build();
      expect(opts.parameters).toBeDefined();
      expect(opts.parameters._s).toEqual('alarmAckTime!=\u0000');
      done();
    });
  });
  it('AlarmDAO.getOptions(isAcknowledged=false)', (done) => {
    const filter = new Filter().withOrRestriction(new Restriction('isAcknowledged', Comparators.EQ, 'false'));
    (dao as any).getOptions(filter).then((o) => {
      const opts = o.build();
      expect(opts.parameters).toBeDefined();
      expect(opts.parameters._s).toEqual('alarmAckTime==\u0000');
      done();
    });
  });
  it('AlarmDAO.getOptions(isAcknowledged!=true)', (done) => {
    const filter = new Filter().withOrRestriction(new Restriction('isAcknowledged', Comparators.NE, 'true'));
    (dao as any).getOptions(filter).then((o) => {
      const opts = o.build();
      expect(opts.parameters).toBeDefined();
      expect(opts.parameters._s).toEqual('alarmAckTime==\u0000');
      done();
    });
  });
  it('AlarmDAO.getOptions(isAcknowledged!=false)', (done) => {
    const filter = new Filter().withOrRestriction(new Restriction('isAcknowledged', Comparators.NE, 'false'));
    (dao as any).getOptions(filter).then((o) => {
      const opts = o.build();
      expect(opts.parameters).toBeDefined();
      expect(opts.parameters._s).toEqual('alarmAckTime!=\u0000');
      done();
    });
  });
  it('AlarmDAO.get(6806)', () => {
    return dao.get(6806).then((alarm) => {
      expect(alarm.id).toEqual(6806);
      // Spot check some of the known properties
      expect(alarm.location).toEqual('Default');
      expect(alarm.isSituation).not.toBeTruthy();
      expect(alarm.lastEvent.label).toEqual('OpenNMS-defined node event: nodeDown');
      expect(alarm.lastEvent.location).toEqual('Default');
      expect(alarm.detailsPage).toEqual('http://demo.opennms.org/opennms/alarm/detail.htm?id=6806');
    });
  });
  it('AlarmDAO.find(id=6806)', () => {
    const filter = new Filter();
    filter.withOrRestriction(new Restriction('alarm.id', Comparators.EQ, 6806));
    return dao.find(filter).then((alarms) => {
      expect(alarms.length).toEqual(1);
      expect(alarms[0].id).toEqual(6806);
    });
  });
  it('AlarmDAO.find(isAcknowledged=true)', () => {
    const filter = new Filter().withOrRestriction(new Restriction('isAcknowledged', Comparators.EQ, 'true'));
    return dao.find(filter).then((alarms) => {
      expect(alarms.length).toEqual(1);
      expect(alarms[0].ackTime).toBeDefined();
      expect(alarms[0].ackTime.valueOf()).toEqual(1495806508530);
      expect(alarms[0].ackUser).toEqual('ranger');
    });
  });
  /*
  it('AlarmDAO.find(isAcknowledged=false)', () => {
    const filter = new Filter().withOrRestriction(new Restriction('isAcknowledged', Comparators.EQ, 'false'));
    return dao.find(filter).then((alarms) => {
      expect(alarms.length).toEqual(1);
      expect(alarms[0].ackTime).not.toBeDefined();
      expect(alarms[0].ackUser).not.toBeDefined();
    });
  });
  it('AlarmDAO.find(isAcknowledged!=true)', () => {
    const filter = new Filter().withOrRestriction(new Restriction('isAcknowledged', Comparators.NE, 'true'));
    return dao.find(filter).then((alarms) => {
      expect(alarms.length).toEqual(1);
      expect(alarms[0].ackTime).not.toBeDefined();
      expect(alarms[0].ackUser).not.toBeDefined();
    });
  });
  it('AlarmDAO.find(isAcknowledged!=false)', () => {
    const filter = new Filter().withOrRestriction(new Restriction('isAcknowledged', Comparators.NE, 'false'));
    return dao.find(filter).then((alarms) => {
      expect(alarms.length).toEqual(1);
      expect(alarms[0].ackTime).toBeDefined();
      expect(alarms[0].ackTime.valueOf()).toEqual(1495806508530);
      expect(alarms[0].ackUser).toEqual('ranger');
    });
  });
  */
  it('AlarmDAO.find(uei=should-not-exist)', () => {
    const filter = new Filter();
    filter.withOrRestriction(new Restriction('alarm.uei', Comparators.EQ, 'should-not-exist'));
    return dao.find(filter).then((alarms) => {
      expect(alarms.length).toEqual(0);
    });
  });
  it('should make the journal and sticky notes available - AlarmDAO.get(82416)', () => {
    return dao.get(82416).then((alarm) => {
      expect(alarm.id).toEqual(82416);
      expect(alarm.sticky.body).toEqual('sticky');
      expect(alarm.journal.body).toEqual('journal');
    });
  });
  it('AlarmDAO.searchProperties() should return a list of SearchProperty objects', () => {
    return dao.searchProperties().then((props) => {
      expect(props).toBeDefined();
      expect(props).toHaveLength(165);
      expect(props[0].id).toEqual('alarmAckTime');
      expect(props[0].type).toEqual(SearchPropertyTypes.TIMESTAMP);
    });
  });

  for (const method of ['acknowledge', 'unacknowledge', 'escalate', 'clear']) {
    it('AlarmDAO.' + method + '(id=404725)', () => {
      return dao[method](404725);
    });
    it('AlarmDAO.' + method + '(OnmsAlarm(404725))', () => {
      const alarm = new OnmsAlarm();
      alarm.id = 404725;
      return dao[method](alarm);
    });
  }
  it('AlarmDAO.acknowledge(id=404725, user=ranger)', () => {
    return dao.acknowledge(404725, 'ranger');
  });
  it('AlarmDAO.unacknowledge(id=404725, user=ranger)', () => {
    return dao.unacknowledge(404725, 'ranger');
  });

  it('AlarmDAO.setTTicketId(alarmId=404725, ticketId=abcde)', () => {
    return dao.setTTicketId(404725, 'abcde');
  });
  it('AlarmDAO.setTTicketId(alarm=OnmsAlarm(404725), ticketId=abcde)', () => {
    const alarm = new OnmsAlarm();
    alarm.id = 404725;
    return dao.setTTicketId(alarm, 'abcde');
  });
  it('AlarmDAO.setTTicketState(alarmId=404725, ticketState=RESOLVED)', () => {
    return dao.setTTicketState(404725, TroubleTicketStates.RESOLVED);
  });
  it('AlarmDAO.setTTicketState(alarm=OnmsAlarm(404725), ticketState=RESOLVED)', () => {
    const alarm = new OnmsAlarm();
    alarm.id = 404725;
    return dao.setTTicketState(alarm, TroubleTicketStates.RESOLVED);
  });

  it('AlarmDAO.createTicket(404725) should return a 202', () => {
    return expect(dao.createTicket(404725).then(() => {
      return true;
    })).resolves.toBeTruthy();
  });
  it('AlarmDAO.triggerTicketUpdate(404725) should reject', () => {
    return expect(dao.triggerTicketUpdate(404725).then(() => {
      return true;
    })).resolves.toBeTruthy();
  });
  it('AlarmDAO.closeTicket(404725) should reject', () => {
    return expect(dao.closeTicket(404725).then(() => {
      return true;
    })).resolves.toBeTruthy();
  });

  it('AlarmDAO.saveStickyMemo(404725, "test") should return a 204', () => {
    return expect(dao.saveStickyMemo(404725, 'test').then(() => {
      return true;
    })).resolves.toBeTruthy();
  });
  it('AlarmDAO.saveJournalMemo(404725, "test") should return a 204', () => {
    return expect(dao.saveJournalMemo(404725, 'test').then(() => {
      return true;
    })).resolves.toBeTruthy();
  });
  it('AlarmDAO.deleteStickyMemo(404725) should return a 204', () => {
    return expect(dao.deleteStickyMemo(404725).then(() => {
      return true;
    })).resolves.toBeTruthy();
  });
  it('AlarmDAO.deleteJournalMemo(404725) should return a 204', () => {
    return expect(dao.deleteJournalMemo(404725).then(() => {
      return true;
    })).resolves.toBeTruthy();
  });
});

describe('AlarmDAO with AlarmSummaryDTO', () => {
  beforeEach((done) => {
    auth = new OnmsAuthConfig(SERVER_USER, SERVER_PASSWORD);
    const builder = OnmsServer.newBuilder(SERVER_URL).setName(SERVER_NAME).setAuth(auth);
    server = builder.build();
    mockHTTP = new MockHTTP23(server);
    opennms = new Client(mockHTTP);
    dao = new AlarmDAO(mockHTTP);
    Client.getMetadata(server, mockHTTP).then((metadata) => {
      server = builder.setMetadata(metadata).build();
      mockHTTP.server = server;
      done();
    });
  });
  it('AlarmDAO.get(8)', () => {
    const filter = new Filter();
    filter.withOrRestriction(new Restriction('alarm.id', Comparators.EQ, 8));
    return dao.find(filter).then((alarms) => {
      expect(alarms.length).toEqual(4);
      expect(alarms[0].id).toEqual(8);
      expect(alarms[0].isSituation).toBeTruthy();
      expect(alarms[0].relatedAlarms.length).toEqual(3);
      expect(alarms[0].relatedAlarms[0].id).toEqual(5);
      expect(alarms[0].relatedAlarms[0].type).toEqual(2);
      expect(alarms[0].relatedAlarms[0].severity).toEqual('CRITICAL');
      expect(alarms[0].relatedAlarms[0].reductionKey)
        .toEqual('uei.opennms.org/alarms/trigger:localhost:0.0.0.0:HTTPS_APOOLs');
      expect(alarms[0].relatedAlarms[0].description).toEqual('A problem has been triggered.');
    });
  });
});

describe('Server and property caching', () => {
  beforeEach((done) => {
    auth = new OnmsAuthConfig(SERVER_USER, SERVER_PASSWORD);
    const builder = OnmsServer.newBuilder(SERVER_URL).setName(SERVER_NAME).setAuth(auth);
    server = builder.build();
    mockHTTP = new MockHTTP23(server);
    opennms = new Client(mockHTTP);
    dao = new AlarmDAO(mockHTTP);
    Client.getMetadata(server, mockHTTP).then((metadata) => {
      server = builder.setMetadata(metadata).build();
      mockHTTP.server = server;
      done();
    });
  });
  it('AlarmDAO.searchProperties()', async () => {
    let props = await dao.searchProperties();
    expect(props).toBeDefined();
    expect(props.length).toEqual(3);

    // update the server on the HTTP impl
    const builder = OnmsServer.newBuilder('http://demo1.opennms.org/opennms/').setName(SERVER_NAME).setAuth(auth);
    server = builder.build();
    mockHTTP.server = server;
    let metadata = await Client.getMetadata(server, mockHTTP);
    server = builder.setMetadata(metadata).build();
    mockHTTP.server = server;
    props = await dao.searchProperties();
    expect(props).toBeDefined();
    expect(props.length).toEqual(1);

    // update the server on the DAO
    builder.setUrl('http://demo2.opennms.org/opennms/');
    server = builder.build();
    mockHTTP.server = server;
    metadata = await Client.getMetadata(server, mockHTTP);
    server = builder.setMetadata(metadata).build();
    mockHTTP.server = server;
    props = await dao.searchProperties();
    expect(props).toBeDefined();
    expect(props.length).toEqual(2);
  });
});

describe('Extended Situation tests', () => {
  beforeEach((done) => {
    auth = new OnmsAuthConfig(SERVER_USER, SERVER_PASSWORD);
    const builder = OnmsServer.newBuilder(SERVER_URL).setName(SERVER_NAME).setAuth(auth);
    server = builder.build();
    mockHTTP = new MockHTTP23(server);
    opennms = new Client(mockHTTP);
    dao = new AlarmDAO(mockHTTP);
    Client.getMetadata(server, mockHTTP).then((metadata) => {
      server = builder.setMetadata(metadata).build();
      mockHTTP.server = server;
      done();
    });
  });
  it('AlarmDAO.get(situations)', () => {
    const filter = new Filter();
    filter.withOrRestriction(new Restriction('isSituation', Comparators.EQ, 'true'));
    return dao.find(filter).then((alarms) => {
      expect(alarms.length).toEqual(1);
      expect(alarms[0].id).toEqual(243);
      expect(alarms[0].isSituation).toBeTruthy();
      expect(alarms[0].relatedAlarms.length).toEqual(3);
      expect(alarms[0].affectedNodeCount).toEqual(1);
    });
  });
});
