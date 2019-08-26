import {IOnmsHTTP} from './IOnmsHTTP';

/**
 * Interface for a class that has an HTTP object.
 *
 * This exists to avoid import loops between the DAOs (that need to easily access [[IOnmsHTTP]])
 * and the [[Client]] which needs to contain an [[IOnmsHTTP]].
 *
 * @interface
 * @category Rest
 */
export interface IHasHTTP {
  /** The HTTP implementation this object should contain. */
  http: IOnmsHTTP;
}
