declare const await, describe, beforeEach, it, xit, expect, jest, require;

import {log,catRoot,setLogLevel} from '../../../src/api/Log';
import {LogLevel} from 'typescript-logging';

import {ServerMetadata} from '../../../src/api/ServerMetadata';
import {ServerTypes} from '../../../src/api/ServerType';
import {OnmsNode} from '../../../src/model/OnmsNode';
import {NodeLabelSources} from '../../../src/model/OnmsNodeLabelSource';
import {NodeTypes} from '../../../src/model/OnmsNodeType';
import {NodeSerializer} from '../../../src/dao/serializers/NodeSerializer';
import {OnmsCategory} from '../../../src/model/OnmsCategory';

/** @hidden */
// tslint:disable-next-line
const moment = require('moment');

let metadata : ServerMetadata;
let serializer : NodeSerializer;

const checkForNull = () => {
  it('NodeSerializer.fromJson(null|undefined)', () => {
    expect(serializer.fromJson(null)).toBeNull();
    expect(serializer.fromJson(undefined)).toBeNull();
  });

  it('NodeSerializer.toJson(null|undefined)', () => {
    expect(serializer.toJson(null)).toBeNull();
    expect(serializer.toJson(undefined)).toBeNull();
  });

  it('NodeSerializer.toXml(null|undefined)', () => {
    expect(serializer.toXml(null)).toBeNull();
    expect(serializer.toXml(undefined)).toBeNull();
  });
};

describe('OpenNMS Foundation (14.0.3)', () => {

  beforeEach(() => {
    metadata = new ServerMetadata('14.0.3', ServerTypes.HORIZON);
    serializer = new NodeSerializer(metadata);
  });

  checkForNull();

  it('NodeSerializer.fromJson()', () => {
    const nodeJson = require('./data/14.0.3/node.json');
    const ret = serializer.fromJson(nodeJson);
    expect(ret.id).toEqual(1);
    expect(ret.assets.admin).toBeUndefined();
    expect(ret.assets.address1).toEqual('950 Windy Rd Suite 300');
    expect(ret.assets.id).toEqual(50);
    expect(Object.keys(ret.assets).length).toEqual(12);
    expect(ret.categories.length).toEqual(1);
    expect(ret.categories[0].id).toEqual(7);
    expect(ret.categories[0].name).toEqual('Monitor_SNMP');
    expect(ret.createTime).toBeDefined();
    expect(ret.createTime).toBeInstanceOf(moment);
    expect(ret.createTime.valueOf()).toEqual(moment('2018-06-11T15:33:58.593-05:00').valueOf());
    expect(ret.labelSource).toEqual(NodeLabelSources.USER);
  });


  it('NodeSerializer.toJson()', () => {
    const node = new OnmsNode();

    node.id = 1;
    node.createTime = moment('2018-06-11T15:33:58.593-05:00');
    node.foreignSource = 'test';
    node.foreignId = 'downward-spiral.local';
    node.type = NodeTypes.ACTIVE;
    node.label = 'Downward-Spiral.local';
    node.labelSource = NodeLabelSources.USER;
    node.categories.push(new OnmsCategory(7, 'Monitor_SNMP'));
    node.assets.address1 = '950 Windy Rd Suite 300';
    node.assets.building = 'test';
    node.assets.category = 'Unspecified';
    node.assets.city = 'Apex';
    node.assets.id = 50;
    node.assets.lastModifiedBy = '';
    node.assets.lastModifiedDate = node.createTime.clone();
    node.assets.latitude = 35.68642;
    node.assets.longitude = -78.727554;
    node.assets.snmpcommunity = 'public';
    node.assets.state = 'NC';
    node.assets.zip = '27502';

    const nodeJson = serializer.toJson(node);
    const existing = require('./data/14.0.3/node.json');

    for (const key of Object.keys(existing.assetRecord)) {
      if (existing.assetRecord[key] === null) {
        delete existing.assetRecord[key];
      }
    }

    expect(nodeJson).toMatchObject(existing);
    expect(existing).toMatchObject(nodeJson);
  });

});
