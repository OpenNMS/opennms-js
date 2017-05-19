/// <reference path="../typings/index.d.ts" />

import 'mocha';
import * as chai from 'chai';
import {OpenNMS} from '../src/OpenNMS';
import {OnmsServer} from '../src/model/OnmsServer';

const expect = chai.expect;

const SERVER_NAME='Demo';
const SERVER_URL='http://demo.opennms.org/opennms/';
const SERVER_USER='demo';
const SERVER_PASSWORD='demo';

let opennms, server;

describe('Given an instance of OpenNMS...', function () {
  before(function () {
    opennms = new OpenNMS();
    server = new OnmsServer(SERVER_NAME, SERVER_URL, SERVER_USER, SERVER_PASSWORD);
  });
  describe('when I have a default OpenNMS object', function () {
    it('it should have no server', () => {
      expect(opennms.server).to.be.undefined;
    });
    it('it should return a server if I call connect', () => {
      let ret = opennms.connect(server);
      expect(ret).not.to.be.undefined;
      expect(ret).to.be.equal(server);
    });
    it('it should have a server property if I call connect', () => {
      opennms.connect(server);
      expect(opennms.server).to.be.equal(server);
    });
  });
});
