import {AbstractDAO} from './AbstractDAO';
import {EventDAO} from './EventDAO';

import {Filter} from '../api/Filter';
import {IHasHTTP} from '../api/IHasHTTP';
import {IHash} from '../internal/IHash';
import {IOnmsHTTP} from '../api/IOnmsHTTP';
import {OnmsError} from '../api/OnmsError';
import {OnmsHTTPOptions} from '../api/OnmsHTTPOptions';
import {OnmsResult} from '../api/OnmsResult';
import {SearchProperty} from '../api/SearchProperty';

import {OnmsAlarm} from '../model/OnmsAlarm';
import {AlarmTypes} from '../model/OnmsAlarmType';
import {OnmsParm} from '../model/OnmsParm';
import {OnmsServiceType} from '../model/OnmsServiceType';
import {Severities} from '../model/OnmsSeverity';
import {OnmsTroubleTicketState, TroubleTicketStates} from '../model/OnmsTroubleTicketState';
import {OnmsMemo} from '../model/OnmsMemo';

import {log, catDao} from '../api/Log';
import {Category} from 'typescript-logging';

/** @hidden */
const cat = new Category('alarms', catDao);

/**
 * Data access for [[OnmsAlarm]] objects.
 * @module AlarmDAO
 */
export class AlarmDAO extends AbstractDAO<number, OnmsAlarm> {
  /**
   * an event DAO to be used for creating events attached to alarms from API/JSON data.
   * @hidden
   */
  private eventDao: EventDAO;

  constructor(impl: IHasHTTP | IOnmsHTTP) {
    super(impl);
    this.eventDao = new EventDAO(impl);
  }

  /**
   * Fetch an alarm.
   *
   * @version ReST v1+
   * @param {number} id - The alarm's ID.
   * @return An [[OnmsAlarm]].
   */
  public async get(id: number): Promise<OnmsAlarm> {
    return this.getOptions().then((opts) => {
        return this.http.get(this.pathToAlarmsEndpoint() + '/' + id, opts).then((result) => {
            return this.fromData(result.data);
        });
    });
  }

  /**
   * Find matching alarms.
   *
   * @version ReST v1+
   * @param {Filter} filter - The filter to use when querying.
   * @return An array of [[OnmsAlarm]] objects.
   */
  public async find(filter?: Filter): Promise<OnmsAlarm[]> {
    return this.getOptions(filter).then((opts) => {
        return this.http.get(this.pathToAlarmsEndpoint(), opts).then((result) => {
            const data = this.getData(result);
            return data.map((alarmData) => {
                return this.fromData(alarmData);
            });
        });
    });
  }

    /**
     * Extracts the data from an HTTP Request result.
     *
     * @param result the HTTP Request result.
     * @returns An array of [[OnmsAlarm]] objects.
     */
  public getData(result: any): OnmsAlarm[] {
      let data = result.data;

      if (data !== null && this.getCount(data) > 0 && data.alarm) {
        data = data.alarm;
      } else {
        data = [];
      }

      if (!Array.isArray(data)) {
        if (data.id) {
          data = [data];
        } else {
          throw new OnmsError('Expected an array of alarms but got "' + (typeof data) + '" instead.');
        }
      }
      return data;
  }

  /**
   * Acknowledge an alarm.
   *
   * @version ReST v1+
   * @param {number|OnmsAlarm} id - The [[OnmsAlarm]] or alarm ID.
   * @param {string=} user - The user to ack the alarm as.
   *                  (Only administrators have the right to do this.)
   */
  public async acknowledge(alarm: number|OnmsAlarm, user?: string): Promise<void> {
    const alarmId = (typeof(alarm) === 'number' ? alarm : alarm.id);
    const parameters = {} as IHash<string>;
    parameters.ack = 'true';
    if (user !== undefined) {
      parameters.ackUser = user;
    }
    return this.put(this.pathToAlarmsEndpoint() + '/' + alarmId, parameters);
  }

  /**
   * Un-acknowledge an alarm.
   *
   * @version ReST v1+
   * @param {number|OnmsAlarm} alarm - The [[OnmsAlarm]] or alarm ID.
   */
  public async unacknowledge(alarm: number|OnmsAlarm, user?: string): Promise<void> {
    const alarmId = (typeof(alarm) === 'number' ? alarm : alarm.id);
    const parameters = {} as IHash<string>;
    parameters.ack = 'false';
    if (user !== undefined) {
      parameters.ackUser = user;
    }
    return this.put(this.pathToAlarmsEndpoint() + '/' + alarmId, parameters);
  }

  /**
   * Escalate an alarm.
   *
   * @version ReST v1+
   * @param {number|OnsmAlarm} alarm - The [[OnmsAlarm]] or alarm ID.
   */
  public async escalate(alarm: number|OnmsAlarm): Promise<void> {
    const alarmId = (typeof(alarm) === 'number' ? alarm : alarm.id);
    const parameters = {} as IHash<string>;
    parameters.escalate = 'true';
    return this.put(this.pathToAlarmsEndpoint() + '/' + alarmId, parameters);
  }

