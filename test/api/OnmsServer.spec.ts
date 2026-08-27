declare const describe, beforeEach, it, expect;

import {OnmsAuthConfig} from '../../src/api/OnmsAuthConfig';
import {OnmsServer} from '../../src/api/OnmsServer';
import {ServerMetadata} from '../../src/api/ServerMetadata';
import {ServerTypes} from '../../src/api/ServerType';
import {TicketerConfig} from '../../src/api/TicketerConfig';

const SERVER_NAME = 'Demo';
const SERVER_URL = 'http://demo.opennms.org/opennms/';
const SERVER_USER = 'demo';
const SERVER_PASSWORD = 'demo';

let server, auth;

describe('api.OnmsServer', () => {
  beforeEach(() => {
    auth = new OnmsAuthConfig(SERVER_USER, SERVER_PASSWORD);
    server = OnmsServer.newBuilder(SERVER_URL).setName(SERVER_NAME).setAuth(auth).build();
  });

  describe('When I have a properly-configured server object...', () => {
    it('it should have an ID', () => {
      expect(server.id).toBeDefined();
      expect(server.id.length).toEqual(32);
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
    it('URL starting with "/" are returned as-is.', () => {
      expect(server.resolveURL('/rest/foo/')).toEqual('/rest/foo/');
    });
    it('Absolute with query appends query', () => {
      expect(server.resolveURL('/rest/foo', 'foo=bar')).toEqual('/rest/foo?foo%3Dbar');
    });
    it('multi segment urls are handled.', () => {
      expect(server.resolveURL('rest/foo/')).toEqual(SERVER_URL + 'rest/foo');
    });
    it('Colons are not escaped', () => {
      expect(server.resolveURL('rest/foo/A:B:0.0.0.0:C')).toEqual(SERVER_URL + 'rest/foo/A:B:0.0.0.0:C');
    });
    it('Escape forward slashes', () => {
      expect(server.resolveURL('rest/S%2FA%3AB%3A0.0.0.0%3AC')).toEqual(SERVER_URL + 'rest/S%2FA:B:0.0.0.0:C');
    });
    it('it should have a "host" property', () => {
      expect(server.host).toBeDefined();
      expect(server.host).toEqual('demo.opennms.org');
    });
  });

  describe('When I clone a server object...', () => {
    let metadata, ticketer, withMetadata;

    beforeEach(() => {
      ticketer = new TicketerConfig('jira', true);
      metadata = new ServerMetadata('33.0.0', ServerTypes.HORIZON, ticketer);
      withMetadata = OnmsServer.newBuilder(SERVER_URL)
        .setName(SERVER_NAME)
        .setAuth(auth)
        .setMetadata(metadata)
        .build();
    });

    it('it should return a distinct object that is equal to the original', () => {
      const clone = withMetadata.clone();
      expect(clone).not.toBe(withMetadata);
      expect(clone.id).toEqual(withMetadata.id);
      expect(withMetadata.equals(clone)).toBeTruthy();
      expect(clone.equals(withMetadata)).toBeTruthy();
    });

    it('it should copy the simple properties', () => {
      const clone = withMetadata.clone();
      expect(clone.name).toEqual(SERVER_NAME);
      expect(clone.url).toEqual(SERVER_URL);
    });

    it('it should deep-copy the auth config rather than share it', () => {
      const clone = withMetadata.clone();
      expect(clone.auth).not.toBe(withMetadata.auth);
      expect(clone.auth.equals(withMetadata.auth)).toBeTruthy();
      expect(clone.auth.username).toEqual(SERVER_USER);
      expect(clone.auth.password).toEqual(SERVER_PASSWORD);
    });

    it('it should deep-copy the metadata rather than share it', () => {
      const clone = withMetadata.clone();
      expect(clone.metadata).not.toBe(withMetadata.metadata);
      expect(clone.metadata.equals(withMetadata.metadata)).toBeTruthy();
      expect(clone.metadata.version).not.toBe(withMetadata.metadata.version);
      expect(clone.metadata.version.toString()).toEqual(withMetadata.metadata.version.toString());
      expect(clone.metadata.type).toEqual(ServerTypes.HORIZON);
    });

    it('it should deep-copy the ticketer config rather than share it', () => {
      const clone = withMetadata.clone();
      expect(clone.metadata.ticketerConfig).not.toBe(ticketer);
      expect(clone.metadata.ticketerConfig.equals(ticketer)).toBeTruthy();
      expect(clone.metadata.ticketerConfig.plugin).toEqual('jira');
      expect(clone.metadata.ticketerConfig.enabled).toEqual(true);
    });

    it('it should handle a server with no auth or metadata', () => {
      const bare = OnmsServer.newBuilder(SERVER_URL).setName(SERVER_NAME).build();
      const clone = bare.clone();
      expect(clone).not.toBe(bare);
      expect(clone.auth).toBeNull();
      expect(clone.metadata).toBeNull();
      expect(bare.equals(clone)).toBeTruthy();
    });
  });
});
