import {Moment} from 'moment';

import {IHasUrlValue} from '../api/IHasUrlValue';
import { Util } from '../internal/Util';

import {OnmsCollectType} from './OnmsCollectType';
import {OnmsSnmpStatusType} from './OnmsSnmpStatusType';
import {PhysAddr} from './PhysAddr';

/**
 * Represents an OpenNMS SNMP interface.
 * @category Model
 */
export class OnmsSnmpInterface implements IHasUrlValue {
  /** the interface ID */
  public id?: number;

  /** the physical (MAC) address of the interface */
  public physAddr?: PhysAddr;

  /** the node associated with this interface */
  public node?: any;

  /** the SNMP interface index */
  public ifIndex?: number;

  /** the description of the interface */
  public ifDescr?: string;

  /** the type of interface */
  public ifType?: number;

  /** the name of the interface */
  public ifName?: string;

  /** the speed of the interface */
  public ifSpeed?: number;

  /** the administrative status of the interface */
  public ifAdminStatus?: OnmsSnmpStatusType;

  /** the operator status of the interface */
  public ifOperStatus?: OnmsSnmpStatusType;

  /** the alias of the interface */
  public ifAlias?: string;

  /** the last time the SNMP interface was provisioned */
  public lastCapsdPoll?: Moment;

  /** whether the SNMP interface will be collected */
  public collect?: OnmsCollectType;

  /** whether the interface is set to poll */
  public poll?: boolean;

  /** the last time the SNMP interface was polled */
  public lastSnmpPoll?: Moment;

  /** The node associated to this snmpInterface */
  public nodeId?: number;

  /** @inheritdoc */
  public get urlValue() {
    return String(this.id);
  }

  /**
   * create an SNMP interface object from a JSON object
   * @hidden
   */
   public static fromData(data: any): OnmsSnmpInterface {
    const iface = new OnmsSnmpInterface();

    iface.id = Util.toNumber(data.id);
    iface.ifIndex = Util.toNumber(data.ifIndex);
    iface.ifDescr = data.ifDescr;
    iface.ifType = Util.toNumber(data.ifType);
    iface.ifName = data.ifName;
    iface.ifSpeed = Util.toNumber(data.ifSpeed);
    iface.ifAdminStatus = OnmsSnmpStatusType.forId(Util.toNumber(data.ifAdminStatus));
    iface.ifOperStatus = OnmsSnmpStatusType.forId(Util.toNumber(data.ifOperStatus));
    iface.ifAlias = data.ifAlias;
    iface.lastCapsdPoll = Util.toDate(data.lastCapsdPoll);
    iface.collect = OnmsCollectType.forId(data.collectFlag);
    iface.poll = data.poll;
    iface.lastSnmpPoll = Util.toDate(data.lastSnmpPoll);
    iface.nodeId = Util.toNumber(data.nodeId);

    if (data.physAddr) {
      iface.physAddr = new PhysAddr(data.physAddr);
    }

    return iface;
  }

  /** convert to JSON object */
  public toJSON() {
    return {
      id: this.id,
      ifIndex: this.ifIndex,
      ifDescr: this.ifDescr,
      ifType: this.ifType,
      ifName: this.ifName,
      ifSpeed: this.ifSpeed,
      ifAdminStatus: this.ifAdminStatus?.toJSON(),
      ifOperStatus: this.ifOperStatus?.toJSON(),
      ifAlias: this.ifAlias,
      lastCapsdPoll: this.lastCapsdPoll?.valueOf(),
      collect: this.collect?.toJSON(),
      poll: this.poll,
      lastSnmpPoll: this.lastSnmpPoll?.toJSON(),
      physAddr: this.physAddr?.urlValue,
      nodeId: this.nodeId
    }
  }
}
