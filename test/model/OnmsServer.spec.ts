import {OpenNMS} from '../../src/OpenNMS';
import {OnmsServer} from '../../src/model/OnmsServer';

const SERVER_NAME='Demo';
const SERVER_URL='http://demo.opennms.org/opennms/';
const SERVER_USER='demo';
const SERVER_PASSWORD='demo';

var server;

describe('Given an instance of OnmsServer...', function () {
  beforeEach(function () {
    server = new OnmsServer(SERVER_NAME, SERVER_URL, SERVER_USER, SERVER_PASSWORD);
  });

  describe('when I have a server with just an ID', function () {
    it('it should have an ID', () => {
      expect(server.id).toBeDefined();
      expect(new OnmsServer().id.length).toEqual(36);
    });
    it('it should have no URL', () => {
      expect(new OnmsServer().url).toBeUndefined();
    });
    it('it should return undefined when asking for a relative URL without a URL set', () => {
      expect(new OnmsServer().relativeUrl()).toBeUndefined();
    });
    it('it should not have a "host" property', () => {
      expect(new OnmsServer().host).toBeUndefined();
    });
  });

  describe('when I have a properly-configured server object', function () {
    it('it should have an ID', () => {
      expect(server.id).toBeDefined();
      expect(server.id.length).toEqual(36);
    });
    it('it should have a URL', () => {
      expect(server.url).toBeDefined();
      expect(server.url).toEqual(SERVER_URL);
    });
    it('it should return the base URL when undefined is passed to relativeUrl()', () => {
      expect(server.relativeUrl()).toBeDefined();
      expect(server.relativeUrl()).toEqual(SERVER_URL);
    });
    it('it should return a new URL when a value is passed to relativeUrl()', () => {
      expect(server.relativeUrl('foo')).toBeDefined();
      expect(server.relativeUrl('foo')).toEqual(SERVER_URL + 'foo');
      expect(server.relativeUrl('foo/')).toEqual(SERVER_URL + 'foo');
    });
    it('it should have a "host" property', () => {
      expect(server.host).toBeDefined();
      expect(server.host).toEqual('demo.opennms.org');
    });
  });
});
