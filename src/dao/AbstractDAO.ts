import {IFilterProcessor} from '../api/IFilterProcessor';
import {OnmsError} from '../api/OnmsError';

import {Filter} from '../api/Filter';
import {IFilterVisitor} from '../api/IFilterVisitor';
import {NestedRestriction} from '../api/NestedRestriction';
import {OnmsHTTPOptions} from '../api/OnmsHTTPOptions';
import {OnmsServer} from '../api/OnmsServer';
import {Restriction} from '../api/Restriction';
import {SearchProperty} from '../api/SearchProperty';
import {SearchPropertyType} from '../api/SearchPropertyType';

import {log, catDao} from '../api/Log';

import {V1FilterProcessor} from './V1FilterProcessor';
import {V2FilterProcessor} from './V2FilterProcessor';

import {PropertiesCache} from './PropertiesCache';

import {BaseDAO} from './BaseDAO';

/** @hidden */
// tslint:disable-next-line
const moment = require('moment');

/** @hidden */
import {IValueProvider} from './IValueProvider';
import { Clause } from '../api/Clause';

/**
 * An abstract data access layer API, meant to (somewhat) mirror the DAO interfaces
 * inside OpenNMS.  Used to retrieve model data like alarms, events, etc. from the
 * OpenNMS ReST API in a consistent way.
 *
 * @module AbstractDAO
 * @param K the ID/key type (number, string, etc.)
 * @param T the model type (OnmsAlarm, OnmsEvent, etc.)
 */
export abstract class AbstractDAO<K, T> extends BaseDAO implements IValueProvider {
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
  public async searchProperties(): Promise<SearchProperty[] | undefined> {
    return this.getPropertiesCache().then((cache) => {
      if (cache) {
        return cache.getProperties();
      }
    });
  }

    /**
     * Gets the property identified by the id if it exists.
     *
     * @param id The id to search the property by.
     */
  public async searchProperty(id: string): Promise<SearchProperty | undefined> {
      return this.getPropertiesCache().then((cache) => {
        if (cache) {
          return cache.getProperty(id);
        }
      });
  }

  /**
   * Returns or creates the [[PropertiesCache]] for this dao.
   *
   * @return the [[PropertiesCache]] for this dao. It is created if it does not exist.
   */
  public async getPropertiesCache(): Promise<PropertiesCache | undefined> {
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
                        this.searchPropertyPath(), (prop: any) => {
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
        if (!property) {
            return [];
        }
        return this.getOptions().then((opts) => {
           const path = this.searchPropertyPath() + '/' + property.id;
           opts.headers.accept = 'application/json';
           if (options) {
               Object.assign(opts, options);
           }
           return this.http.get(path, opts).then((result) => {
               return this.parseResultList(result, 'value', path, (value: any) => value);
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
  protected parseResultList(result: any, dataFieldName: string, path: string, mapCallbackFunction: any): any[] {
      let ret = [] as any[];

      const data = result.data;
      if (this.getCount(data) > 0 && data[dataFieldName]) {
          ret = data[dataFieldName];
      }

      if (!Array.isArray(ret)) {
          throw new OnmsError('Expected an array but got "' + (typeof ret) + '" instead: ' + path);
      }
      if (mapCallbackFunction) {
          return ret.map(mapCallbackFunction);
      }
      return ret;
  }

  /**
   * "visits" a filter clause, applying it to the filter visitor
   * @param clause the clause to visit
   * @param visitor the visitor impl to invoke
   */
  protected visitClause(clause: Clause, visitor: IFilterVisitor) {
    const self = this;
    if (visitor.onClause) { visitor.onClause(clause); }
    const restriction = clause.restriction;
    if (restriction instanceof Restriction) {
      if (visitor.onRestriction) { visitor.onRestriction(restriction); }
    } else if (restriction instanceof NestedRestriction) {
      if (visitor.onNestedRestriction) { visitor.onNestedRestriction(restriction); }
      restriction.clauses.forEach((c) => {
        self.visitClause(c, visitor);
      });
    } else {
      log.warn('Restriction is of an unknown type: ' + JSON.stringify(restriction), catDao);
    }
  }

  /**
   * Iterate over a Filter object and its children.
   * @param filter the filter to visit
   * @param visitor the class to invoke while visiting the filter
   */
  protected visitFilter(filter: Filter, visitor: IFilterVisitor) {
    const self = this;
    if (visitor.onFilter) { visitor.onFilter(filter); }
    filter.clauses.forEach((clause) => {
      self.visitClause(clause, visitor);
    });
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
   * Generate a [[SearchProperty]] from the given dictionary.
   * @hidden
   */
  protected toSearchProperty(data: any): SearchProperty | null {
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
    if (this.http === undefined || !this.http.server || this.http.server.metadata === undefined) {
      throw new OnmsError('Server meta-data must be populated prior to making DAO calls.');
    }
    return this.http.server.metadata.apiVersion();
  }

  /**
   * Return the current server.
   */
  protected getServer(): OnmsServer {
    if (this.http && this.http.server) {
      return this.http.server;
    }
    throw new OnmsError('No server configured!');
  }
}
