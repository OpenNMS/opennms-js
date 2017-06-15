import {log, catModel} from '../api/Log';
import {Category} from 'typescript-logging';

/** @hidden */
const cat = new Category('category', catModel);

/** @hidden */
export const Categories = {
};

/**
 * Represents an OpenNMS category.
 * @module OnmsCategory
 */ /** */
export class OnmsCategory {
  /** get a singleton category object for the given category */
  public static for(id: number, name: string) {
    if (Categories[id]) {
      if (Categories[id].name === name) {
        return Categories[id];
      } else {
        log.warn('Category ID ' + id + ' is already cached, but names do not match!'
          + ' (' + Categories[id].name + ' != ' + name + ')', cat);
      }
    }
    Categories[id] = new OnmsCategory(id, name);
    return Categories[id];
  }

  /** the service ID */
  public id: number;

  /** the service name */
  public name: string;

  /** given an ID and name, construct a service type */
  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}
