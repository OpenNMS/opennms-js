declare const describe, beforeEach, it, expect;

import {OpenNMS} from '../src/OpenNMS';
import {OnmsServer} from '../src/model/OnmsServer';

const SERVER_NAME='Demo';
const SERVER_URL='http://demo.opennms.org/opennms/';
const SERVER_USER='demo';
const SERVER_PASSWORD='demo';

let opennms, server;

describe('Given an instance of OpenNMS...', function () {
  beforeEach(function () {
    opennms = new OpenNMS();
    server = new OnmsServer(SERVER_NAME, SERVER_URL, SERVER_USER, SERVER_PASSWORD);
  });
  describe('when I have a default OpenNMS object', function () {
    it('it should have no server', () => {
      expect(opennms.server).toBeUndefined();
    });
    it('it should return a server object if I call newServer', () => {
      let ret = OpenNMS.newServer(SERVER_NAME, SERVER_URL, SERVER_USER, SERVER_PASSWORD);
      expect(ret).toBeDefined();
      expect(ret.url).toEqual(SERVER_URL);
    });
  });
});
