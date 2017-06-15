import {AbstractDAO} from './AbstractDAO';

import {Filter} from '../api/Filter';
import {IOnmsHTTP} from '../api/IOnmsHTTP';
import {OnmsError} from '../api/OnmsError';
import {OnmsHTTPOptions} from '../api/OnmsHTTPOptions';

import {OnmsCategory} from '../model/OnmsCategory';
import {OnmsNode} from '../model/OnmsNode';
import {OnmsNodeLabelSource} from '../model/OnmsNodeLabelSource';
import {OnmsNodeType} from '../model/OnmsNodeType';

import {log, catDao} from '../api/Log';
import {Category} from 'typescript-logging';

/** @hidden */
// tslint:disable-next-line
const moment = require('moment');

/** @hidden */
const cat = new Category('nodes', catDao);

/**
 * Data access for {@link OnmsNode} objects
 * @module NodeDAO
 */ /** */
export class NodeDAO extends AbstractDAO<number, OnmsNode> {
  /** create a node object from a JSON object */
  public fromData(data: any): OnmsNode {
    const node = new OnmsNode();

    node.id = parseInt(data.id, 10);
    node.label = data.label;
    node.location = data.location;
    node.foreignSource = data.foreignSource || undefined;
    node.foreignId = data.foreignId || undefined;
    node.sysContact = data.sysContact;
    node.sysDescription = data.sysDescription;
    node.sysLocation = data.sysLocation;
    node.sysName = data.sysName;
    node.sysObjectId = data.sysObjectId;

    if (data.labelSource) {
      node.labelSource = OnmsNodeLabelSource.forId(data.labelSource);
    }
    if (data.createTime) {
      node.createTime = moment(data.createTime);
    }
    if (data.lastCapsdPoll) {
      node.lastCapsdPoll = moment(data.lastCapsdPoll);
    }
    if (data.type) {
      node.type = OnmsNodeType.forId(data.type);
    }

    node.categories = data.categories.map((c) => {
      return OnmsCategory.for(c.id, c.name);
    });

    for (const key in data.assetRecord) {
      if (data.assetRecord.hasOwnProperty(key)
        && data.assetRecord[key] !== null
        && data.assetRecord[key] !== undefined) {
        node.assets[key] = data.assetRecord[key];
      }
    }

    return node;
  }

  /** get an node, given the node's ID */
  public get(id: number): Promise<OnmsNode> {
    const opts = this.getOptions();
    return this.http.get('rest/nodes/' + id, opts).then((result) => {
      return this.fromData(result.data);
    });
  }

  /** get an node, given a filter */
  public find(filter?: Filter): Promise<OnmsNode[]> {
    const opts = this.getOptions(filter);
    return this.http.get('rest/nodes', opts).then((result) => {
      let data = result.data;

      if (this.getCount(data) > 0 && data.node) {
        data = data.node;
      } else {
        data = [];
      }

      if (!Array.isArray(data)) {
        throw new OnmsError('Expected an array of nodes but got "' + (typeof data) + '" instead.');
      }
      return data.map((nodeData) => {
        return this.fromData(nodeData);
      });
    });
  }

}
