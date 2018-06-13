import {IHasUrlValue} from '../api/IHasUrlValue';

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
 */
export class OnmsCategory implements IHasUrlValue {
  /** Get a singleton category object for the given category. */
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

  /** The service ID. */
  public id: number;

  /** The service name. */
  public name: string;

  /** The authorized groups. */
  public authorizedGroups = [] as string[];

  /** Given an ID and name, construct a service type. */
  constructor(id: number, name: string, authorizedGroups?: string[]) {
    this.id = id;
    this.name = name;
    if (authorizedGroups) {
      this.authorizedGroups = authorizedGroups.slice(0);
    }
  }

  /** The stringified value of this category as an OpenNMS URL parameter. */
  public get urlValue() {
    return this.name;
  }
}
