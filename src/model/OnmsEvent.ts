import {Moment} from 'moment';
import {Address4, Address6} from 'ip-address';

import {Util} from '../internal/Util';

import {IHasUrlValue} from '../api/IHasUrlValue';

import {OnmsParm} from './OnmsParm';
import {OnmsServiceType} from './OnmsServiceType';
import {OnmsSeverity} from './OnmsSeverity';

/**
 * Represents an OpenNMS event.
 * @category Model
 */
export class OnmsEvent implements IHasUrlValue {
  /** the event ID */
  public id?: number;

  /** the UEI of this event */
  public uei?: string;

  /** the label of this event as defined in the event configuration */
  public label?: string;

  /** which location the event originated from */
  public location?: string;

  /** the node's ID associated with this event */
  public nodeId?: number;

  /** the node's label associated with this event */
  public nodeLabel?: string;

  /** the interface associated with this event */
  public ipAddress?: Address4 | Address6;

  /** the severity of this event */
  public severity?: OnmsSeverity;

  /** when the event was created */
  public createTime?: Moment;

  /** when the event was received by OpenNMS */
  public time?: Moment;

  /** which subsystem the event came from */
  public source?: string;

  /** the description of is event */
  public description?: string;

  /** the log message of the event */
  public logMessage?: string;

  /** the service associated with the event */
  public service?: OnmsServiceType;

  /** the parameters emitted with this alarm's event */
  public parameters?: OnmsParm[];

  /** the service name associated with the event */
  public get serviceName() {
    if (this.service && this.service.name) {
      return this.service.name;
    }
    return undefined;
  }

  /** @inheritdoc */
  public get urlValue() {
    return String(this.id);
  }

  /** convert an event from ReST JSON */
  public static fromData(data: any): OnmsEvent | undefined {
    const event = new OnmsEvent();

    if (!data) {
      return undefined;
    }

    event.id = Util.toNumber(data.id);
    event.uei = data.uei;
    event.label = data.label;
    event.location = data.location;
    event.nodeId = Util.toNumber(data.nodeId);
    event.nodeLabel = data.nodeLabel;
    event.ipAddress = Util.toIPAddress(data.ipAddress);
    event.createTime = Util.toDate(data.createTime);
    event.time = Util.toDate(data.time);
    event.source = data.source;
    event.description = data.description;
    event.logMessage = data.logMessage;

    if (data.severity) {
      event.severity = OnmsSeverity.forLabel(data.severity);
    }

    if (data.serviceType) {
      const st = data.serviceType;
      event.service = OnmsServiceType.for(st.id, st.name);
    }

    if (data.parameters) {
      let parms = data.parameters;
      if (parms.parameter) {
        parms = parms.parameter;
      }
      if (!Array.isArray(parms)) {
        parms = [parms];
      }
      event.parameters = [];

      for (let parm of parms) {
        parm = new OnmsParm(
          parm.name,
          parm.type,
          parm.value,
        );
        event.parameters.push(parm);
      }
    }

    return event;
  }
}
