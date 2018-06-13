import {IHasUrlValue} from '../api/IHasUrlValue';
import {OnmsEnum} from '../internal/OnmsEnum';

/**
 * Represents an OpenNMS alarm type.
 * @module OnmsAlarmType
 */
export class OnmsAlarmType extends OnmsEnum<number> implements IHasUrlValue {
  /** The stringified value of this alarm type as an OpenNMS URL parameter. */
  public get urlValue() {
    return String(this.id);
  }
}

const AlarmTypes = {
  /** Possible Resolution */
  1: new OnmsAlarmType(1, 'possible resolution'),
  /** Resolution Event */
  2: new OnmsAlarmType(2, 'resolution event'),
  /** No Possible Resolution */
  3: new OnmsAlarmType(3, 'no possible resolution'),
};

/** @hidden */
const frozen = Object.freeze(AlarmTypes);
export {frozen as AlarmTypes};
