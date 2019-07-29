import {SearchPropertyType} from './SearchPropertyType';
import {IValueProvider} from '../dao/IValueProvider';

/**
 * Represents a query search property.
 * @module SearchProperty
 */
export class SearchProperty {
  /** the search property ID */
  public id?: string;

  /** a descriptive name for the property */
  public name?: string;

  /** whether the property is sortable */
  public orderBy?: boolean;

  /** the property type */
  public type?: SearchPropertyType;

  /** the values if any */
  public values: any;

  /** The value provider */
  private valueProvider: IValueProvider;

  constructor(valueProvider: IValueProvider) {
    this.valueProvider = valueProvider;
  }

  /**
   * Hook to gather all the values for this property.
   *
   * @param options Some additional options, to for example restrict the values or limit the query.
   * @returns {Promise<any>}
   */
  public async findValues(options: any): Promise<any> {
    if (this.id) {
      return this.valueProvider.findValues(this.id, options);
    }
  }
}
