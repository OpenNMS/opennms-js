import {Filter} from './Filter';
import {IHash} from '../internal/IHash';

/**
 * Interface that represents a processor to convert a [[Filter]] into a set of HTTP parameters.
 * @interface
 * @category Filtering API
 */
export interface IFilterProcessor {
  /**
   * Given a [[Filter]], return a hash of URL parameters.
   */
  getParameters(filter: Filter): IHash<string|string[]>;
}

/**
 * A utility method to be used by IFilterProcessor to handle multi-value parameters.
 * @category Filtering API
 */
export const addParameter = (hash: IHash<string|string[]>, key: string, value: any) => {
  // if it doesn't exist, go ahead and set it as a scalar string
  if (!hash[key]) {
    hash[key] = String(value);
    return;
  }

  // if we already have multiple values, add the new one if it's unique
  if (Array.isArray(hash[key])) {
    if (hash[key].indexOf(value) === -1) {
      (hash[key] as string[]).push(String(value));
    }
    return;
  }

  // otherwise, the param is not already an array, but it should be (assuming the new value is unique)
  if (hash[key] !== String(value)) {
    hash[key] = [hash[key] as string, String(value)];
  }
};
