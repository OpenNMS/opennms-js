import chai from 'chai';
import OpenNMS from '../src/OpenNMS';
import OnmsServer from '../src/model/OnmsServer';

chai.expect();

const expect = chai.expect;

var opennms, server,
  name='Demo',
  url='http://demo.opennms.org/opennms/',
  user='demo',
  password='demo';

describe('Given an instance of OpenNMS...', function () {
  before(function () {
    opennms = new OpenNMS();
    server = new OnmsServer(name, url, user, password);
  });
  describe('when I have a default OpenNMS object', function () {
    it('it should have no server', () => {
      expect(opennms.server).to.be.undefined;
    });
    it('it should return a server if I call connect', () => {
      let ret = opennms.connect(server);
      expect(ret).to.be.defined;
      expect(ret).to.be.equal(server);
    });
    it('it should have a server property if I call connect', () => {
      opennms.connect(server);
      expect(opennms.server).to.be.equal(server);
    });
  });
});
