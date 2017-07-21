import {AbstractDAO} from './AbstractDAO';

import {Filter} from '../api/Filter';
import {IHasHTTP} from '../api/IHasHTTP';
import {IOnmsHTTP} from '../api/IOnmsHTTP';
import {OnmsError} from '../api/OnmsError';

import {Util} from '../internal/Util';

import {OnmsEvent} from '../model/OnmsEvent';
import {OnmsParm} from '../model/OnmsParm';
import {OnmsServiceType} from '../model/OnmsServiceType';
import {Severities} from '../model/OnmsSeverity';

import {log, catDao} from '../api/Log';
import {Category} from 'typescript-logging';

/** @hidden */
const cat = new Category('events', catDao);

/**
 * Data access for {@link OnmsEvent} objects
 * @module EventDAO
 */ /** */
export class EventDAO extends AbstractDAO<number, OnmsEvent> {
  constructor(impl: IHasHTTP | IOnmsHTTP) {
    super(impl);
  }

  /**
   * create an event object from a JSON object
   * @hidden
   */
  public fromData(data: any) {
    const event = new OnmsEvent();

    event.id = this.toNumber(data.id);
    event.uei = data.uei;
    event.nodeId = this.toNumber(data.nodeId);
    event.nodeLabel = data.nodeLabel;
    event.ipAddress = Util.toIPAddress(data.ipAddress);
    event.createTime = this.toDate(data.createTime);
    event.time = this.toDate(data.time);
    event.source = data.source;
    event.description = data.description;
    event.logMessage = data.logMessage;

    if (data.severity) {
      event.severity = Severities[data.severity];
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

  /** get an event, given the event's ID */
  public async get(id: number): Promise<OnmsEvent> {
    const opts = this.getOptions();
    return this.http.get('rest/events/' + id, opts).then((result) => {
      return this.fromData(result.data);
    });
  }

  /** get an event, given a filter */
  public async find(filter?: Filter): Promise<OnmsEvent[]> {
    const opts = this.getOptions(filter);
    return this.http.get('rest/events', opts).then((result) => {
      let data = result.data;

      if (this.getCount(data) > 0 && data.event) {
        data = data.event;
      } else {
        data = [];
      }

      if (!Array.isArray(data)) {
        if (data.nodeId) {
          data = [data];
        } else {
          throw new OnmsError('Expected an array of events but got "' + (typeof data) + '" instead.');
        }
      }
      return data.map((eventData) => {
        return this.fromData(eventData);
      });
    });
  }

}
