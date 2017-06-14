import {Filter} from './Filter';
import {IHash} from '../internal/IHash';

/**
 * Interface that represents a filter processor
 * @module IFilterProcessor
 * @interface
 */ /** */
export interface IFilterProcessor {
  /** given a filter, return a hash of URL parameters */
  getParameters(filter: Filter<any>): IHash<string>;
}
