declare const describe, beforeEach, it, expect;

import {Client} from '../../src/Client';
import {OnmsAuthConfig} from '../../src/api/OnmsAuthConfig';
import {OnmsServer} from '../../src/model/OnmsServer';

const SERVER_NAME='Demo';
const SERVER_URL='http://demo.opennms.org/opennms/';
const SERVER_USER='demo';
const SERVER_PASSWORD='demo';

var server, auth;

describe('Given an instance of OnmsServer...', function () {
  beforeEach(function () {
    auth = new OnmsAuthConfig(SERVER_USER, SERVER_PASSWORD);
    server = new OnmsServer(SERVER_NAME, SERVER_URL, auth);
  });

  describe('When I have a server with just an ID...', function () {
    it('it should have an ID', () => {
      expect(server.id).toBeDefined();
      expect(new OnmsServer().id.length).toEqual(36);
    });
    it('it should have no URL', () => {
      expect(new OnmsServer().url).toBeUndefined();
    });
    it('it should return undefined when asking for a relative URL without a URL set', () => {
      expect(new OnmsServer().resolveURL()).toBeUndefined();
    });
    it('it should not have a "host" property', () => {
      expect(new OnmsServer().host).toBeUndefined();
    });
  });

  describe('When I have a properly-configured server object...', function () {
    it('it should have an ID', () => {
      expect(server.id).toBeDefined();
      expect(server.id.length).toEqual(36);
    });
    it('it should have a URL', () => {
      expect(server.url).toBeDefined();
      expect(server.url).toEqual(SERVER_URL);
    });
    it('it should return the base URL when undefined is passed to resolveURL()', () => {
      expect(server.resolveURL()).toBeDefined();
      expect(server.resolveURL()).toEqual(SERVER_URL);
    });
    it('it should return a new URL when a value is passed to resolveURL()', () => {
      expect(server.resolveURL('foo')).toBeDefined();
      expect(server.resolveURL('foo')).toEqual(SERVER_URL + 'foo');
      expect(server.resolveURL('foo/')).toEqual(SERVER_URL + 'foo');
    });
    it('it should have a "host" property', () => {
      expect(server.host).toBeDefined();
      expect(server.host).toEqual('demo.opennms.org');
    });
  });
});
