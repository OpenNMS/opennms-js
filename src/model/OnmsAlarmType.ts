import {OnmsEnum} from '../internal/OnmsEnum';

/**
 * Represents an OpenNMS alarm type.
 * @module OnmsAlarmType
 */ /** */
export class OnmsAlarmType extends OnmsEnum<number> {
}

/** @hidden */
export const AlarmTypes = Object.freeze({
  1: new OnmsAlarmType(1, 'possible resolution'),
  2: new OnmsAlarmType(2, 'resolution event'),
  3: new OnmsAlarmType(3, 'no possible resolution'),
});
