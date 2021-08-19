import { Address4, Address6 } from 'ip-address';
import { Moment } from 'moment';

import { Util } from '../internal/Util';

import { IHasUrlValue } from '../api/IHasUrlValue';

import { OnmsEvent } from './OnmsEvent';
import { OnmsMonitoredService } from './OnmsMonitoredService';

/**
 * Represents an OpenNMS outage.
 * @category Model
 */
export class OnmsOutage implements IHasUrlValue {
  /** the node ID */
  public id?: number;

  /** the foreign source associated with the outage */
  public foreignSource?: string;

  /** the foreign ID asociated with the outage */
  public foreignId?: string;

  /** the ID of the node associated with the outage */
  public nodeId?: number;

  /** the label of the node associated with the outage */
  public nodeLabel?: string;

  /** the IP address associated with the outage */
  public ipAddress?: Address4 | Address6;

  /** the monitored service associated with the outage */
  public monitoredService?: OnmsMonitoredService;

  /** when the outage started */
  public ifLostService?: Moment;

  /** the event associated with the start of the outage */
  public serviceLostEvent?: OnmsEvent;

  /** when the outage was resolved */
  public ifRegainedService?: Moment;

  /** the event associated with the end of the outage */
  public serviceRegainedEvent?: OnmsEvent;

  /** when the outage was suppressed */
  public suppressTime?: Moment;

  /** who the outage was suppressed by */
  public suppressedBy?: string;

  /** the perspective of the outage */
  public perspective?: string;

  /** @inheritdoc */
  public get urlValue() {
    return String(this.id);
  }

  /**
   * Create a node object from a JSON object.
   * @hidden
   */
  public static fromData(data: any) {
    if (!data) {
      return undefined;
    }

    const outage = new OnmsOutage();

    outage.id = Util.toNumber(data.id);
    outage.foreignSource = data.foreignSource || undefined;
    outage.foreignId = data.foreignId || undefined;
    outage.nodeId = Util.toNumber(data.nodeId);
    outage.nodeLabel = data.nodeLabel || undefined;
    outage.ipAddress = Util.toIPAddress(data.ipAddress);
    outage.monitoredService = OnmsMonitoredService.fromData(data.monitoredService);
    outage.ifLostService = Util.toDate(data.ifLostService);
    outage.serviceLostEvent = OnmsEvent.fromData(data.ifLostService);
    outage.ifRegainedService = Util.toDate(data.ifRegainedService);
    outage.serviceRegainedEvent = OnmsEvent.fromData(data.ifRegainedService);
    outage.suppressTime = Util.toDate(data.suppressTime);
    outage.suppressedBy = data.suppressedBy || undefined;
    outage.perspective = data.perspective || undefined;

    return outage;
  }
}
