import {IOnmsHTTP} from '../api/IOnmsHTTP';

import {Client} from '../Client';

import {Filter} from '../api/Filter';
import {OnmsHTTPOptions} from '../api/OnmsHTTPOptions';
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
  constructor(impl: Client | IOnmsHTTP) {
    if (impl instanceof Client) {
      this.http = (impl as any).http;
    } else {
      this.http = impl;
    }
  }

  /** create a model object given a JSON data structure */
  public abstract fromData(data: any): T;

  /** get a model object given an ID */
  public abstract get(id: K): Promise<T>;

  /** find all model objects given a filter */
  public abstract find(filter?: Filter): Promise<T[]>;

  /** given an optional filter, generate an {@link OnmsHTTPOptions} object for DAO calls */
  protected getOptions(filter?: Filter): OnmsHTTPOptions {
    const ret = new OnmsHTTPOptions();
    // always use application/xml for now in DAO calls
    ret.accept = 'application/xml';
    if (filter) {
      ret.parameters = this.http.filterProcessor.getParameters(filter);
    }
    return ret;
  }
}
