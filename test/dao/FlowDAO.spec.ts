declare const await, describe, beforeEach, it, xit, expect, jest, require;

import {Client} from '../../src/Client';

import {OnmsAuthConfig} from '../../src/api/OnmsAuthConfig';
import {OnmsServer} from '../../src/api/OnmsServer';

import {OnmsFlowExporter} from '../../src/model/OnmsFlowExporter';
import {OnmsFlowExporterSummary} from '../../src/model/OnmsFlowExporterSummary';
import {OnmsFlowTable} from '../../src/model/OnmsFlowTable';

import {FlowDAO} from '../../src/dao/FlowDAO';

import {MockHTTP22} from '../rest/MockHTTP22';

/** @hidden */
// tslint:disable-next-line
const moment = require('moment');

const SERVER_NAME='Demo';
const SERVER_URL='http://demo.opennms.org/opennms/';
const SERVER_USER='demo';
const SERVER_PASSWORD='demo';

let opennms : Client, server, auth, mockHTTP, dao : FlowDAO;

describe('FlowDAO', () => {
    beforeEach((done) => {
        auth = new OnmsAuthConfig(SERVER_USER, SERVER_PASSWORD);
        server = new OnmsServer(SERVER_NAME, SERVER_URL, auth);
        mockHTTP = new MockHTTP22(server);
        opennms = new Client(mockHTTP);
        dao = new FlowDAO(mockHTTP);
        Client.getMetadata(server, mockHTTP).then((metadata) => {
            server.metadata = metadata;
            done();
        });
    });
    it('FlowDao.getExporters(1)', () => {
        return dao.getExporters(1).then((summaries) => {
            expect(summaries.length).toEqual(1);
            expect(summaries[0]).toBeInstanceOf(OnmsFlowExporterSummary);
            expect(summaries[0].id).toEqual(69); // nice
        });
    });
    it('FlowDao.getExporter(test:test-node)', () => {
        return dao.getExporter('test:test-node', 1).then((summary) => {
            expect(summary).toBeInstanceOf(OnmsFlowExporter);
            expect(summary.id).toEqual(69); // nice
        });
    });
    it('FlowDao.getSummaryForTopNApplications()', () => {
        return dao.getSummaryForTopNApplications().then((summary) => {
            expect(summary).toBeInstanceOf(OnmsFlowTable);
            expect(summary.start).toBeInstanceOf(moment);
            expect(summary.end).toBeInstanceOf(moment);
            expect(summary.headers).toContain('Application');
        });
    });
    it('FlowDao.getSeriesForTopNApplications()', () => {
        return dao.getSeriesForTopNApplications().then((series) => {
            expect(series.start).toBeInstanceOf(moment);
            expect(series.end).toBeInstanceOf(moment);
            expect(series.columns.length).toEqual(10);
            expect(series.timestamps.length).toEqual(49);
            expect(series.values.length).toEqual(10);
            expect(series.values[0].length).toEqual(49);
        });
    });
    it('FlowDao.getSummaryForTopNConversations()', () => {
        return dao.getSummaryForTopNConversations().then((summary) => {
            expect(summary).toBeInstanceOf(OnmsFlowTable);
            expect(summary.start).toBeInstanceOf(moment);
            expect(summary.end).toBeInstanceOf(moment);
            expect(summary.headers).toContain('Location');
            expect(summary.rows.length).toEqual(10);
        });
    });
    it('FlowDao.getSeriesForTopNConversations()', () => {
        return dao.getSeriesForTopNConversations().then((series) => {
            expect(series.start).toBeInstanceOf(moment);
            expect(series.end).toBeInstanceOf(moment);
            expect(series.columns.length).toEqual(10);
            expect(series.timestamps.length).toEqual(2);
            expect(series.values.length).toEqual(10);
            expect(series.values[0].length).toEqual(2);
        });
    });
});
