import {AbstractDAO} from './AbstractDAO';
import {ISearchPropertyAccessor} from './ISearchPropertyAccessor';
import {SearchProperty} from '../api/SearchProperty';

/**
 * The Properties Cache persists all properties for each [[AbstractDAO]].
 */
export class PropertiesCache implements ISearchPropertyAccessor {

    /**
     * Returns the cache for the given dao if exists.
     *
     * @param {AbstractDAO<any, any>} dao The dao to get the cache for.
     * @returns {any} The cache if it exists.
     */
    public static get(dao: AbstractDAO<any, any>): PropertiesCache {
        const className = dao.constructor.name;
        return this.caches[className];
    }

    /**
     * Stores the search properties for the given dao.
     *
     * @param {AbstractDAO<any, any>} dao The dao to persist the properties for.
     * @param {SearchProperty[]} searchProperties The properties to persist.
     */
    public static put(dao: AbstractDAO<any, any>, searchProperties: SearchProperty[]) {
        const className = dao.constructor.name;
        this.caches[className] = new PropertiesCache(searchProperties);
    }

    /** The cache persistence. */
    private static caches = new Map<string, PropertiesCache>();

    /** The properties for each cache. */
    private properties: SearchProperty[];

    constructor(properties: SearchProperty[]) {
        this.properties = properties;
    }

    /**
     * Returns the property identified by id, if it exists.
     * @param {string} id The property id to find the property for.
     * @returns {SearchProperty} The property
     */
    public getProperty(id: string): SearchProperty {
        const result = this.getProperties().find((property) => {
            return property.id === id;
        });
        return result;
    }

    /**
     * Returns all existing properties in the cache.
     *
     * @returns {SearchProperty[]} All existing properties in the cache.
     */
    public getProperties(): SearchProperty[] {
        return this.properties;
    }
}
