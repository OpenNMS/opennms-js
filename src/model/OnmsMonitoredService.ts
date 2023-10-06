import { IpInterfaceDAO } from './../dao/IpInterfaceDAO';
import {Moment} from 'moment';

import {IHasUrlValue} from '../api/IHasUrlValue';

import {OnmsServiceType} from './OnmsServiceType';
import {OnmsServiceStatusType} from './OnmsServiceStatusType';
import { Util } from '../internal/Util';

/**
 * Represents an OpenNMS monitored service.
 * @category Model
 */
export class OnmsMonitoredService implements IHasUrlValue {
  /** the service ID */
  public id?: number;

  /** true if the service is down */
  public down?: boolean;

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

  public ipInterfaceId?: number;

  public ipAddress?: string;

  public nodeId?: number;

  public nodeLabel?: string;

  /** @inheritdoc */
  public get urlValue() {
    return this.type ? this.type.name : 'null';
  }

  /**
   * create a monitored service object from a JSON object
   * @hidden
   */
   public static fromData(data: any): OnmsMonitoredService {
    const service = new OnmsMonitoredService();

    service.id = Util.toNumber(data.id);
    service.down = data.down;
    service.lastFail = Util.toDate(data.lastFail);
    service.lastGood = Util.toDate(data.lastGood);

    if (data.serviceType) {
      service.type = OnmsServiceType.for(data.serviceType.id, data.serviceType.name);
    }
    if (data.status) {
      service.status = OnmsServiceStatusType.forId(data.status);
    }

    if (data.ipInterfaceId) {
      service.ipInterfaceId = data.ipInterfaceId;
    }

    if (data.ipAddress) {
      service.ipAddress = data.ipAddress;
    }

    if (data.nodeId) {
      service.nodeId = data.nodeId;
    }

    if (data.nodeLabel) {
      service.nodeLabel = data.nodeLabel;
    }

    return service;
  }
}
