import {AbstractSerializer} from './AbstractSerializer';

import {IpInterfaceSerializer} from './IpInterfaceSerializer';
import {SnmpInterfaceSerializer} from './SnmpInterfaceSerializer';

import {OnmsCategory} from '../../model/OnmsCategory';
import {OnmsNode} from '../../model/OnmsNode';
import {OnmsNodeLabelSource} from '../../model/OnmsNodeLabelSource';
import {OnmsNodeType} from '../../model/OnmsNodeType';

import {Util} from '../../internal/Util';

export class NodeSerializer extends AbstractSerializer<OnmsNode> {
  public fromJson(json): OnmsNode {
    if (!json) {
      return null;
    }
    const node = new OnmsNode();

    node.id = Util.toNumber(json.id);
    node.label = json.label;
    node.location = json.location;
    node.foreignSource = json.foreignSource || undefined;
    node.foreignId = json.foreignId || undefined;
    node.sysContact = json.sysContact;
    node.sysDescription = json.sysDescription;
    node.sysLocation = json.sysLocation;
    node.sysName = json.sysName;
    node.sysObjectId = json.sysObjectId;

    if (json.labelSource) {
      node.labelSource = OnmsNodeLabelSource.forId(json.labelSource);
    }
    if (json.createTime) {
      node.createTime = Util.toMoment(json.createTime);
    }
    if (json.lastCapsdPoll) {
      node.lastCapsdPoll = Util.toMoment(json.lastCapsdPoll);
    }
    if (json.type) {
      node.type = OnmsNodeType.forId(json.type);
    }

    node.categories = [];
    if (json.categories) {
      node.categories = json.categories.map((c) => {
        return OnmsCategory.for(c.id, c.name);
      });
    }

    for (const key in json.assetRecord) {
      if (json.assetRecord.hasOwnProperty(key)
        && json.assetRecord[key] !== null
        && json.assetRecord[key] !== undefined) {
        node.assets[key] = json.assetRecord[key];
      }
    }

    return node;
  }

  public toJson(model: OnmsNode): object {
    if (!model) {
      return null;
    }
    const ret = {} as any;

    ret.id = String(model.id);
    ret.foreignSource = model.foreignSource;
    ret.foreignId = model.foreignId;
    ret.label = model.label;
    ret.labelSource = model.labelSource.id;
    ret.type = model.type.id;
    if (model.createTime) { ret.createTime = model.createTime.valueOf(); }

    ret.assetRecord = Object.assign({}, model.assets);
    if (ret.assetRecord.lastModifiedDate) {
      ret.assetRecord.lastModifiedDate = ret.assetRecord.lastModifiedDate.valueOf();
    }

    if (model.categories && model.categories.length > 0) {
      ret.categories = model.categories.map((cat) => Object.assign({}, cat));
    }

    if (model.ipInterfaces && model.ipInterfaces.length > 0) {
      const ipSerializer = new IpInterfaceSerializer(this.metadata);
      ret.ipInterfaces = model.ipInterfaces.map((iface) => ipSerializer.toJson(iface));
    }

    if (model.snmpInterfaces && model.snmpInterfaces.length > 0) {
      const snmpSerializer = new SnmpInterfaceSerializer(this.metadata);
      ret.snmpInterfaces = model.snmpInterfaces.map((iface) => snmpSerializer.toJson(iface));
    }

    return ret;
  }

  public toXml(model): string {
    if (!model) {
      return null;
    }
    return '';
  }

}
