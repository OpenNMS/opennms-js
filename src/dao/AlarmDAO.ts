import {AbstractDAO} from './AbstractDAO';
import {EventDAO} from './EventDAO';

import {Comparators} from '../api/Comparator';
import {Filter} from '../api/Filter';
import {IHasHTTP} from '../api/IHasHTTP';
import {IHash} from '../internal/IHash';
import {IOnmsHTTP} from '../api/IOnmsHTTP';
import {OnmsError} from '../api/OnmsError';
import {OnmsHTTPOptions, OnmsHTTPOptionsBuilder} from '../api/OnmsHTTPOptions';
import {OnmsResult} from '../api/OnmsResult';
import {Restriction} from '../api/Restriction';

import {OnmsAlarm} from '../model/OnmsAlarm';
import {OnmsAlarmType} from '../model/OnmsAlarmType';
import {OnmsParm} from '../model/OnmsParm';
import {OnmsServiceType} from '../model/OnmsServiceType';
import {OnmsSeverity} from '../model/OnmsSeverity';
import {OnmsTroubleTicketState} from '../model/OnmsTroubleTicketState';
import {OnmsMemo} from '../model/OnmsMemo';

import {log} from '../api/Log';

/**
 * Data access for [[OnmsAlarm]] objects.
 * @category DAO
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
        return this.http.get(this.pathToAlarmsEndpoint() + '/' + id, opts.build()).then((result) => {
            const alarm = this.fromData(result.data);
            if (!alarm) {
              throw new OnmsError(`AlarmDAO.get id={id} ReST request succeeded, but did not return a valid alarm.`);
            }
            return alarm;
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
        return this.http.get(this.pathToAlarmsEndpoint(), opts.build()).then((result) => {
            const data = this.getData(result);
            if (!Array.isArray(data)) {
              if (!data) {
                return [] as OnmsAlarm[];
              }
              throw new OnmsError('Expected an array of alarms but got "' + (typeof data) + '" instead.');
            }
            const alarms = data.map((alarmData) => {
                return this.fromData(alarmData);
            });
            // ugh, this cast is necessary to make tsc know there's nothing but OnmsAlarm objects
            const ret = alarms.filter((alarm: OnmsAlarm | undefined) => alarm !== undefined) as OnmsAlarm[];
            const diff = alarms.length - ret.length;
            if (diff > 0) {
              log.warn(`AlarmDAO.find ReST request succeeded, but {diff} alarms could not be parsed.`);
            }
            return ret;
        });
    });
  }

    /**
     * Extracts the data from an HTTP Request result.
     *
     * @param result the HTTP Request result.
     * @returns An array of [[OnmsAlarm]] objects.
     */
  public getData(result: OnmsResult<any>): OnmsAlarm[] {
      let data = result.data;

      if (data !== null && this.getCount(data, result.code) > 0 && data.alarm) {
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
   * @param {number|OnmsAlarm} alarm - The [[OnmsAlarm]] or alarm ID.
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
    const builder = OnmsHTTPOptions.newBuilder().setHeader('Accept', 'text/plain');
    return this.http.post(this.pathToAlarmsEndpoint() + '/' + alarmId + '/ticket/create', builder.build()).then(() => {
      log.debug('Ticket creation pending.');
    }).catch(this.handleError);
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
    const builder = OnmsHTTPOptions.newBuilder().setHeader('Accept', 'text/plain');
    return this.http.post(this.pathToAlarmsEndpoint() + '/' + alarmId + '/ticket/update', builder.build()).then(() => {
      log.debug('Ticket update pending.');
    }).catch(this.handleError);
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
    const builder = OnmsHTTPOptions.newBuilder().setHeader('Accept', 'text/plain');
    return this.http.post(this.pathToAlarmsEndpoint() + '/' + alarmId + '/ticket/close', builder.build()).then(() => {
      log.debug('Ticket close pending.');
    }).catch(this.handleError);
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

    if (!data) {
      return undefined;
    }

    alarm.id = this.toNumber(data.id);
    alarm.count = data.count;
    alarm.ackUser = data.ackUser;
    alarm.uei = data.uei;
    alarm.description = data.description;
    alarm.firstEventTime = this.toDate(data.firstEventTime);

    if (!data.lastEvent) {
      log.warn(`"lastEvent" missing on alarm id={alarm.id}.`);
    }
    alarm.lastEvent = this.eventDao.fromData(data.lastEvent);

    alarm.location = data.location;
    alarm.logMessage = data.logMessage;
    alarm.reductionKey = data.reductionKey;
    alarm.troubleTicket = data.troubleTicket;
    alarm.troubleTicketLink = data.troubleTicketLink;
    alarm.nodeId = this.toNumber(data.nodeId);
    alarm.nodeLabel = data.nodeLabel;
    alarm.suppressedBy = data.suppressedBy;
    alarm.operatorInstructions = data.operatorInstructions;

    if (data.ackTime) {
      alarm.ackTime = this.toDate(data.ackTime);
    }

    if (data.severity) {
      alarm.severity = OnmsSeverity.forLabel(data.severity);
    }

    if (data.type) {
      const type = this.toNumber(data.type);
      alarm.type = OnmsAlarmType.forId(type);
    }

    if (typeof data.troubleTicketState !== 'undefined') {
      alarm.troubleTicketState = OnmsTroubleTicketState.forId(data.troubleTicketState);
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

    alarm.relatedAlarms = data.relatedAlarms;

    alarm.managedObjectType = data.managedObjectType;
    alarm.managedObjectInstance = data.managedObjectInstance;

    alarm.sticky = this.toMemo(data.stickyMemo);
    alarm.journal = this.toMemo(data.reductionKeyMemo);

    alarm.detailsPage = this.getDetailsPage(alarm);

    alarm.affectedNodeCount = data.affectedNodeCount;

    return alarm;
  }

  /**
   * Generate a memo from the given dictionary.
   * @hidden
   */
  public toMemo(data: any): OnmsMemo | undefined {
    if (!data) {
      return undefined;
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
  protected async getOptions(filter?: Filter): Promise<OnmsHTTPOptionsBuilder> {
    if (filter) {
      this.visitFilter(filter, {
        onRestriction: (restriction: Restriction) => {
          if (restriction.attribute === 'isAcknowledged') {
            let value = String(restriction.value).toLowerCase() === 'true';
            restriction.attribute = 'alarmAckTime';
            if (restriction.comparator.label === Comparators.NE.label) {
              value = !value;
            }
            restriction.comparator = value ? Comparators.NOTNULL : Comparators.NULL;
            restriction.value = undefined;
          }
        },
      });
    }

    return super.getOptions(filter).then((options) => {
        // always use application/json for v2 calls
        if (this.getApiVersion() === 2) {
          return options.setHeader('Accept', 'application/json');
        }
        return options;
    });
  }

  /**
   * Call a PUT request in the format the alarm ack API expects.
   * @hidden
   */
  private async put(url: string, parameters = {} as IHash<string>): Promise<void> {
    const builder = (await this.getOptions())
      .setHeader('Content-Type', 'application/x-www-form-urlencoded')
      .setHeader('Accept', undefined)
      .setParameters(parameters);

    return this.http.put(url, builder.build()).then((result) => {
        if (!result.isSuccess) {
            throw result;
        }
        return;
    });
  }

  /**
   * Call a DELETE request in the format the alarm ack API expects.
   * @hidden
   */
  private async httpDelete(url: string, parameters = {} as IHash<string>): Promise<void> {
    const builder = (await this.getOptions())
      .setHeader('Content-Type', 'application/x-www-form-urlencoded')
      .setHeader('Accept', undefined)
      .setParameters(parameters);
    return this.http.httpDelete(url, builder.build()).then((result) => {
        if (!result.isSuccess) {
            throw result;
        }
        return;
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

  /**
   * Retrieves the URL to the details page for the given alarm.
   *
   * @param {number|OnmsAlarm} alarm - The [[OnmsAlarm]] or alarm ID.
   * @returns {URL} URL on the associated OpenNMS server for the alarm details page.
   */
  private getDetailsPage(alarm: number|OnmsAlarm): string {
      const alarmId = (typeof(alarm) === 'number' ? alarm : alarm.id);
      return this.server.resolveURL(`alarm/detail.htm`, {id: alarmId});
  }

  /**
   * Handle response errors and automatically log "ticketing not enabled" responses.
   * @param err the HTTP result error
   */
  private handleError(err: OnmsResult<OnmsAlarm>): void {
    if (err.code === 501) {
      try {
        log.warn('Trouble ticketing is not enabled on ' + this.server.toString());
      } catch (e) {
        log.warn('Trouble ticketing is not enabled.');
      }
    }
    throw err;
  }
}
