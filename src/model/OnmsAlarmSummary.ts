import {Moment} from 'moment';

import {IHasUrlValue} from '../api/IHasUrlValue';
import {OnmsAlarmType} from './OnmsAlarmType';
import {OnmsSeverity} from './OnmsSeverity';

/**
 * Represents an OpenNMS alarm.
 * @module OnmsAlarm
 */
export class OnmsAlarmSummary implements IHasUrlValue {
  /** the alarm ID */
  public id: number;

  /** the alarm's reduction key */
  public reductionKey: string;

  /** the alarm's type */
  public type: OnmsAlarmType;

  /** the alarm's severity */
  public severity: OnmsSeverity;

  /** the alarm's description */
  public description: string;

  public get urlValue() {
    return String(this.id);
  }
}
