import {Comparator} from './Comparator';

/**
 * A query restriction.
 * @module Restriction
 */ /** */
export class Restriction {
  /** the model attribute (name, id, etc.) to query */
  public attribute: string;

  /** the comparator to use when querying */
  public comparator: Comparator;

  /** the value to compare the attribute property to */
  public value?: any;

  constructor(attribute: string, comparator: Comparator, value?: any) {
    this.attribute = attribute;
    this.comparator = comparator;
    this.value = value;
  }

  /** human-readable string for this restriction */
  public toString() {
    return this.attribute + ' ' + this.comparator.label + (this.value === undefined ? '' : ' ' + this.value);
  }
}
