import {Comparator} from './Comparator';

/**
 * A query restriction.
 * @module Restriction
 */
export class Restriction {
  /** The model attribute (name, id, etc.) to query. */
  public attribute: string;

  /** The comparator to use when querying. */
  public comparator: Comparator;

  /** The value to compare the attribute property to. */
  public value?: any;

  constructor(attribute: string, comparator: Comparator, value?: any) {
    this.attribute = attribute;
    this.comparator = comparator;
    this.value = value;
  }

  /** A human-readable string for this restriction. */
  public toString() {
    return this.attribute + ' ' + this.comparator.label + (this.value === undefined ? '' : ' ' + this.value);
  }
}
