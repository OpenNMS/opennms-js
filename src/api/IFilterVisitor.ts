import {Clause} from './Clause';
import {Filter} from './Filter';
import {NestedRestriction} from './NestedRestriction';
import {Restriction} from './Restriction';

/**
 * A visitor for filters.
 *
 * @interface
 * @category Filtering API
 */
export interface IFilterVisitor {
  /** Process a [[Filter]] */
  onFilter?: (filter: Filter) => void;

  /** Process a [[Clause]] */
  onClause?: (clause: Clause) => void;

  /** Process a [[Restriction]] */
  onRestriction?: (restriction: Restriction) => void;

  /** Process a [[NestedRestriction]] */
  onNestedRestriction?: (restriction: NestedRestriction) => void;
}
