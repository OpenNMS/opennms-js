import {Moment} from 'moment';

import {OnmsAlarmType, ALARM_TYPES} from './OnmsAlarmType';
import {OnmsEvent} from './OnmsEvent';
import {OnmsParm} from './OnmsParm';
import {OnmsSeverity, SEVERITIES} from './OnmsSeverity';
import {OnmsTroubleTicketState, TROUBLE_TICKET_STATES} from './OnmsTroubleTicketState';

/**
 * Represents an OpenNMS alarm.
 * @module OnmsAlarm
 */ /** */
export class OnmsAlarm {
  /** the alarm ID */
  public id: number;

  /** the number of times this alarm has triggered */
  public count: number;

  /** the user that acknowledged this alarm */
  public ackUser: string;

  /** the time this alarm was acknowledged */
  public ackTime: Moment;

  /** the UEI of the event associated with this alarm */
  public uei: string;

  /** the alarm's severity */
  public severity: OnmsSeverity;

  /** the alarm's type */
  public type: OnmsAlarmType;

  /** the alarm's description */
  public description: string;

  /** the first time an event has triggered this alarm */
  public firstEventTime: Moment;

  /** the most recent event that triggered this alarm */
  public lastEvent: OnmsEvent;

  /** the alarm's log message */
  public logMessage: string;

  /** the alarm's reduction key */
  public reductionKey: string;

  /** the trouble ticket ID associated with this alarm */
  public troubleTicket: string;

  /** the state of the trouble ticket associated with this alarm */
  public troubleTicketState: OnmsTroubleTicketState;

  /** the node's ID associated with this alarm */
  public nodeId: number;

  /** the node's label associated with this alarm */
  public nodeLabel: string;

  /** the parms emitted with this alarm's event */
  public parms: OnmsParm[];

  /** the most recent time the event has triggered this alarm */
  public get lastEventTime() {
    if (this.lastEvent && this.lastEvent.time) {
      return this.lastEvent.time;
    }
    return undefined;
  }

}
