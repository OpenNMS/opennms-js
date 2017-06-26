import {NestedRestriction} from './NestedRestriction';

/**
 * A query filter for DAOs.
 * @module Filter
 * @param T the model type (OnmsAlarm, OnmsEvent, etc.)
 */ /** */
export class Filter extends NestedRestriction {
  /** how many results to get back by default */
  public limit = 1000;

  /** TODO: add (multiple) orderBy/order support */

}
