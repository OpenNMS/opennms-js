/**
 * A hash type for use in interfaces.
 * @module Hash
 * @interface
 */ /** */
export interface IHash<T> {
  /** key must be string, value must be of type T */
  [key: string]: T;
}
