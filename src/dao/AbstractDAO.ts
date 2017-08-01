import {IFilterProcessor} from '../api/IFilterProcessor';
import {IHasHTTP} from '../api/IHasHTTP';
import {IOnmsHTTP} from '../api/IOnmsHTTP';
import {OnmsError} from '../api/OnmsError';

import {Filter} from '../api/Filter';
import {OnmsHTTPOptions} from '../api/OnmsHTTPOptions';
import {SearchProperty} from '../api/SearchProperty';
import {SearchPropertyType} from '../api/SearchPropertyType';

import {log, catDao} from '../api/Log';

import {V1FilterProcessor} from './V1FilterProcessor';
import {V2FilterProcessor} from './V2FilterProcessor';

/** @hidden */
// tslint:disable-next-line
const moment = require('moment');

/** @hidden */
// tslint:disable-next-line
import {Moment} from 'moment';

/**
 * An abstract data access layer API, meant to (somewhat) mirror the DAO interfaces
 * inside OpenNMS.  Used to retrieve model data like alarms, events, etc. from the
 * OpenNMS ReST API in a consistent way.
 *
 * @module AbstractDAO
 * @param K the ID/key type (number, string, etc.)
 * @param T the model type (OnmsAlarm, OnmsEvent, etc.)
 */
export abstract class AbstractDAO<K, T> {
  /**
   * The [[IOnmsHTTP]] implementation to use internally when making DAO requests.
   * @hidden
   */
  private httpImpl: IOnmsHTTP;

  /**
   * The [[IFilterProcessor]] to use internally when making DAO requests.
   * @hidden
   */
  private filterProcessorImpl;

  /**
   * Construct a DAO instance.
   *
   * @param impl - The HTTP implementation to use.  It is also legal to pass any object
   *               conforming to the [[IHasHTTP]] interface (like a [[Client]]).
   */
  constructor(impl: IOnmsHTTP | IHasHTTP) {
    if ((impl as IHasHTTP).http) {
      impl = (impl as IHasHTTP).http;
    }
    this.httpImpl = impl as IOnmsHTTP;
  }

  /**
   * The HTTP implementation to use internally when making DAO requests.
   */
  public get http() {
    return this.httpImpl;
  }

  public set http(impl: IOnmsHTTP) {
    this.httpImpl = impl;
  }

  public get filterProcessor() {
    if (!this.filterProcessorImpl) {
      switch (this.getApiVersion()) {
        case 2:
          this.filterProcessorImpl = new V2FilterProcessor();
          break;
        default:
          this.filterProcessorImpl = new V1FilterProcessor();
      }
    }
    return this.filterProcessorImpl;
  }

  public set filterProcessor(impl: IFilterProcessor) {
    this.filterProcessorImpl = impl;
  }

  /**
   * Retrieve a model object.
   * @param id - the ID of the object
   */
  public abstract async get(id: K): Promise<T>;

  /**
   * Find all model objects given an optional filter.
   * @param filter - the filter to use when retrieving a list of model objects
   */
  public abstract async find(filter?: Filter): Promise<T[]>;

  /**
   * Get the list properties that can be used in queries.
   * @version ReST v2
   */
  public async searchProperties(): Promise<SearchProperty[]> {
    if (this.getApiVersion() === 1) {
      throw new OnmsError('Search property metadata is only available in OpenNMS ' +
        'versions that support the ReSTv2 API.');
    }

    const opts = this.getOptions();
    opts.headers.accept = 'application/json';
    return this.http.get(this.searchPropertyPath(), opts).then((result) => {
      let data = result.data;

      if (this.getCount(data) > 0 && data.searchProperty) {
        data = data.searchProperty;
      } else {
        data = [];
      }

      if (!Array.isArray(data)) {
        throw new OnmsError('Expected an array of search properties but got "' +
          (typeof data) + '" instead: ' + this.searchPropertyPath());
      }
      return data.map((prop) => {
        return this.toSearchProperty(prop);
      });
    });
  }

  /**
   * The path to retrieve search properties for this DAO.
   */
  protected abstract searchPropertyPath(): string;

  /**
   * A convenience method to make it easy for implementers to extract the count
   * (or totalCount) values from response data.
   */
  protected getCount(data: any): number {
    let count = 0;
    if (typeof(data) === 'number') {
      count = data;
    } else if (data.count !== undefined) {
      count = parseInt(data.count, 10);
    } else if (data.totalCount !== undefined) {
      count = parseInt(data.totalCount, 10);
    } else {
      log.debug('data is missing count and totalCount properties', catDao);
    }
    return count;
  }

  /**
   * Create an [[OnmsHTTPOptions]] object for DAO calls given an optional filter.
   * @param filter - the filter to use
   */
  protected getOptions(filter?: Filter): OnmsHTTPOptions {
    const ret = new OnmsHTTPOptions();
    // always use application/xml for now in DAO calls
    ret.headers.accept = 'application/xml';
    if (filter) {
      ret.parameters = this.filterProcessor.getParameters(filter);
    }
    return ret;
  }

  /**
   * Convert the given value to a date, or undefined if it cannot be converted.
   */
  protected toDate(from: any): Moment|undefined {
    if (from === undefined || from === null || from === '') {
      return undefined;
    }
    return moment(from);
  }

  /**
   * Convert the given value to a number, or undefined if it cannot be converted.
   */
  protected toNumber(from: any): number|undefined {
    const ret = parseInt(from, 10);
    return isNaN(ret) ? undefined : ret;
  }

  /**
   * Generate a [[SearchProperty]] from the given dictionary.
   * @hidden
   */
  protected toSearchProperty(data: any): SearchProperty {
    if (!data) {
      return null;
    }

    const prop = new SearchProperty();
    prop.id = data.id;
    prop.name = data.name;
    prop.orderBy = !!data.orderBy;
    prop.type = SearchPropertyType.forId(data.type);
    return prop;
  }

  /**
   * Retrieve the API version from the currently configured server.
   */
  protected getApiVersion(): number {
    if (this.http === undefined || this.http.server === undefined || this.http.server.metadata === undefined) {
      throw new OnmsError('Server meta-data must be populated prior to making DAO calls.');
    }
    return this.http.server.metadata.apiVersion();
  }
}
