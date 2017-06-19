import {IOnmsHTTP} from './IOnmsHTTP';

/**
 * Interface for a class that has an HTTP object.
 *
 * This exists to avoid import loops between the DAOs (that need to easily access {@link IOnmsHTTP})
 * and the {@link Client} which needs to contain an {@link IOnmsHTTP}.
 *
 * @interface
 * @module IHasHTTP
 */ /** */

export interface IHasHTTP {
  /** the HTTP implementation this object should contain */
  http: IOnmsHTTP;
}
