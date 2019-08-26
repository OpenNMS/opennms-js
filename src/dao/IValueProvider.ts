
/**
 * Interface to provide values to a certain property ID.
 * @interface
 * @category DAO
 */
export interface IValueProvider {

  /**
   * Finds the values for the given propertyId, if it exists.
   *
   * @param {string} propertyId The propertyId to find the values for
   * @param options Some additional options. May be implementer dependent, such as limit, or value restrictions
   * @returns {Promise<any>} A promise containing the values.
   */
  findValues(propertyId: string, options?: any): Promise<any>;
}
