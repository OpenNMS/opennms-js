import {AbstractDAO} from './AbstractDAO';
import {EventDAO} from './EventDAO';

import {Filter} from '../api/Filter';
import {IHasHTTP} from '../api/IHasHTTP';
import {IOnmsHTTP} from '../api/IOnmsHTTP';
import {OnmsError} from '../api/OnmsError';
import {OnmsHTTPOptions} from '../api/OnmsHTTPOptions';

import {OnmsAlarm} from '../model/OnmsAlarm';
import {AlarmTypes} from '../model/OnmsAlarmType';
import {OnmsParm} from '../model/OnmsParm';
import {OnmsServiceType} from '../model/OnmsServiceType';
import {Severities} from '../model/OnmsSeverity';
import {TroubleTicketStates} from '../model/OnmsTroubleTicketState';
import {OnmsMemo} from '../model/OnmsMemo';

import {log, catDao} from '../api/Log';
import {Category} from 'typescript-logging';

/** @hidden */
const cat = new Category('alarms', catDao);

/**
 * Data access for {@link OnmsAlarm} objects
 * @module AlarmDAO
 */ /** */
export class AlarmDAO extends AbstractDAO<number, OnmsAlarm> {
  /** an event DAO to be used for creating events attached to alarms from API/JSON data */
  private eventDao: EventDAO;

  constructor(impl: IHasHTTP | IOnmsHTTP) {
    super(impl);
    this.eventDao = new EventDAO(impl);
  }

  /**
   * create an alarm object from a JSON object
   * @hidden
   */
  public fromData(data: any) {
    const alarm = new OnmsAlarm();

    alarm.id = this.toNumber(data.id);
    alarm.count = data.count;
    alarm.ackUser = data.ackUser;
    alarm.uei = data.uei;
    alarm.description = data.description;
    alarm.firstEventTime = this.toDate(data.firstEventTime);
    alarm.lastEvent = this.eventDao.fromData(data.lastEvent);
    alarm.logMessage = data.logMessage;
    alarm.reductionKey = data.reductionKey;
    alarm.troubleTicket = data.troubleTicket;
    alarm.nodeId = this.toNumber(data.nodeId);
    alarm.nodeLabel = data.nodeLabel;
    alarm.suppressedBy = data.suppressedBy;

    if (data.ackTime) {
      alarm.ackTime = this.toDate(data.ackTime);
    }

    if (data.severity) {
      alarm.severity = Severities[data.severity];
    }

    if (data.type) {
      const type = this.toNumber(data.type);
      alarm.type = AlarmTypes[type];
    }

    if (data.troubleTicketState) {
      alarm.troubleTicketState = TroubleTicketStates[data.troubleTicketState];
    }

    if (data.serviceType) {
      const st = data.serviceType;
      alarm.service = OnmsServiceType.for(st.id, st.name);
    }

    if (data.suppressedTime) {
      alarm.suppressedTime = this.toDate(data.suppressedTime);
    }

    if (data.suppressedUntil) {
      alarm.suppressedUntil = this.toDate(data.suppressedUntil);
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
          parm.name,
          parm.type,
          parm.value,
        );
        alarm.parameters.push(parm);
      }
    }

    alarm.sticky = this.toMemo(data.stickyMemo);
    alarm.journal = this.toMemo(data.reductionKeyMemo);

    return alarm;
  }

  /** get an alarm, given the alarm's ID */
  public async get(id: number): Promise<OnmsAlarm> {
    const opts = this.getOptions();
    return this.http.get(this.pathToAlarmsEndpoint() + '/' + id, opts).then((result) => {
      return this.fromData(result.data);
    });
  }

  /** get an alarm, given a filter */
  public async find(filter?: Filter): Promise<OnmsAlarm[]> {
    const opts = this.getOptions(filter);
    return this.http.get(this.pathToAlarmsEndpoint(), opts).then((result) => {
      let data = result.data;

      if (this.getCount(data) > 0 && data.alarm) {
        data = data.alarm;
      } else {
        data = [];
      }

      if (!Array.isArray(data)) {
        throw new OnmsError('Expected an array of alarms but got "' + (typeof data) + '" instead.');
      }
      return data.map((alarmData) => {
        return this.fromData(alarmData);
      });
    });
  }

  /** given an optional filter, generate an {@link OnmsHTTPOptions} object for DAO calls */
  protected getOptions(filter?: Filter): OnmsHTTPOptions {
    const options = super.getOptions(filter);
    // always use application/json for v2 calls
    if (this.getApiVersion() === 2) {
      options.accept = 'application/json';
    }
    return options;
  }

  /** get the path to the alarms endpoint for the appropriate API version */
  private pathToAlarmsEndpoint() {
    return this.getApiVersion() === 2 ? 'api/v2/alarms' : 'rest/alarms';
  }

  /** generate a memo from the given dictionary */
  private toMemo(data: any): OnmsMemo {
    if (!data) {
      return null;
    }

    const memo = new OnmsMemo();
    memo.id = data.id;
    memo.author = data.author;
    memo.body = data.body;
    memo.created = this.toDate(data.created);
    memo.updated = this.toDate(data.updated);
    return memo;
  }

}
