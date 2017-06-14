import {AbstractDAO} from './AbstractDAO';
import {EventDAO} from './EventDAO';

import {OnmsAlarm} from '../model/OnmsAlarm';
import {OnmsParm} from '../model/OnmsParm';
import {OnmsServiceType} from '../model/OnmsServiceType';

import {AlarmTypes} from '../model/OnmsAlarmType';
import {Severities} from '../model/OnmsSeverity';
import {TroubleTicketStates} from '../model/OnmsTroubleTicketState';

import {Filter} from '../api/Filter';
import {IOnmsHTTP} from '../api/IOnmsHTTP';
import {OnmsError} from '../api/OnmsError';
import {OnmsHTTPOptions} from '../api/OnmsHTTPOptions';

import {log, catDao} from '../api/Log';
import {Category} from 'typescript-logging';

/** @hidden */
// tslint:disable-next-line
const moment = require('moment');

/** @hidden */
const cat = new Category('alarms', catDao);

/**
 * Data access for {@link OnmsAlarm} objects
 * @module AlarmDAO
 */ /** */
export class AlarmDAO extends AbstractDAO<number, OnmsAlarm> {
  /** an event DAO to be used for creating events attached to alarms from API/JSON data */
  private eventDao: EventDAO;

  constructor(httpImpl: IOnmsHTTP) {
    super(httpImpl);
    this.eventDao = new EventDAO(httpImpl);
  }

  /** create an alarm object from a JSON object */
  public fromData(data: any) {
    const alarm = new OnmsAlarm();

    alarm.id = data._id || data.id;
    alarm.count = data._count || data.count;
    alarm.ackUser = data.ackUser;
    alarm.uei = data.uei;
    alarm.description = data.description;
    alarm.firstEventTime = moment(data.firstEventTime);
    alarm.lastEvent = this.eventDao.fromData(data.lastEvent);
    alarm.logMessage = data.logMessage;
    alarm.reductionKey = data.reductionKey;
    alarm.troubleTicket = data.troubleTicket;
    alarm.nodeId = data.nodeId;
    alarm.nodeLabel = data.nodeLabel;
    alarm.suppressedBy = data.suppressedBy;

    if (data._ackTime || data.ackTime) {
      alarm.ackTime = moment(data._ackTime || data.ackTime);
    }

    if (data._severity || data.severity) {
      alarm.severity = Severities[data._severity || data.severity];
    }

    if (data._type || data.type) {
      const type = parseInt(data._type || data.type, 10);
      alarm.type = AlarmTypes[type];
    }

    if (data.troubleTicketState) {
      alarm.troubleTicketState = TroubleTicketStates[data.troubleTicketState];
    }

    if (data.serviceType) {
      const st = data.serviceType;
      alarm.service = OnmsServiceType.for(st._id || st.id, st._name || st.name);
    }

    if (data.suppressedTime) {
      alarm.suppressedTime = moment(data.suppressedTime);
    }

    if (data.suppressedUntil) {
      alarm.suppressedUntil = moment(data.suppressedUntil);
    }

    if (data.parameters) {
      let parms = data.parameters;
      if (parms.parameter) {
        parms = parms.parameter;
      }
      if (!Array.isArray(parms)) {
        parms = [parms];
      }
      alarm.parameters = [];

      for (let parm of parms) {
        parm = new OnmsParm(
          parm._name || parm.name,
          parm._type || parm.type,
          parm._value || parm.value,
        );
        alarm.parameters.push(parm);
      }
    }

    return alarm;
  }

  /** get an alarm, given the alarm's ID */
  public get(id: number): Promise<OnmsAlarm> {
    const opts = this.getOptions();
    return this.http.get('rest/alarms/' + id, opts).then((result) => {
      let data = result.data;
      if (result.type === 'application/xml') {
        if (data.alarm) {
          data = data.alarm;
        } else {
          log.warn('Expected "alarm" property on query response but it was not there...', cat);
        }
      }

      log.trace('data: ' + JSON.stringify(data));

      return this.fromData(data);
    });
  }

  /** get an alarm, given a filter */
  public find(filter?: Filter<OnmsAlarm>): Promise<OnmsAlarm[]> {
    const opts = this.getOptions(filter);
    return this.http.get('rest/alarms', opts).then((result) => {
      let data = result.data;

      let count = 0;
      if (result.type === 'application/xml') {
        if (data.alarms) {
          if (data.alarms._totalCount) {
            count = parseInt(data.alarms._totalCount, 10);
          }
          if (count > 0 && data.alarms.alarm) {
            data = data.alarms.alarm;
          } else {
            data = [];
          }
        }
      } else {
        if (data.totalCount) {
          count = parseInt(data.totalCount, 10);
        }
        if (count > 0 && data.alarm) {
          data = data.alarm;
        } else {
          data = [];
        }
      }

      if (!Array.isArray(data)) {
        throw new OnmsError('Expected an array of alarms but got "' + (typeof data) + '" instead.');
      }
      return data.map((alarmData) => {
        return this.fromData(alarmData);
      });
    });
  }

}
