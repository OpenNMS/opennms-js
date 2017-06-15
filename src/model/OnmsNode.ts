import {Moment} from 'moment';

import {OnmsCategory} from './OnmsCategory';
import {OnmsNodeLabelSource} from './OnmsNodeLabelSource';
import {OnmsNodeType} from './OnmsNodeType';
import {OnmsIpInterface} from './OnmsIpInterface';

/**
 * Represents an OpenNMS node.
 * @module OnmsNode
 */ /** */
export class OnmsNode {
  /** the node ID */
  public id: number;

  /** the label (name) of the node */
  public label: string;

  /** how the label was set */
  public labelSource: OnmsNodeLabelSource;

  /** the foreign source of the node */
  public foreignSource: string;

  /** the foreign ID of the node */
  public foreignId: string;

  /** the location of the node */
  public location: string;

  /** the time the node was created */
  public createTime: Moment;

  /** the parent of this node */
  public parent: OnmsNode;

  /** the type of node */
  public type: OnmsNodeType;

  /** the SNMP sysObjectId of the node */
  public sysObjectId: string;

  /** the SNMP sysName of the node */
  public sysName: string;

  /** the SNMP sysDescription of the node */
  public sysDescription: string;

  /** the SNMP sysLocation of the node */
  public sysLocation: string;

  /** the SNMP sysContact for the node */
  public sysContact: string;

  /** the NETBIOS/SMB name for the node */
  public netBiosName: string;

  /** the NETBIOS/SMB domain for the node */
  public netBiosDomain: string;

  /** the operating system of the node */
  public operatingSystem: string;

  /** the last time this node was provisioned */
  public lastCapsdPoll: Moment;

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

  /** the IP interfaces on this node */
  public ipInterfaces = [] as OnmsIpInterface[];

  /** the categories the node is in */
  public categories = [] as OnmsCategory[];

  /** the assets of the node */
  public assets = {} as any;

}
