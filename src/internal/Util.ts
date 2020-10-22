import {OnmsError} from '../api/OnmsError';
import {log} from '../api/Log';

import {Address4, Address6} from 'ip-address';
import {Moment} from 'moment';

/** @hidden */
// tslint:disable-next-line
const moment = require('moment');

/** @hidden */
const dateFormat = 'YYYY-MM-DDTHH:mm:ss.SSSZZ';

/**
 * A utility class for random stuff.
 * @category Internal
 */
export class Util {

  /**
   * Convert an IP address string to an [[Address4]] or [[Address6]] object.
   */
  public static toIPAddress(addr?: string) {
    if (addr) {
      try {
        if (addr.indexOf(':') >= 0) {
          return new Address6(addr);
        } else {
          return new Address4(addr);
        }
      } catch (err) {
        log.error('Unable to parse IP address "' + addr + '"', err);
      }
    }
    return undefined;
  }

  /**
   * Whether or not the passed object is already a date. (Either a [[Moment]] object, or
   * a JavaScript [[Date]] object.)
   */
  public static isDateObject(date: any) {
    return moment.isMoment(date) || date instanceof Date;
  }

  /**
   * Create a [[Moment]] from any form of date (JavaScript [[Date]], [[Moment]], or epoch).
   * [[Moment]] dates in OpenNMS.js will always be converted internally to UTC to avoid time
   * zone issues.
   */
  public static toMoment(date: Date|Moment|string|number): Moment | undefined {
    if (date === undefined || date === null) {
      return undefined;
    } else if (moment.isMoment(date)) {
      return (date as Moment).utc();
    } else if (typeof(date) === 'number' || date instanceof Date
      || typeof(date) === 'string' || date instanceof String) {
      return moment(date).utc();
    } else {
      throw new OnmsError('Unable to parse type "' + typeof(date) + '" as a date.');
    }
  }

  /**
   * Create a date string from any form of date (JavaScript [[Date]], [[Moment]], or epoch).
   * Dates in OpenNMS.js will always be converted internally to UTC before stringifying to
   * avoid time zone issues.
   */
  public static toDateString(date: Date|Moment|number) {
    const ret = Util.toMoment(date);
    if (ret) {
      return ret.utc().format(dateFormat);
    } else {
      return undefined;
    }
  }

  /**
   * Retrieve the matching key (regardless of case) in the given search object.
   * @param key the key to search for
   * @param search the object to search
   */
  public static insensitiveKey(key: string, search: { [key: string]: any }) {
    if (!key || !search) {
      return;
    }
    for (const k in search) {
      if (k && k.toLowerCase() === key.toLowerCase()) {
        return k;
      }
    }
  }

  /**
   * Retrieve the value for the matching key (regardless of case) in the given search.
   * @param key the key to search for
   * @param search the object to search
   */
  public static insensitiveValue(key: string, search: { [key: string]: any }) {
    if (!key || !search) {
      return;
    }
    const k = Util.insensitiveKey(key, search);
    return k ? search[k] : undefined;
  }

}
