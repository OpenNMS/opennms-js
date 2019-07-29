import {SearchProperty} from '../api/SearchProperty';

/**
 * Convenient interface to access [[SearchProperty]]s.
 * Mainly used for caching purposes.
 */
export interface ISearchPropertyAccessor {

    /**
     * Returns all available [[SearchProperty]]s.
     * @returns {SearchProperty[]}
     */
    getProperties(): SearchProperty[];

    /**
     * Returns a certain [[SearchProperty]].
     *
     * @param {string} id The property id to find the property for.
     * @returns {SearchProperty} The property found.
     */
    getProperty(id: string): SearchProperty | undefined;
}
