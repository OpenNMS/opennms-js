import {SearchPropertyType} from './SearchPropertyType';

/**
 * Represents a query search property.
 * @module SearchProperty
 */
export class SearchProperty {
  /** the search property ID */
  public id: string;

  /** a descriptive name for the property */
  public name: string;

  /** whether the property is sortable */
  public orderBy: boolean;

  /** the property type */
  public type: SearchPropertyType;
}
