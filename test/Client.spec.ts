declare const await, describe, beforeEach, it, expect, jest;

import {Client} from '../src/Client';
import {OnmsAuthConfig} from '../src/api/OnmsAuthConfig';
import {OnmsResult} from '../src/api/OnmsResult';

import {OnmsServer} from '../src/model/OnmsServer';
import {ServerMetadata} from '../src/model/ServerMetadata';

import {MockHTTP} from './rest/MockHTTP';

import {ServerType} from '../src/api/Constants';

import Enum from 'es6-enum';

const SERVER_NAME='Demo';
const SERVER_URL='http://demo.opennms.org/opennms/';
const SERVER_USER='demo';
const SERVER_PASSWORD='demo';

let opennms, server, auth, mockHTTP;

describe('Given an instance of OpenNMS...', function () {
  beforeEach(function () {
    mockHTTP = new MockHTTP();
    opennms = new Client(mockHTTP);
    auth = new OnmsAuthConfig(SERVER_USER, SERVER_PASSWORD);
    server = new OnmsServer(SERVER_NAME, SERVER_URL, auth);
  });
  describe('when I have a default OpenNMS object', () => {
    it('it should have no server', () => {
      expect(opennms.server).toBeUndefined();
    });
    it('it should return a capability object when called on a valid server', () => {
      let ret = Client.checkServer(server, mockHTTP);
      expect(ret).toBeDefined();
      return ret.then((result) => {
        expect(result).toBeDefined();
        expect(result).toBeInstanceOf(OnmsResult);
        expect(result.data).toBeInstanceOf(ServerMetadata);
        expect(result.data.version.version).toEqual('19.1.0');
        expect(result.data.type).toEqual(ServerType.HORIZON);
      });
    });
  });
});
