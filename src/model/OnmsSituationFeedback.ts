import {IHasUrlValue} from '../api/IHasUrlValue';
import {OnmsSituationFeedbackType} from './OnmsSituationFeedbackType';

/**
 * Represents an OpenNMS alarm.
 * @module OnmsAlarm
 */
export class OnmsSituationFeedback implements IHasUrlValue {

  /** the situation reduction key */
  public situationKey?: string;

  /** signature of situation having given set of alarms */
  public fingerprint?: string;

  /** the related alarm reduction key  */
  public alarmKey?: string;

  /** the related alarm reduction key  */
  public feedbackType?: OnmsSituationFeedbackType;

  /** the related alarm reduction key  */
  public reason?: string;

  /** the related alarm reduction key  */
  public user?: string;

  /** TRUE if Alarm in this Feedback is the Root Cause of the Situation in this Feedback */
  public rootCause?: boolean;

  /** User defined attributes relating to the Situation/Feedback */
  public tags?: string[];

  /** the related alarm reduction key  */
  public timestamp?: number;

  /** @inheritdoc */
  public get urlValue() {
    return String(this.situationKey);
  }
}
