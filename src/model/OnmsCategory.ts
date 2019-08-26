import {IHasUrlValue} from '../api/IHasUrlValue';

import {log} from '../api/Log';

/** @hidden */
export const Categories = {
} as {[key: number]: OnmsCategory};

/**
 * Represents an OpenNMS category.
 * @category Model
 */
export class OnmsCategory implements IHasUrlValue {
  /** Get a singleton category object for the given category. */
  public static for(id: number, name: string) {
    if (Categories[id]) {
      if (Categories[id].name === name) {
        return Categories[id];
      } else {
        log.warn('Category ID ' + id + ' is already cached, but names do not match!'
          + ' (' + Categories[id].name + ' != ' + name + ')');
      }
    }
    Categories[id] = new OnmsCategory(id, name);
    return Categories[id];
  }

  /** The service ID. */
  public id: number;

  /** The service name. */
  public name: string;

  /** Given an ID and name, construct a service type. */
  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  /** @inheritdoc */
  public get urlValue() {
    return this.name;
  }
}
