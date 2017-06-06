import {Moment} from 'moment';
import {Address4, Address6} from 'ip-address';
import {OnmsParm} from './OnmsParm';
import {OnmsServiceType} from './OnmsServiceType';
import {OnmsSeverity} from './OnmsSeverity';

/**
 * Represents an OpenNMS event.
 * @module OnmsEvent
 */ /** */
export class OnmsEvent {
  /** the event ID */
  public id: number;

  /** the UEI of this event */
  public uei: string;

  /** the node's ID associated with this event */
  public nodeId: number;

  /** the node's label associated with this event */
  public nodeLabel: string;

  /** the interface associated with this event */
  public ipAddress: Address4 | Address6;

  /** the severity of this event */
  public severity: OnmsSeverity;

  /** when the event was created */
  public createTime: Moment;

  /** when the event was received by OpenNMS */
  public time: Moment;

  /** which subsystem the event came from */
  public source: string;

  /** the description of is event */
  public description: string;

  /** the log message of the event */
  public logMessage: string;

  /** the service associated with the event */
  public service: OnmsServiceType;

  /** the parameters emitted with this alarm's event */
  public parameters: OnmsParm[];

  /** the service name associated with the event */
  public get serviceName() {
    if (this.service && this.service.name) {
      return this.service.name;
    }
    return undefined;
  }
}
