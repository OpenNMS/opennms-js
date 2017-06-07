import {Filter} from './filters/Filter';

import {IOnmsHTTP} from '../api/OnmsHTTP';
import {OnmsResult} from '../api/OnmsResult';

/**
 * Abstract data access layer
 * @module AbstractDAO
 * @param K the ID/key type (number, string, etc.)
 * @param T the model type (OnmsAlarm, OnmsEvent, etc.)
 */ /** */
export abstract class AbstractDAO<K, T> {
  /** the HTTP implementation to use */
  protected http: IOnmsHTTP;

  /** construct a DAO instance */
  constructor(httpImpl: IOnmsHTTP) {
    this.http = httpImpl;
  }

  /** create a model object given a JSON data structure */
  public abstract fromData(data: any): T;

  /** get a model object given an ID */
  public abstract get(id: K): Promise<T>;

  /** find all model objects given a filter */
  public abstract find(filter?: Filter<T>): Promise<T[]>;
}
