import {OnmsError} from '../api/OnmsError';

import {Clause} from '../api/Clause';
import {Filter} from '../api/Filter';
import {IFilterProcessor} from '../api/IFilterProcessor';
import {IFilterVisitor} from '../api/IFilterVisitor';
import {IValueProvider} from './IValueProvider';
import {NestedRestriction} from '../api/NestedRestriction';
import {OnmsHTTPOptions, OnmsHTTPOptionsBuilder} from '../api/OnmsHTTPOptions';
import {OnmsServer} from '../api/OnmsServer';
import {Restriction} from '../api/Restriction';
import {SearchProperty} from '../api/SearchProperty';
import {SearchPropertyType} from '../api/SearchPropertyType';

import {log} from '../api/Log';

import {V1FilterProcessor} from './V1FilterProcessor';
import {V2FilterProcessor} from './V2FilterProcessor';

import {BaseDAO} from './BaseDAO';

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
  /** A local cache of v2 DAO properties (`api/v2/DAO/properties`) */
  private propertiesCache: any;

  /**
   * Returns the Promise for a [[IFilterProcessor]].
   * @returns {Promise}
   */
  public async getFilterProcessor(): Promise<IFilterProcessor> {
      switch (this.getApiVersion()) {
          case 2:
            const cache = await this.getPropertiesCache();
            return new V2FilterProcessor(cache);
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
    return await this.getPropertiesCache();
  }

    /**
     * Gets the property identified by the id if it exists.
     *
     * @param id The id to search the property by.
     */
  public async searchProperty(id: string): Promise<SearchProperty | undefined> {
      const cache = await this.getPropertiesCache();
      return cache.find((prop: any) => prop.id === id);
  }

  /**
   * Returns or creates a cache of properties for this dao.
   *
   * @return the cache for this dao. It is created if it does not exist.
   */
  public async getPropertiesCache(): Promise<any> {
      if (this.getApiVersion() === 1) {
          throw new OnmsError('Search property metadata is only available in OpenNMS ' +
              'versions that support the ReSTv2 API.');
      }

      if  (!this.propertiesCache) {
        const opts = (await this.getOptions()).setHeader('Accept', 'application/json');
        const result = await this.http.get(this.searchPropertyPath(), opts.build());
        this.propertiesCache = this.parseResultList(result, 'searchProperty',
          this.searchPropertyPath(), (prop: any) => this.toSearchProperty(prop));
      }

      return this.propertiesCache;
  }

  /**
   * Finds the values for the given propertyId, if it exists.
   *
   * @param {string} propertyId The propertyId to find the values for
   * @param options Some additional options. May be implementer dependent, such as limit, or value restrictions
   * @returns {Promise<any>} A promise containing the values.
   */
  public async findValues(propertyId: string, options?: any): Promise<any> {
    const [property, defaultOptions] = await Promise.all([this.searchProperty(propertyId), this.getOptions(options)]);
    if (!property || !property.id) {
      throw new OnmsError('Unable to determine property for ID ' + propertyId);
    }
    const path = this.searchPropertyPath() + '/' + property.id;
    const opts = defaultOptions.setHeader('Accept', 'application/json');
    const result = await this.http.get(path, opts.build());
    return this.parseResultList(result, 'value', path, (value: any) => value);
  }

  /** @inheritdoc */
  protected onSetServer(server: OnmsServer) {
    log.debug('Server has changed, invalidating DAO cache:' + JSON.stringify(server));
    this.propertiesCache = undefined;
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
      if (restriction.clauses) {
        restriction.clauses.forEach((c) => {
          self.visitClause(c, visitor);
        });
      }
    } else {
      log.warn('Restriction is of an unknown type: ' + JSON.stringify(restriction));
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
    if (filter.clauses) {
      filter.clauses.forEach((clause) => {
        self.visitClause(clause, visitor);
      });
    }
  }

  /**
   * Create an [[OnmsHTTPOptions]] object for DAO calls given an optional filter.
   * @param filter - the filter to use
   */
  protected async getOptions(filter?: Filter): Promise<OnmsHTTPOptionsBuilder> {
    const builder = OnmsHTTPOptions.newBuilder();

    if (this.useJson()) {
      builder.setHeader('Accept', 'application/json');
    } else {
      // always use application/xml in DAO calls when we're not sure how
      // usable JSON output will be.
      builder.setHeader('Accept', 'application/xml');
    }
    if (filter) {
      const processor = await this.getFilterProcessor();
      builder.setParameters(processor.getParameters(filter));
    }

    return builder;
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
    if (!this.server || this.server.metadata === null) {
      throw new OnmsError('Server meta-data must be populated prior to making DAO calls.');
    }
    return this.server.metadata.apiVersion();
  }
}
