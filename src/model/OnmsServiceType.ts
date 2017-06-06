import {log, catModel} from '../api/Log';
import {Category} from 'typescript-logging';

/** @hidden */
const catServiceType = new Category('service-type', catModel);

/** @hidden */
const SERVICE_TYPES = {
};

/**
 * Represents an OpenNMS service.
 * @module OnmsServiceType
 */ /** */
export class OnmsServiceType {
  /** get a singleton service type object for the given service */
  public static for(id: number, name: string) {
    if (SERVICE_TYPES[id]) {
      if (SERVICE_TYPES[id].name === name) {
        return SERVICE_TYPES[id];
      } else {
        log.warn('Service type ID ' + id + ' is already cached, but names do not match!'
          + ' (' + SERVICE_TYPES[id].name + ' != ' + name + ')', catServiceType);
      }
    }
    SERVICE_TYPES[id] = new OnmsServiceType(id, name);
    return SERVICE_TYPES[id];
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
