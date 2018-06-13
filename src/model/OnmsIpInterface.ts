import {Address4, Address6} from 'ip-address';
import {Moment} from 'moment';

import {IHasUrlValue} from '../api/IHasUrlValue';

import {OnmsManagedType} from './OnmsManagedType';
import {OnmsMonitoredService} from './OnmsMonitoredService';
import {OnmsPrimaryType} from './OnmsPrimaryType';

/**
 * Represents an OpenNMS IP interface.
 * @module OnmsIpInterface
 */
export class OnmsIpInterface implements IHasUrlValue {
  /** the interface ID */
  public id: number;

  /** the IP address */
  public ipAddress: Address4 | Address6;

  /** the hostname */
  public hostname: string;

  /** whether the interface is managed */
  public isManaged: OnmsManagedType;

  /** the last time the interface was provisioned */
  public lastCapsdPoll: Moment;

  /** the SNMP primary status of the interface */
  public snmpPrimary: OnmsPrimaryType;

  /** the SNMP interface ID associated with this interface */
  public snmpInterfaceId: number;

  /** the SNMP interface associated with this interface, if available */
  public get snmpInterface() {
    if (this.node) {
      for (const iface of this.node.snmpInterfaces) {
        if (iface.id === this.snmpInterfaceId) {
          return iface;
        }
      }
    }
    return undefined;
  }

  /** the node this interface is associated with */
  public node: any;

  /** the services on this interface */
  public services = [] as OnmsMonitoredService[];

  /** The stringified value of this IP interface as an OpenNMS URL parameter. */
  public get urlValue() {
    return String(this.id);
  }
}
