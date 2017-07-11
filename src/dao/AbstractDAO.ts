import {IHasHTTP} from '../api/IHasHTTP';
import {IOnmsHTTP} from '../api/IOnmsHTTP';
import {OnmsError} from '../api/OnmsError';

import {Filter} from '../api/Filter';
import {OnmsHTTPOptions} from '../api/OnmsHTTPOptions';

import {log, catDao} from '../api/Log';

import {V1FilterProcessor} from './V1FilterProcessor';
import {V2FilterProcessor} from './V2FilterProcessor';

/** @hidden */
// tslint:disable-next-line
const moment = require('moment');

/**
 * Abstract data access layer
 * @module AbstractDAO
 * @param K the ID/key type (number, string, etc.)
 * @param T the model type (OnmsAlarm, OnmsEvent, etc.)
 */ /** */
export abstract class AbstractDAO<K, T> {
  /** the HTTP implementation to use */
  protected http: IOnmsHTTP;

  /** the filter processor to use when making DAO requests */
  private filterProcessor;

  /** construct a DAO instance */
  constructor(impl: IHasHTTP | IOnmsHTTP) {
    if ((impl as IHasHTTP).http) {
      impl = (impl as IHasHTTP).http;
    }
    this.http = impl as IOnmsHTTP;
  }

  /** create a model object given a JSON data structure */
  public abstract fromData(data: any): T;

  /** get a model object given an ID */
  public abstract async get(id: K): Promise<T>;

  /** find all model objects given a filter */
  public abstract async find(filter?: Filter): Promise<T[]>;

  /** extract the count or totalCount values from response data */
  protected getCount(data: any) {
    let count = 0;
    if (data.count !== undefined) {
      count = parseInt(data.count, 10);
    } else if (data.totalCount !== undefined) {
      count = parseInt(data.totalCount, 10);
    } else {
      log.warn('data is missing count and totalCount properties', catDao);
    }
    return count;
  }

  /** given an optional filter, generate an {@link OnmsHTTPOptions} object for DAO calls */
  protected getOptions(filter?: Filter): OnmsHTTPOptions {
    const ret = new OnmsHTTPOptions();
    // always use application/xml for now in DAO calls
    ret.headers.accept = 'application/xml';
    if (filter) {
      ret.parameters = this.getFilterProcessor().getParameters(filter);
    }
    return ret;
  }

  /** convert the given value to a date, or undefined if it cannot be converted */
  protected toDate(from: any) {
    if (from === undefined || from === null || from === '') {
      return undefined;
    }
    return moment(from);
  }

  /** convert the given value to a number, or undefined if it cannot be converted */
  protected toNumber(from: any) {
    const ret = parseInt(from, 10);
    return isNaN(ret) ? undefined : ret;
  }

  /** retrieve the API version from the underlying server */
  protected getApiVersion() {
    if (this.http.server.metadata === undefined) {
      throw new OnmsError('Server meta-data must be populated prior to making DAO calls.');
    }
    return this.http.server.metadata.apiVersion();
  }

  /** retrieve filter processor for the current API version */
  protected getFilterProcessor() {
    if (!this.filterProcessor) {
      switch (this.getApiVersion()) {
        case 2:
          this.filterProcessor = new V2FilterProcessor();
          break;
        default:
          this.filterProcessor = new V1FilterProcessor();
      }
    }
    return this.filterProcessor;
  }
}
