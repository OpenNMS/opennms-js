import {IHasUrlValue} from '../api/IHasUrlValue';

import {OnmsEnum, forId, forLabel} from '../internal/OnmsEnum';

/**
 * Represents an OpenNMS "SituationFeedback" type.
 * @category Model
 */
export class OnmsSituationFeedbackType extends OnmsEnum<string> implements IHasUrlValue {
  /** Given an ID, return the matching SituationFeedback type object. */
  public static forId(id?: string) {
    return forId(FeedbackTypes, id);
  }

  /** Given a label, return the matching snmp status type object. */
  public static forLabel(label?: string) {
    return forLabel(FeedbackTypes, label);
  }

  /** @inheritdoc */
  public get urlValue() {
    return String(this.id);
  }
}

/* eslint-disable  */
/**
 * Contains constant instances of all feedback types.
 * @category Model
 */
export const FeedbackTypes = {
  /** Alarm is correctly correlated */
  CORRECT: new OnmsSituationFeedbackType('CORRECT', 'CORRECT'),
  /** Alarm should be correlated in a new Situation  */
  CREATE_SITUATION: new OnmsSituationFeedbackType('CREATE_SITUATION', 'CREATE_SITUATION'),
  /** Alarm was incorrectly correlated */
  FALSE_POSITIVE: new OnmsSituationFeedbackType('FALSE_POSITIVE', 'FALSE_POSITIVE'),
  /** Alarm was incorrectly ommitted */
  FALSE_NEGATIVE: new OnmsSituationFeedbackType('FALSE_NEGATIVE', 'FALSE_NEGATIVE'),
};
Object.freeze(FeedbackTypes);
