import {AbstractDAO} from './AbstractDAO';

import {Filter} from '../api/Filter';
import {IHasHTTP} from '../api/IHasHTTP';
import {IOnmsHTTP} from '../api/IOnmsHTTP';
import {OnmsError} from '../api/OnmsError';

import {Util} from '../internal/Util';

import {OnmsEvent} from '../model/OnmsEvent';
import {OnmsParm} from '../model/OnmsParm';
import {OnmsServiceType} from '../model/OnmsServiceType';
import {OnmsSeverity} from '../model/OnmsSeverity';

import {log} from '../api/Log';

/**
 * Data access for [[OnmsEvent]] objects.
 * @category DAO
 */
export class EventDAO extends AbstractDAO<number, OnmsEvent> {
  constructor(impl: IHasHTTP | IOnmsHTTP) {
    super(impl);
  }

  /** Get an event, given the event's ID. */
  public async get(id: number): Promise<OnmsEvent> {
    return this.getOptions().then((builder) => {
        return this.http.get(this.pathToEventsEndpoint() + '/' + id, builder.build()).then((result) => {
            const ev = this.fromData(result.data);
            if (!ev) {
              throw new OnmsError(`EventDAO.get id={id} ReST request succeeded, but did not return a valid event.`);
            }
            return ev;
        });
    });
  }

  /** Get an event, given a filter. */
  public async find(filter?: Filter): Promise<OnmsEvent[]> {
    return this.getOptions(filter).then((builder) => {
        return this.http.get(this.pathToEventsEndpoint(), builder.build()).then((result) => {
            let data = result.data;

            if (data !== null && this.getCount(data, result.code) > 0 && data.event) {
                data = data.event;
            } else {
                data = [];
            }

            if (!Array.isArray(data)) {
                if (data.id) {
                    data = [data];
                } else {
                    throw new OnmsError('Expected an array of events but got "' + (typeof data) + '" instead.');
                }
            }
            const events = data.map((eventData: any) => {
                return this.fromData(eventData);
            });
            // ugh, this cast is necessary to make tsc know there's nothing but OnmsEvent objects
            const ret = events.filter((event: OnmsEvent | undefined) => event !== undefined) as OnmsEvent[];
            const diff = events.length - ret.length;
            if (diff > 0) {
              log.warn(`EventDAO.find ReST request succeeded, but {diff} events could not be parsed.`);
            }
            return ret;
        });
    });
  }

  /**
   * Create an event object from a JSON object.
   * @hidden
   */
  public fromData(data: any) {
    return OnmsEvent.fromData(data);
  }

  /**
   * The path to the event search properties endpoint.
   */
  protected searchPropertyPath() {
    return this.pathToEventsEndpoint() + '/properties';
  }

  /**
   * Get the path to the events endpoint for the appropriate API version.
   * @hidden
   */
  private pathToEventsEndpoint() {
    return this.getApiVersion() === 2 ? 'api/v2/events' : 'rest/events';
  }

}
