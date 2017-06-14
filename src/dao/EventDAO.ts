import {AbstractDAO} from './AbstractDAO';

import {Filter} from '../api/Filter';
import {OnmsError} from '../api/OnmsError';
import {OnmsHTTPOptions} from '../api/OnmsHTTPOptions';

import {Util} from '../internal/Util';

import {OnmsEvent} from '../model/OnmsEvent';
import {OnmsParm} from '../model/OnmsParm';
import {OnmsServiceType} from '../model/OnmsServiceType';
import {SEVERITIES} from '../model/OnmsSeverity';

import {log, catDao} from '../api/Log';
import {Category} from 'typescript-logging';

import * as moment from 'moment';

/** @hidden */
const cat = new Category('events', catDao);

/**
 * Data access for {@link OnmsEvent} objects
 * @module EventDAO
 */ /** */
export class EventDAO extends AbstractDAO<number, OnmsEvent> {
  /** create an event object from a JSON object */
  public fromData(data: any) {
    const event = new OnmsEvent();

    event.id = data._id || data.id;
    event.uei = data.uei;
    event.nodeId = data.nodeId;
    event.nodeLabel = data.nodeLabel;
    event.ipAddress = Util.toIPAddress(data.ipAddress);
    event.createTime = moment(data.createTime);
    event.time = moment(data.time);
    event.source = data.source;
    event.description = data.description;
    event.logMessage = data.logMessage;

    if (data._severity || data.severity) {
      event.severity = SEVERITIES[data._severity || data.severity];
    }

    if (data.serviceType) {
      const st = data.serviceType;
      event.service = OnmsServiceType.for(st._id || st.id, st._name || st.name);
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
          parm._name || parm.name,
          parm._type || parm.type,
          parm._value || parm.value,
        );
        event.parameters.push(parm);
      }
    }

    return event;
  }

  /** get an event, given the event's ID */
  public get(id: number): Promise<OnmsEvent> {
    const opts = this.getOptions();
    return this.http.get('rest/events/' + id, opts).then((result) => {
      let data = result.data;
      if (result.type === 'application/xml') {
        if (data.event) {
          data = data.event;
        } else {
          log.warn('Expected "event" property on query response but it was not there...', cat);
        }
      }

      log.trace('data: ' + JSON.stringify(data));

      return this.fromData(data);
    });
  }

  /** get an event, given a filter */
  public find(filter?: Filter<OnmsEvent>): Promise<OnmsEvent[]> {
    const opts = this.getOptions(filter);
    return this.http.get('rest/events', opts).then((result) => {
      let data = result.data;

      let count = 0;
      if (result.type === 'application/xml') {
        if (data.events) {
          if (data.events._totalCount) {
            count = parseInt(data.events._totalCount, 10);
          }
          if (data.events._count) {
            count = parseInt(data.events._count, 10);
          }
          if (count > 0 && data.events.event) {
            data = data.events.event;
          } else {
            data = [];
          }
        }
      } else {
        if (data.totalCount) {
          count = parseInt(data.totalCount, 10);
        }
        if (data.count) {
          count = parseInt(data.count, 10);
        }
        if (count > 0 && data.event) {
          data = data.event;
        } else {
          data = [];
        }
      }

      if (!Array.isArray(data)) {
        throw new OnmsError('Expected an array of events but got "' + (typeof data) + '" instead.');
      }
      return data.map((eventData) => {
        return this.fromData(eventData);
      });
    });
  }

}
