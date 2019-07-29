import {Moment} from 'moment';

import {IHasUrlValue} from '../api/IHasUrlValue';

import {OnmsServiceType} from './OnmsServiceType';
import {OnmsServiceStatusType} from './OnmsServiceStatusType';

/**
 * Represents an OpenNMS monitored service.
 * @module OnmsMonitoredService
 */
export class OnmsMonitoredService implements IHasUrlValue {
  /** the service ID */
  public id?: number;

  /** the last time the service failed */
  public lastFail?: Moment;

  /** the last time the service passed */
  public lastGood?: Moment;

  /** the node associated with this service */
  public node?: any;

  /** the ipInterface associated with this service */
  public ipInterface?: any;

  /** the service type associated with this service */
  public type?: OnmsServiceType;

  /** the current status */
  public status?: OnmsServiceStatusType;

  /** @inheritdoc */
  public get urlValue() {
    return this.type ? this.type.name : 'null';
  }
}