  /**
   * Clear an alarm.
   *
   * @version ReST v1+
   * @param {number|OnmsAlarm} alarm - The [[OnmsAlarm]] or alarm ID.
   */
  public async clear(alarm: number|OnmsAlarm): Promise<void> {
    const alarmId = (typeof(alarm) === 'number' ? alarm : alarm.id);
    const parameters = {} as IHash<string>;
    parameters.clear = 'true';
    return this.put(this.pathToAlarmsEndpoint() + '/' + alarmId, parameters);
  }

  /**
   * Associate a ticket ID with the alarm.
   *
   * @version ReST v1+
   * @param {number|OnmsAlarm} alarm - The [[OnmsAlarm]] or alarm ID.
   * @param {string} ticketId - The ticket ID.
   */
  public async setTTicketId(alarm: number|OnmsAlarm, ticketId: string): Promise<void> {
    const alarmId = (typeof(alarm) === 'number' ? alarm : alarm.id);
    const parameters = {} as IHash<string>;
    parameters.ticketId = ticketId;
    return this.put(this.pathToAlarmsEndpoint() + '/' + alarmId, parameters);
  }

  /**
   * Update the state of the ticket associated with the alarm.
   *
   * @version ReST v1+
   * @param {number|OnmsAlarm} alarm - The [[OnmsAlarm]] or alarm ID.
   * @param {string} state - The ticket state.
   */
  public async setTTicketState(alarm: number|OnmsAlarm, state: OnmsTroubleTicketState): Promise<void> {
    const alarmId = (typeof(alarm) === 'number' ? alarm : alarm.id);
    const parameters = {} as IHash<string>;
    parameters.ticketState = state.label;
    return this.put(this.pathToAlarmsEndpoint() + '/' + alarmId, parameters);
  }

  /**
   * Create a trouble ticket for the specified alarm.
   *
   * @version ReST v2
   * @param {number|OnmsAlarm} alarm - The [[OnmsAlarm]] or alarm ID.
   */
  public async createTicket(alarm: number|OnmsAlarm): Promise<void> {
    if (this.getApiVersion() === 1) {
      throw new OnmsError('Create/Update/Close ticket is only available in OpenNMS ' +
        'versions that support the ReSTv2 API.');
    }

    const alarmId = (typeof(alarm) === 'number' ? alarm : alarm.id);
    const options = new OnmsHTTPOptions();
    options.headers.accept = 'text/plain';
    return this.http.post(this.pathToAlarmsEndpoint() + '/' + alarmId + '/ticket/create', options).then(() => {
      log.debug('Ticket creation pending.', cat);
    }).catch((err: OnmsResult<OnmsAlarm>) => {
      if (err.code === 501) {
        log.warn('Trouble ticketing is not enabled on ' + this.http.server.toString());
      }
      throw err;
    });
  }

  /**
   * Notify OpenNMS it should fetch updated ticket state for an alarm from the remote ticketing system.
   *
   * @version ReST v2
   * @param {number|OnmsAlarm} alarm - The [[OnmsAlarm]] or alarm ID.
   */
  public async triggerTicketUpdate(alarm: number|OnmsAlarm): Promise<void> {
    if (this.getApiVersion() === 1) {
      throw new OnmsError('Create/Update/Close ticket is only available in OpenNMS ' +
        'versions that support the ReSTv2 API.');
    }

    const alarmId = (typeof(alarm) === 'number' ? alarm : alarm.id);
    const options = new OnmsHTTPOptions();
    options.headers.accept = 'text/plain';
    return this.http.post(this.pathToAlarmsEndpoint() + '/' + alarmId + '/ticket/update', options).then(() => {
      log.debug('Ticket update pending.', cat);
    }).catch((err: OnmsResult<OnmsAlarm>) => {
      if (err.code === 501) {
        log.warn('Trouble ticketing is not enabled on ' + this.http.server.toString());
      }
      throw err;
    });
  }

  /**
   * Close the ticket associated with the given alarm.
   *
   * @version ReST v2
   * @param {number|OnmsAlarm} alarm - The [[OnmsAlarm]] or alarm ID.
   */
  public async closeTicket(alarm: number|OnmsAlarm): Promise<void> {
    if (this.getApiVersion() === 1) {
      throw new OnmsError('Create/Update/Close ticket is only available in OpenNMS ' +
        'versions that support the ReSTv2 API.');
    }

    const alarmId = (typeof(alarm) === 'number' ? alarm : alarm.id);
    const options = new OnmsHTTPOptions();
    options.headers.accept = 'text/plain';
    return this.http.post(this.pathToAlarmsEndpoint() + '/' + alarmId + '/ticket/close', options).then(() => {
      log.debug('Ticket close pending.', cat);
    }).catch((err: OnmsResult<OnmsAlarm>) => {
      if (err.code === 501) {
        log.warn('Trouble ticketing is not enabled on ' + this.http.server.toString());
      }
      throw err;
    });
  }

  /**
   * Create or update the sticky memo associated with the alarm.
   *
   * @version ReST v2
   * @param {number|OnmsAlarm} alarm - The [[OnmsAlarm]] or alarm ID.
   * @param {string} body - The memo body
   * @param {string=} user - The user to update the memo as.
   *                  (Only administrators have the right to do this.)
   */
  public async saveStickyMemo(alarm: number|OnmsAlarm, body: string, user?: string): Promise<void> {
    return this.saveMemo('memo', alarm, body, user);
  }

