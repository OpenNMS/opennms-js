import {MockHTTP28} from '../rest/MockHTTP28';

declare const await, describe, beforeEach, it, xit, expect, jest, require;

import {Client} from '../../src/Client';

import {OnmsAuthConfig} from '../../src/api/OnmsAuthConfig';
import {OnmsServer} from '../../src/api/OnmsServer';

import {OnmsFlowTable} from '../../src/model/OnmsFlowTable';

import {FlowDAO} from '../../src/dao/FlowDAO';

/** @hidden */
// tslint:disable-next-line
const moment = require('moment');

const SERVER_NAME = 'Demo';
const SERVER_URL = 'http://demo.opennms.org/opennms/';
const SERVER_USER = 'demo';
const SERVER_PASSWORD = 'demo';

let opennms: Client, server, auth, mockHTTP, dao: FlowDAO;

describe('FlowDAO28', () => {
    beforeEach((done) => {
        auth = new OnmsAuthConfig(SERVER_USER, SERVER_PASSWORD);
        const builder = OnmsServer.newBuilder(SERVER_URL).setName(SERVER_NAME).setAuth(auth);
        server = builder.build();
        mockHTTP = new MockHTTP28(server);
        opennms = new Client(mockHTTP);
        dao = new FlowDAO(mockHTTP);
        Client.getMetadata(server, mockHTTP).then((metadata) => {
            server = builder.setMetadata(metadata).build();
            mockHTTP.server = server;
            dao.server = server;
            done();
        });
    });
    it('FlowDao.getSummaryForDscp()', () => {
        return dao.getSummaryForDscps().then((summary) => {
            expect(summary).toBeInstanceOf(OnmsFlowTable);
            expect(summary.start).toBeInstanceOf(moment);
            expect(summary.end).toBeInstanceOf(moment);
            expect(summary.headers).toContain('DSCP');
        });
    });
    it('FlowDao.getSeriesForDscp()', () => {
        return dao.getSeriesForDscps().then((series) => {
            expect(series.start).toBeInstanceOf(moment);
            expect(series.end).toBeInstanceOf(moment);
            expect(series.columns.length).toEqual(2);
            expect(series.timestamps.length).toEqual(44);
            expect(series.values.length).toEqual(2);
            expect(series.values[0].length).toEqual(44);
        });
    });
    it('FlowDao.getDscpValues()', () => {
        return dao.getDscpValues().then((toss) => {
            expect([4, 5, 6]).toEqual(expect.arrayContaining(toss));
        });
    });
});
