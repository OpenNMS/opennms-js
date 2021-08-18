import {Address4, Address6} from 'ip-address';
import {Moment} from 'moment';

import {IHasUrlValue} from '../api/IHasUrlValue';
import { Util } from '../internal/Util';

import {OnmsManagedType} from './OnmsManagedType';
import {OnmsMonitoredService} from './OnmsMonitoredService';
import {OnmsPrimaryType} from './OnmsPrimaryType';
import {OnmsSnmpInterface} from './OnmsSnmpInterface';

/**
 * Represents an OpenNMS IP interface.
 * @category Model
 */
export class OnmsIpInterface implements IHasUrlValue {
  /** store the interface's associated SNMP interface, used by get/set `.snmpInterface` */
  private _snmpInterface?: OnmsSnmpInterface;

  /** the interface ID */
  public id?: number;

  /** the IP address */
  public ipAddress?: Address4 | Address6;

  /** the hostname */
  public hostname?: string;

  /** whether the interface is down */
  public isDown?: boolean;

  /** whether the interface is managed */
  public isManaged?: OnmsManagedType;

  /** the last time the interface was provisioned */
  public lastCapsdPoll?: Moment;

  /** the last time ingress flows were received */
  public lastIngressFlow?: Moment;

  /** the last time egress flows were received */
  public lastEgressFlow?: Moment;

  /** the number of monitored services this interface has */
  public monitoredServiceCount?: number;

  /** the SNMP primary status of the interface */
  public snmpPrimary?: OnmsPrimaryType;

  /** the SNMP interface ID associated with this interface */
  public snmpInterfaceId?: number;

  /** the SNMP interface, if it appears on the node */
  public get snmpInterface(): OnmsSnmpInterface | undefined {
    if (this._snmpInterface) {
      return this._snmpInterface;
    } else if (this.node) {
      for (const iface of this.node.snmpInterfaces) {
        if (iface.id === this.snmpInterfaceId) {
          return iface;
        }
      }
    }
    return undefined;
  }

  public set snmpInterface(iface: OnmsSnmpInterface | undefined) {
    this._snmpInterface = iface;
  }

  /** the node this interface is associated with */
  public node?: any;

  /** the services on this interface */
  public services = [] as OnmsMonitoredService[];

  /** @inheritdoc */
  public get urlValue() {
    return String(this.id);
  }

  /**
   * create an IP interface object from a JSON object
   * @hidden
   */
   public static fromData(data: any) {
    const iface = new OnmsIpInterface();

    iface.id = Util.toNumber(data.id);

    iface.hostname = data.hostName || data.hostname;
    iface.ipAddress = Util.toIPAddress(data.ipAddress);
    iface.isDown = !!data.isDown;
    iface.isManaged = OnmsManagedType.forId(data.isManaged);
    iface.lastCapsdPoll = Util.toDate(data.lastCapsdPoll);
    iface.lastIngressFlow = Util.toDate(data.lastIngressFlow);
    iface.lastEgressFlow = Util.toDate(data.lastEgressFlow);
    iface.monitoredServiceCount = Util.toNumber(data.monitoredServiceCount);
    iface.snmpPrimary = OnmsPrimaryType.forId(data.snmpPrimary);

    if (data.nodeId !== undefined) {
      iface.node = {};
      iface.node.id = Util.toNumber(data.nodeId);
    }


    if (data.snmpInterface && data.snmpInterface.id) {
      iface.snmpInterfaceId = Util.toNumber(data.snmpInterface.id);
      iface.snmpInterface = OnmsSnmpInterface.fromData(data.snmpInterface);
    }

    return iface;
  }
}
