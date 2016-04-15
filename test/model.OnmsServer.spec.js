import chai from 'chai';
// import OnmsServer from '../dist/opennms.js';
import OnmsServer from '../src/model/OnmsServer.js';

chai.expect();

const expect = chai.expect;

var server, demo = 'http://demo.opennms.org/opennms/';

describe('Given an instance of OnmsServer...', function () {
  before(function () {
    server = new OnmsServer('Demo', demo, 'demo', 'demo');
  });

  describe('when I have a server with just an ID', function () {
    it('it should have an ID', () => {
      expect(server.id).to.be.defined;
      expect(new OnmsServer().id.length).to.be.equal(36);
    });
    it('it should have no URL', () => {
      expect(new OnmsServer().url).to.be.undefined;
    });
    it('it should return undefined when asking for a relative URL without a URL set', () => {
      expect(new OnmsServer().relativeUrl()).to.be.undefined;
    });
    it('it should not have a "host" property', () => {
      expect(new OnmsServer().host).to.be.undefined;
    });
  });

  describe('when I have a properly-configured server object', function () {
    it('it should have an ID', () => {
      expect(server.id).to.be.defined;
      expect(server.id.length).to.be.equal(36);
    });
    it('it should have a URL', () => {
      expect(server.url).to.be.defined;
      expect(server.url).to.be.equal(demo);
    });
    it('it should return the base URL when undefined is passed to relativeUrl()', () => {
      expect(server.relativeUrl()).to.be.defined;
      expect(server.relativeUrl()).to.be.equal(demo);
    });
    it('it should return a new URL when a value is passed to relativeUrl()', () => {
      expect(server.relativeUrl('foo')).to.be.defined;
      expect(server.relativeUrl('foo')).to.be.equal(demo + 'foo');
      expect(server.relativeUrl('foo/')).to.be.equal(demo + 'foo');
    });
    it('it should have a "host" property', () => {
      expect(server.host).to.be.defined;
      expect(server.host).to.be.equal('demo.opennms.org');
    });
  });
});
