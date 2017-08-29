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

import {PropertiesCache} from './PropertiesCache';

/** @hidden */
// tslint:disable-next-line
const moment = require('moment');

/** @hidden */
// tslint:disable-next-line
import {Moment} from 'moment';
import {IValueProvider} from './IValueProvider';

/**
 * An abstract data access layer API, meant to (somewhat) mirror the DAO interfaces
 * inside OpenNMS.  Used to retrieve model data like alarms, events, etc. from the
 * OpenNMS ReST API in a consistent way.
 *
 * @module AbstractDAO
 * @param K the ID/key type (number, string, etc.)
 * @param T the model type (OnmsAlarm, OnmsEvent, etc.)
 */
export abstract class AbstractDAO<K, T> implements IValueProvider {
  /**
   * The [[IOnmsHTTP]] implementation to use internally when making DAO requests.
   * @hidden
   */
  private httpImpl: IOnmsHTTP;

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

  /**
   * Returns the Promise for a [[IFilterProcessor]].
   * @returns {Promise}
   */
  public async getFilterProcessor(): Promise<IFilterProcessor> {
      switch (this.getApiVersion()) {
          case 2:
            return this.getPropertiesCache().then((cache) => {
              return new V2FilterProcessor(cache);
            });
          default:
            return Promise.resolve(new V1FilterProcessor());
      }
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
    return this.getPropertiesCache().then((cache) => {
      return cache.getProperties();
    });
  }

    /**
     * Gets the property identified by the id if it exists.
     *
     * @param id The id to search the property by.
     */
  public async searchProperty(id: string): Promise<SearchProperty> {
      return this.getPropertiesCache().then((cache) => {
        return cache.getProperty(id);
      });
  }

  /**
   * Returns or creates the [[PropertiesCache]] for this dao.
   *
   * @return the [[PropertiesCache]] for this dao. It is created if it does not exist.
   */
  public async getPropertiesCache(): Promise<PropertiesCache> {
      if (this.getApiVersion() === 1) {
          throw new OnmsError('Search property metadata is only available in OpenNMS ' +
              'versions that support the ReSTv2 API.');
      }

      // Cache not yet initialized
      if (!PropertiesCache.get(this)) {
          return this.getOptions().then((opts) => {
              opts.headers.accept = 'application/json';
              return this.http.get(this.searchPropertyPath(), opts).then((result) => {
                  const searchProperties = this.parseResultList(result, 'searchProperty',
                        this.searchPropertyPath(), (prop) => {
                      return this.toSearchProperty(prop);
                  });
                  PropertiesCache.put(this, searchProperties);
                  return Promise.resolve(PropertiesCache.get(this));
              });
          });
      }
      // Cache already initialized, use value
      return Promise.resolve(PropertiesCache.get(this));
  }

  /**
   * Finds the values for the given propertyId, if it exists.
   *
   * @param {string} propertyId The propertyId to find the values for
   * @param options Some additional options. May be implementer dependent, such as limit, or value restrictions
   * @returns {Promise<any>} A promise containing the values.
   */
  public async findValues(propertyId: string, options?: any): Promise<any> {
    return this.searchProperty(propertyId).then((property) => {
        return this.getOptions().then((opts) => {
           const path = this.searchPropertyPath() + '/' + property.id;
           opts.headers.accept = 'application/json';
           if (options) {
               Object.assign(opts, options);
           }
           return this.http.get(path, opts).then((result) => {
               return this.parseResultList(result, 'value', path, (value) => value);
           });
        });
    });
  }

  /**
   * The path to retrieve search properties for this DAO.
   */
  protected abstract searchPropertyPath(): string;

  /**
   * Fetches the data from the result and verfifes that the <code>dataFieldName</code> exists in the data property.
   * If it does not exist, an exception is thrown.
   *
   * @param result The result to fetch the data from
   * @param dataFieldName The property name (basically <code>result.data[dataFieldName]</code>.
   * @param path The path where the result was fetched from. This is for error handling
   * @param mapCallbackFunction Callback function to convert each entry from <code>result.data[dataFieldName]</code>.
   */
  protected parseResultList(result: any, dataFieldName: string, path: string, mapCallbackFunction: any): any {
      let data = result.data;
      if (this.getCount(data) > 0 && data[dataFieldName]) {
          data = data[dataFieldName];
      } else {
          data = [];
      }

      if (!Array.isArray(data)) {
          throw new OnmsError('Expected an array but got "' + (typeof data) + '" instead: ' + path);
      }
      if (mapCallbackFunction) {
          return data.map(mapCallbackFunction);
      }
      return data;
  }

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
  protected async getOptions(filter?: Filter): Promise<OnmsHTTPOptions> {
      return Promise.resolve(new OnmsHTTPOptions())
          .then((options) => {
              if (this.useJson()) {
                  options.headers.accept = 'application/json';
              } else {
                  // always use application/xml in DAO calls when we're not sure how
                  // usable JSON output will be.
                  options.headers.accept = 'application/xml';
              }
              if (filter) {
                  return this.getFilterProcessor().then((processor) => {
                      options.parameters = processor.getParameters(filter);
                      return options;
                  });
              }
              return options;
          });
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
   * Whether or not to use JSON when making ReST requests.
   */
  protected useJson(): boolean {
    if (this.http === undefined || this.http.server === undefined || this.http.server.metadata === undefined) {
      throw new OnmsError('Server meta-data must be populated prior to making DAO calls.');
    }
    return this.http.server.metadata.useJson();
  }

  /**
   * Generate a [[SearchProperty]] from the given dictionary.
   * @hidden
   */
  protected toSearchProperty(data: any): SearchProperty {
    if (!data) {
      return null;
    }

    const prop = new SearchProperty(this);
    prop.id = data.id;
    prop.name = data.name;
    prop.orderBy = !!data.orderBy;
    prop.type = SearchPropertyType.forId(data.type);
    prop.values = data.values;
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
