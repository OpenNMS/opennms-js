declare const describe, beforeEach, it, expect;

import {Client} from '../src/Client';
import {OnmsAuthConfig} from '../src/api/OnmsAuthConfig';
import {OnmsServer} from '../src/model/OnmsServer';

const SERVER_NAME='Demo';
const SERVER_URL='http://demo.opennms.org/opennms/';
const SERVER_USER='demo';
const SERVER_PASSWORD='demo';

let opennms, server, auth;

describe('Given an instance of OpenNMS...', function () {
  beforeEach(function () {
    opennms = new Client();
    auth = new OnmsAuthConfig(SERVER_USER, SERVER_PASSWORD);
    server = new OnmsServer(SERVER_URL, SERVER_NAME, auth);
  });
  describe('when I have a default OpenNMS object', function () {
    it('it should have no server', () => {
      expect(opennms.server).toBeUndefined();
    });
    it('it should return a server object if I call getServer', () => {
      let ret = Client.getServer(SERVER_URL, SERVER_NAME, SERVER_USER, SERVER_PASSWORD);
      expect(ret).toBeDefined();
      expect(ret.url).toEqual(SERVER_URL);
    });
  });
});
