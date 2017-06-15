import {Address4, Address6} from 'ip-address';
import {Moment} from 'moment';

import {OnmsManagedType} from './OnmsManagedType';
import {OnmsMonitoredService} from './OnmsMonitoredService';
import {OnmsNode} from './OnmsNode';
import {OnmsPrimaryType} from './OnmsPrimaryType';

/**
 * Represents an OpenNMS IP interface.
 * @module OnmsIpInterface
 */ /** */
export class OnmsIpInterface {
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

  /** the node this interface is associated with */
  public node: OnmsNode;

  /** the services on this interface */
  public services = [] as OnmsMonitoredService[];
}
