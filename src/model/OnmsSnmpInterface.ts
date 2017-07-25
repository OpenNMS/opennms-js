import {Moment} from 'moment';

import {OnmsCollectType} from './OnmsCollectType';
import {OnmsSnmpStatusType} from './OnmsSnmpStatusType';
import {PhysAddr} from './PhysAddr';

/**
 * Represents an OpenNMS SNMP interface.
 * @module OnmsSnmpInterface
 */
export class OnmsSnmpInterface {
  /** the interface ID */
  public id: number;

  /** the physical (MAC) address of the interface */
  public physAddr: PhysAddr;

  /** the node associated with this interface */
  public node: any;

  /** the SNMP interface index */
  public ifIndex: number;

  /** the description of the interface */
  public ifDescr: string;

  /** the type of interface */
  public ifType: number;

  /** the name of the interface */
  public ifName: string;

  /** the speed of the interface */
  public ifSpeed: number;

  /** the administrative status of the interface */
  public ifAdminStatus: OnmsSnmpStatusType;

  /** the operator status of the interface */
  public ifOperStatus: OnmsSnmpStatusType;

  /** the alias of the interface */
  public ifAlias: string;

  /** the last time the SNMP interface was provisioned */
  public lastCapsdPoll: Moment;

  /** whether the SNMP interface will be collected */
  public collect: OnmsCollectType;

  /** whether the interface is set to poll */
  public poll: boolean;

  /** the last time the SNMP interface was polled */
  public lastSnmpPoll: Moment;
}
