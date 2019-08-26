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
  getParameters(filter: Filter): IHash<string>;
}