  /**
   * Create or update the journal memo associated with the alarm.
   *
   * @version ReST v2
   * @param {number|OnmsAlarm} alarm - The [[OnmsAlarm]] or alarm ID.
   * @param {string} body - The memo body
   * @param {string=} user - The user to update the memo as.
   *                  (Only administrators have the right to do this.)
   */
  public async saveJournalMemo(alarm: number|OnmsAlarm, body: string, user?: string): Promise<void> {
    return this.saveMemo('journal', alarm, body, user);
  }

  /**
   * Delete the sticky memo ticket associated with the given alarm.
   *
   * @version ReST v2
   * @param {number|OnmsAlarm} alarm - The [[OnmsAlarm]] or alarm ID.
   */
  public async deleteStickyMemo(alarm: number|OnmsAlarm): Promise<void> {
    return this.deleteMemo('memo', alarm);
  }

  /**
   * Delete the journal memo ticket associated with the given alarm.
   *
   * @version ReST v2
   * @param {number|OnmsAlarm} alarm - The [[OnmsAlarm]] or alarm ID.
   */
  public async deleteJournalMemo(alarm: number|OnmsAlarm): Promise<void> {
    return this.deleteMemo('journal', alarm);
  }

  /**
   * Generate an alarm object from the given dictionary.
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
    alarm.location = data.location;
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

    if (typeof data.troubleTicketState !== 'undefined') {
        const troubleTicketKey = Object.keys(TroubleTicketStates).find((key) => {
            return TroubleTicketStates[key].id === data.troubleTicketState;
        });
        if (troubleTicketKey) {
            alarm.troubleTicketState = TroubleTicketStates[troubleTicketKey];
        }
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

  /**
   * Generate a memo from the given dictionary.
   * @hidden
   */
  public toMemo(data: any): OnmsMemo {
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

  /**
   * The path to the alarm search properties endpoint.
   */
  protected searchPropertyPath() {
    return this.pathToAlarmsEndpoint() + '/properties';
  }

  /**
   * Given an optional filter, generate an [[OnmsHTTPOptions]] object for DAO calls.
   * @hidden
   */
  protected async getOptions(filter?: Filter): Promise<OnmsHTTPOptions> {
    return super.getOptions(filter).then((options) => {
        // always use application/json for v2 calls
        if (this.getApiVersion() === 2) {
            options.headers.accept = 'application/json';
        }
        return options;
    });
  }

  /**
   * Call a PUT request in the format the alarm ack API expects.
   * @hidden
   */
  private async put(url: string, parameters = {} as IHash<string>): Promise<void> {
    return this.getOptions().then((opts) => {
        opts.headers['content-type'] = 'application/x-www-form-urlencoded';
        opts.headers.accept = null;
        opts.parameters = parameters;
        return this.http.put(url, opts).then((result) => {
            if (!result.isSuccess) {
                throw result;
            }
            return;
        });
    });
  }

  /**
   * Call a DELETE request in the format the alarm ack API expects.
   * @hidden
   */
  private async httpDelete(url: string, parameters = {} as IHash<string>): Promise<void> {
      return this.getOptions().then((opts) => {
          opts.headers['content-type'] = 'application/x-www-form-urlencoded';
          opts.headers.accept = null;
          opts.parameters = parameters;
          return this.http.httpDelete(url, opts).then((result) => {
              if (!result.isSuccess) {
                  throw result;
              }
              return;
          });
      });
  }

  /**
   * Get the path to the alarms endpoint for the appropriate API version.
   * @hidden
   */
  private pathToAlarmsEndpoint() {
    return this.getApiVersion() === 2 ? 'api/v2/alarms' : 'rest/alarms';
  }

  /**
   * Save a journal or sticky memo.
   * @hidden
   */
  private async saveMemo(type: string, alarm: number|OnmsAlarm, body: string, user?: string): Promise<void> {
    if (this.getApiVersion() === 1) {
      throw new OnmsError('Save/Delete memo is only available in OpenNMS ' +
          'versions that support the ReSTv2 API.');
    }

    const alarmId = (typeof(alarm) === 'number' ? alarm : alarm.id);
    const parameters = {} as IHash<string>;
    parameters.body = body;
    if (user !== undefined) {
      parameters.user = user;
    }
    return this.put(this.pathToAlarmsEndpoint() + '/' + alarmId + '/' + type, parameters);
  }

  /**
   * Delete a journal or sticky memo
   * @hidden
   */
  private async deleteMemo(type: string, alarm: number|OnmsAlarm): Promise<void> {
    if (this.getApiVersion() === 1) {
      throw new OnmsError('Save/Delete memo is only available in OpenNMS ' +
          'versions that support the ReSTv2 API.');
    }

    const alarmId = (typeof(alarm) === 'number' ? alarm : alarm.id);
    return this.httpDelete(this.pathToAlarmsEndpoint() + '/' + alarmId + '/' + type);
  }

}
