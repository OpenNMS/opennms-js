// tslint:disable-next-line:one-variable-per-declaration
declare const await, describe, beforeEach, it, xit, expect, jest;

import { log, catRoot, setLogLevel } from '../../src/api/Log';
import { LogLevel } from 'typescript-logging';

import { Client } from '../../src/Client';

import { OnmsAuthConfig } from '../../src/api/OnmsAuthConfig';
import { OnmsServer } from '../../src/api/OnmsServer';
import { OnmsResult } from '../../src/api/OnmsResult';

import { Comparators } from '../../src/api/Comparator';
import { Filter } from '../../src/api/Filter';
import { Restriction } from '../../src/api/Restriction';
import { SearchPropertyTypes } from '../../src/api/SearchPropertyType';

import { SituationFeedbackDAO } from '../../src/dao/SituationFeedbackDAO';

import { OnmsSituationFeedback } from '../../src/model/OnmsSituationFeedback';

import { MockHTTP23 } from '../rest/MockHTTP23';
import { OnmsSituationFeedbackType } from '../../src/model/OnmsSituationFeedbackType';

const SERVER_NAME = 'Demo';
const SERVER_URL = 'http://demo.opennms.org/opennms/';
const SERVER_USER = 'demo';
const SERVER_PASSWORD = 'demo';

// tslint:disable-next-line:one-variable-per-declaration
let opennms: Client, server, auth, mockHTTP, dao: SituationFeedbackDAO;

describe('SituationfeedbackDAO with v1 API', () => {
    beforeEach((done) => {
        auth = new OnmsAuthConfig(SERVER_USER, SERVER_PASSWORD);
        server = new OnmsServer(SERVER_NAME, SERVER_URL, auth);
        mockHTTP = new MockHTTP23(server);
        opennms = new Client(mockHTTP);
        dao = new SituationFeedbackDAO(mockHTTP);
        Client.getMetadata(server, mockHTTP).then((metadata) => {
            server.metadata = metadata;
            done();
        });
    });
    it('SituationFeedbackDAO.get(FEEDBACK_F)', () => {
        return dao.getFeedback('uei.opennms.org/alarms/trigger:localhost:0.0.0.0:FEEDBACK_F').then((feedback) => {
            expect(feedback).toHaveLength(4);
            expect(feedback[0].alarmKey).toEqual('uei.opennms.org/alarms/trigger:localhost:0.0.0.0:FEEDBACK_C');
            expect(feedback[0].fingerprint).toEqual('NDg3ZjdiMjJmNjgzMTJkMmMxYmJjOTNiMWFlYTQ0NWI=');
            expect(feedback[0].feedbackType).toEqual(OnmsSituationFeedbackType.forId('CORRECT'));
            expect(feedback[0].reason).toEqual('ALL_CORRECT');
            expect(feedback[0].user).toEqual('admin');
            expect(feedback[0].timestamp).toEqual(1533835399918);
        });
    });
});
