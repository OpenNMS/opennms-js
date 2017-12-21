declare const await, describe, beforeEach, it, xit, expect, jest, require;

import {Client} from '../../src/Client';

import {OnmsAuthConfig} from '../../src/api/OnmsAuthConfig';
import {OnmsServer} from '../../src/api/OnmsServer';

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
});
