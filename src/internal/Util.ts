import {OnmsError} from '../api/OnmsError';

import {OnmsEnum} from './OnmsEnum';

import {Address4, Address6} from 'ip-address';
import {Moment} from 'moment';

/** @hidden */
// tslint:disable-next-line
const moment = require('moment');

/** @hidden */
const dateFormat = 'YYYY-MM-DDTHH:mm:ss.SSSZZ';

const compareProperty = (a: string, b: string) => {
  return (a || b) ? (!a ? -1 : !b ? 1 : a.localeCompare(b)) : 0;
};

/**
 * A utility class for random stuff.
 * @module Util
 */
export class Util {

  /**
   * Convert an IP address string to an [[Address4]] or [[Address6]] object.
   */
  public static toIPAddress(addr?: string) {
    if (addr) {
      if (addr.indexOf(':') >= 0) {
        return new Address6(addr);
      } else {
        return new Address4(addr);
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
   * Whether or not the passed object is a number.
   */
  public static isNumber(value: any) {
    return Number(parseFloat(value)) === value;
  }

  /**
   * Create a [[Moment]] from any form of date (JavaScript [[Date]], [[Moment]], or epoch).
   * [[Moment]] dates in OpenNMS.js will always be converted internally to UTC to avoid time
   * zone issues.
   */
  public static toMoment(date: Date|Moment|string|number): Moment {
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
   * Convert the given value to a number, or undefined if it cannot be converted.
   */
  public static toNumber(from: any): number|undefined {
    const ret = parseInt(from, 10);
    return isNaN(ret) ? undefined : ret;
  }

  /**
   * Sort an array of objects based on one or more sort properties.
   */
  public static sort(obj: any[], ...props) {
    if (props.length > 0) {
      obj.sort((a, b) => {
        let ret = 0;
        for (const prop of props) {
          if (Util.isNumber(a[prop]) && Util.isNumber(b[prop])) {
            ret = a[prop] - b[prop];
          } else if (a[prop] instanceof OnmsEnum && b[prop] instanceof OnmsEnum) {
            if (Util.isNumber(a[prop].index) && Util.isNumber(b[prop].index)) {
              ret = a[prop].index - b[prop].index;
            } else {
              ret = String(a[prop].index).localeCompare(String(b[prop].index));
            }
          } else {
            ret = compareProperty(a[prop], b[prop]);
          }
          if (ret !== 0) {
            break;
          }
        }
        return ret;
      });
    }
    return obj;
  }
}
