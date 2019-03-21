import {Operator} from './Operator';
import {Restriction} from './Restriction';
import {NestedRestriction} from './NestedRestriction';

/**
 * A restriction and boolean operator pair.
 * @module Clause
 */
export class Clause {
  /** Given a clause JSON structure, return a Clause object. */
  public static fromJson(clause) {
    const operator = Operator.forLabel(clause.operator.label);
    if (clause.restriction.clauses) {
      const nestedRestriction = NestedRestriction.fromJson(clause.restriction);
      return new Clause(nestedRestriction, operator);
    } else {
      const restriction = Restriction.fromJson(clause.restriction);
      return new Clause(restriction, operator);
    }
  }

  /** The associated restriction. */
  public restriction: Restriction|NestedRestriction;

  /** The boolean operator to apply. */
  public operator: Operator;

  constructor(restriction: Restriction|NestedRestriction, operator: Operator) {
    this.restriction = restriction;
    this.operator = operator;
  }

}
