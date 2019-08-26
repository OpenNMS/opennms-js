/**
 * A hash type for use in interfaces.
 * @interface
 * @category Internal
 */
export interface IHash<T> {
  /** Key must be string, value must be of type T. */
  [key: string]: T;
}
