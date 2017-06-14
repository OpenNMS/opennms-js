declare const await, describe, beforeEach, it, expect, jest;

import {log,catRoot,setLogLevel} from '../src/api/Log';
import {LogLevel} from 'typescript-logging';

setLogLevel(LogLevel.Debug, catRoot);

import {Client} from '../src/Client';
import {OnmsAuthConfig} from '../src/api/OnmsAuthConfig';
import {OnmsResult} from '../src/api/OnmsResult';
import {OnmsServer} from '../src/api/OnmsServer';
import {ServerMetadata} from '../src/api/ServerMetadata';

import {MockHTTP} from './rest/MockHTTP';

import {ServerType, ServerTypes} from '../src/api/ServerType';

const SERVER_NAME='Demo';
const SERVER_URL='http://demo.opennms.org/opennms/';
const SERVER_USER='demo';
const SERVER_PASSWORD='demo';

let opennms : Client, server, auth, mockHTTP;

describe('Given an instance of OpenNMS...', () => {
  beforeEach(() => {
    mockHTTP = new MockHTTP();
    opennms = new Client(mockHTTP);
    auth = new OnmsAuthConfig(SERVER_USER, SERVER_PASSWORD);
    server = new OnmsServer(SERVER_NAME, SERVER_URL, auth);
  });
  describe('when I have a default OpenNMS object', () => {
    it('it should have no server', () => {
      expect((<any>opennms).server).toBeUndefined();
    });
    it('it should pass when checkServer is called on a valid server', () => {
      let ret = Client.checkServer(server, mockHTTP);
      expect(ret).toBeDefined();
      return ret.then((result) => {
        expect(result).toBeDefined();
        expect(result).toEqual(true);
      });
    });
    it('it should return a metadata object when getMetadata is called on a valid server', () => {
      let ret = Client.getMetadata(server, mockHTTP);
      expect(ret).toBeDefined();
      return ret.then((result) => {
        expect(result).toBeDefined();
        expect(result).toBeInstanceOf(OnmsResult);
        expect(result.data).toBeInstanceOf(ServerMetadata);
        expect(result.data.version.version).toEqual('19.1.0');
        expect(result.data.type).toEqual(ServerTypes.HORIZON);
      });
    });
    it('it should return a server object with metadata when connect is called', () => {
      const ret = opennms.connect(SERVER_NAME, SERVER_URL, SERVER_USER, SERVER_PASSWORD);
      expect(ret).toBeDefined();
      return ret.then((result) => {
        expect(result).toBeDefined();
        expect(result).toBeInstanceOf(OnmsServer);
        expect(result.metadata).toBeInstanceOf(ServerMetadata);
      });
    });
  });
});
