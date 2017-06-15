declare const await, describe, beforeEach, it, xit, expect, jest, require;

import {log,catRoot,setLogLevel} from '../../src/api/Log';
import {LogLevel} from 'typescript-logging';

setLogLevel(LogLevel.Debug, catRoot);

import {Client} from '../../src/Client';

import {Comparators} from '../../src/api/Comparator';
import {Filter} from '../../src/api/Filter';
import {Restriction} from '../../src/api/Restriction';

import {OnmsAuthConfig} from '../../src/api/OnmsAuthConfig';
import {OnmsServer} from '../../src/api/OnmsServer';

import {OnmsCategory} from '../../src/model/OnmsCategory';
import {OnmsNodeType} from '../../src/model/OnmsNodeType';

import {NodeDAO} from '../../src/dao/NodeDAO';

import {MockHTTP} from '../rest/MockHTTP';

/** @hidden */
// tslint:disable-next-line
const moment = require('moment');

const SERVER_NAME='Demo';
const SERVER_URL='http://demo.opennms.org/opennms/';
const SERVER_USER='demo';
const SERVER_PASSWORD='demo';

let opennms : Client, server, auth, mockHTTP, dao : NodeDAO;

describe('NodeDAO', () => {
  beforeEach(() => {
    auth = new OnmsAuthConfig(SERVER_USER, SERVER_PASSWORD);
    server = new OnmsServer(SERVER_NAME, SERVER_URL, auth);
    mockHTTP = new MockHTTP(server);
    opennms = new Client(mockHTTP);
    dao = new NodeDAO(mockHTTP);
  });
  it('NodeDAO.get(43)', () => {
    return dao.get(43).then((node) => {
      expect(node.id).toEqual(43);
      expect(node.categories.length).toEqual(2);
      expect(node.categories[0]).toBeInstanceOf(OnmsCategory);
      expect(node.foreignSource).toBeUndefined();
      expect(node.createTime).toBeInstanceOf(moment);
      expect(node.type).toBeDefined();
      expect(node.type).toBeInstanceOf(OnmsNodeType);
    });
  });
  it('NodeDAO.find(id=43)', () => {
    const filter = new Filter();
    filter.restrictions.push(new Restriction('id', Comparators.EQ, 43));
    return dao.find(filter).then((nodes) => {
      expect(nodes.length).toEqual(1);
    });
  });
});
