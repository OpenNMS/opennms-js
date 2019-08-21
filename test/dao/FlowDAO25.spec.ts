import {MockHTTP25} from '../rest/MockHTTP25';

declare const await, describe, beforeEach, it, xit, expect, jest, require;

import {Client} from '../../src/Client';

import {OnmsAuthConfig} from '../../src/api/OnmsAuthConfig';
import {OnmsServer} from '../../src/api/OnmsServer';

import {OnmsFlowExporter} from '../../src/model/OnmsFlowExporter';
import {OnmsFlowExporterSummary} from '../../src/model/OnmsFlowExporterSummary';
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

describe('FlowDAO25', () => {
    beforeEach((done) => {
        auth = new OnmsAuthConfig(SERVER_USER, SERVER_PASSWORD);
        const builder = OnmsServer.newBuilder(SERVER_URL).setName(SERVER_NAME).setAuth(auth);
        server = builder.build();
        mockHTTP = new MockHTTP25(server);
        opennms = new Client(mockHTTP);
        dao = new FlowDAO(mockHTTP);
        Client.getMetadata(server, mockHTTP).then((metadata) => {
            server = builder.setMetadata(metadata).build();
            mockHTTP.server = server;
            dao.server = server;
            done();
        });
    });
    it('FlowDao.getApplications()', () => {
        return dao.getApplications().then((applications) => {
            expect(['http', 'https', 'test']).toEqual(expect.arrayContaining(applications));
        });
    });
    it('FlowDao.getSummaryForApplications()', () => {
        return dao.getSummaryForApplications().then((summary) => {
            expect(summary).toBeInstanceOf(OnmsFlowTable);
            expect(summary.start).toBeInstanceOf(moment);
            expect(summary.end).toBeInstanceOf(moment);
            expect(summary.headers).toContain('Application');
        });
    });
    it('FlowDao.getSeriesForApplications()', () => {
        return dao.getSeriesForApplications().then((series) => {
            expect(series.start).toBeInstanceOf(moment);
            expect(series.end).toBeInstanceOf(moment);
            expect(series.columns.length).toEqual(10);
            expect(series.timestamps.length).toEqual(49);
            expect(series.values.length).toEqual(10);
            expect(series.values[0].length).toEqual(49);
        });
    });
    it('FlowDao.getSummaryForConversations()', () => {
        return dao.getSummaryForConversations().then((summary) => {
            expect(summary).toBeInstanceOf(OnmsFlowTable);
            expect(summary.start).toBeInstanceOf(moment);
            expect(summary.end).toBeInstanceOf(moment);
            expect(summary.headers).toContain('Location');
            expect(summary.rows.length).toEqual(10);
        });
    });
    it('FlowDao.getSeriesForConversations()', () => {
        return dao.getSeriesForConversations().then((series) => {
            expect(series.start).toBeInstanceOf(moment);
            expect(series.end).toBeInstanceOf(moment);
            expect(series.columns.length).toEqual(10);
            expect(series.timestamps.length).toEqual(2);
            expect(series.values.length).toEqual(10);
            expect(series.values[0].length).toEqual(2);
        });
    });
    it('FlowDao.getHosts()', () => {
        return dao.getHosts().then((hosts) => {
            expect(['10.1.1.1', '192.168.0.1', 'myhost']).toEqual(expect.arrayContaining(hosts));
        });
    });
    it('FlowDao.getSummaryForTopNHosts()', () => {
        return dao.getSummaryForTopNHosts().then((summary) => {
            expect(summary).toBeInstanceOf(OnmsFlowTable);
            expect(summary.start).toBeInstanceOf(moment);
            expect(summary.end).toBeInstanceOf(moment);
            expect(summary.headers).toContain('host');
        });
    });
    it('FlowDao.getSummaryForHosts()', () => {
        return dao.getSummaryForHosts().then((summary) => {
            expect(summary).toBeInstanceOf(OnmsFlowTable);
            expect(summary.start).toBeInstanceOf(moment);
            expect(summary.end).toBeInstanceOf(moment);
            expect(summary.headers).toContain('host');
        });
    });
    it('FlowDao.getSeriesForTopNHosts()', () => {
        return dao.getSeriesForTopNHosts().then((series) => {
            expect(series.start).toBeInstanceOf(moment);
            expect(series.end).toBeInstanceOf(moment);
            expect(series.columns.length).toEqual(10);
            expect(series.timestamps.length).toEqual(49);
            expect(series.values.length).toEqual(10);
            expect(series.values[0].length).toEqual(49);
        });
    });
    it('FlowDao.getSeriesForHosts()', () => {
        return dao.getSeriesForHosts().then((series) => {
            expect(series.start).toBeInstanceOf(moment);
            expect(series.end).toBeInstanceOf(moment);
            expect(series.columns.length).toEqual(10);
            expect(series.timestamps.length).toEqual(49);
            expect(series.values.length).toEqual(10);
            expect(series.values[0].length).toEqual(49);
        });
    });
});
