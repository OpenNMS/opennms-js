import {Address4, Address6} from 'ip-address';
import {Moment} from 'moment';

import {OnmsServiceType} from './OnmsServiceType';
import {OnmsServiceStatusType} from './OnmsServiceStatusType';

/**
 * Represents an OpenNMS monitored service.
 * @module OnmsMonitoredService
 */ /** */
export class OnmsMonitoredService {
  /** the interface ID */
  public id: number;

  /** the last time the service failed */
  public lastFail: Moment;

  /** the last time the service passed */
  public lastGood: Moment;

  /** the service type */
  public serviceType: OnmsServiceType;

  /** the current status */
  public status: OnmsServiceStatusType;
}
