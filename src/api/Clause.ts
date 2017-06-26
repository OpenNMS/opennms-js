import {Operator} from './Operator';
import {Restriction} from './Restriction';
import {NestedRestriction} from './NestedRestriction';

/**
 * A restriction and boolean operator pair.
 * @module Clause
 */ /** */
export class Clause {
  /** the associated restriction */
  public restriction: Restriction|NestedRestriction;

  /** the boolean operator */
  public operator: Operator;

  constructor(restriction: Restriction|NestedRestriction, operator: Operator) {
    this.restriction = restriction;
    this.operator = operator;
  }

}
