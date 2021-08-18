import {Moment} from 'moment';

import {IHasUrlValue} from '../api/IHasUrlValue';

import { Util } from '../internal/Util';

import {OnmsCategory} from './OnmsCategory';
import {OnmsNodeLabelSource} from './OnmsNodeLabelSource';
import {OnmsNodeType} from './OnmsNodeType';
import {OnmsIpInterface} from './OnmsIpInterface';
import {OnmsSnmpInterface} from './OnmsSnmpInterface';

/**
 * Represents an OpenNMS node.
 * @category Model
 */
export class OnmsNode implements IHasUrlValue {
  /** the node ID */
  public id?: number;

  /** the label (name) of the node */
  public label?: string;

  /** how the label was set */
  public labelSource?: OnmsNodeLabelSource;

  /** the foreign source of the node */
  public foreignSource?: string;

  /** the foreign ID of the node */
  public foreignId?: string;

  /** the location of the node */
  public location?: string;

  /** the time the node was created */
  public createTime?: Moment;

  /** the parent of this node */
  public parent?: OnmsNode;

  /** the type of node */
  public type?: OnmsNodeType;

  /** the SNMP sysObjectId of the node */
  public sysObjectId?: string;

  /** the SNMP sysName of the node */
  public sysName?: string;

  /** the SNMP sysDescription of the node */
  public sysDescription?: string;

  /** the SNMP sysLocation of the node */
  public sysLocation?: string;

  /** the SNMP sysContact for the node */
  public sysContact?: string;

  /** the NETBIOS/SMB name for the node */
  public netBiosName?: string;

  /** the NETBIOS/SMB domain for the node */
  public netBiosDomain?: string;

  /** the operating system of the node */
  public operatingSystem?: string;

  /** the last time this node was provisioned */
  public lastCapsdPoll?: Moment;

  /** the LLDP element associated with this node */
  // public lldpElement: LldpElement;

  /** the OSPF element associated with this node */
  // public ospfElement: OspfElement;

  /** the IsIs element associated with this node */
  // public isisElement: IsIsElement;

  /** the CDP element associated with this node */
  // public cdpElement: CdpElement;

  /** the path element associated with this node */
  // public pathElement: PathElement;

  /** the SNMP interfaces on this node */
  public snmpInterfaces = [] as OnmsSnmpInterface[];

  /** the IP interfaces on this node */
  public ipInterfaces = [] as OnmsIpInterface[];

  /** the categories the node is in */
  public categories = [] as OnmsCategory[];

  /** the assets of the node */
  public assets = {} as any;

  /** @inheritdoc */
  public get urlValue() {
    return String(this.id);
  }

  /**
   * Create a node object from a JSON object.
   * @hidden
   */
   public static fromData(data: any) {
    const node = new OnmsNode();

    if (!data) {
      return undefined;
    }

    node.id = Util.toNumber(data.id);
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
      node.createTime = Util.toDate(data.createTime);
    }
    if (data.lastCapsdPoll) {
      node.lastCapsdPoll = Util.toDate(data.lastCapsdPoll);
    }
    if (data.type) {
      node.type = OnmsNodeType.forId(data.type);
    }

    node.categories = [];
    if (data.categories) {
      node.categories = data.categories.map((c: any) => {
        return OnmsCategory.for(c.id, c.name);
      });
    }

    for (const key in data.assetRecord) {
      if (data.assetRecord.hasOwnProperty(key)
        && data.assetRecord[key] !== null
        && data.assetRecord[key] !== undefined) {
        node.assets[key] = data.assetRecord[key];
      }
    }

    return node;
  }
}
