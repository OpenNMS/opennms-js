import {log, catModel} from '../api/Log';
import {Category} from 'typescript-logging';

/** @hidden */
const catServiceType = new Category('service-type', catModel);

/** @hidden */
export const ServiceTypes = {
};

/**
 * Represents an OpenNMS service.
 * @module OnmsServiceType
 */
export class OnmsServiceType {
  /** Get a singleton service type object for the given service. */
  public static for(id: number, name: string) {
    if (ServiceTypes[id]) {
      if (ServiceTypes[id].name === name) {
        return ServiceTypes[id];
      } else {
        log.warn('Service type ID ' + id + ' is already cached, but names do not match!'
          + ' (' + ServiceTypes[id].name + ' != ' + name + ')', catServiceType);
      }
    }
    ServiceTypes[id] = new OnmsServiceType(id, name);
    return ServiceTypes[id];
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
}
