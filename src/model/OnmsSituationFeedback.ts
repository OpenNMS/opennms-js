import {IHasUrlValue} from '../api/IHasUrlValue';
import {OnmsSituationFeedbackType} from './OnmsSituationFeedbackType';

/**
 * Represents an OpenNMS alarm.
 * @module OnmsAlarm
 */
export class OnmsSituationFeedback implements IHasUrlValue {

  /** the situation reduction key */
  public situationKey: string;

  /** signature of situation having given set of alarms */
  public fingerprint: string;

  /** the related alarm reduction key  */
  public alarmKey: string;

  /** the related alarm reduction key  */
  public feedbackType: OnmsSituationFeedbackType;

  /** the related alarm reduction key  */
  public reason: string;

  /** the related alarm reduction key  */
  public user: string;

  /** the related alarm reduction key  */
  public timestamp: number;

  public get urlValue() {
    return String(this.situationKey);
  }
}
