
import {Clause} from './Clause';
import {Filter} from './Filter';
import {NestedRestriction} from './NestedRestriction';
import {Restriction} from './Restriction';

/**
 * A visitor for filters.
 * @module FilterVisitor
 */
export interface IFilterVisitor {
  onFilter?: (filter: Filter) => void;
  onClause?: (clause: Clause) => void;
  onRestriction?: (restriction: Restriction) => void;
  onNestedRestriction?: (restriction: NestedRestriction) => void;
}
