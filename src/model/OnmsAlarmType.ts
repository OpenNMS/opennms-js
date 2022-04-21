import {IHasUrlValue} from '../api/IHasUrlValue';
import {OnmsEnum, forId} from '../internal/OnmsEnum';

/**
 * Represents an OpenNMS alarm type.
 * @category Model
 */
export class OnmsAlarmType extends OnmsEnum<number> implements IHasUrlValue {
  /** @inheritdoc */
  public static forId(id?: number) {
    return forId(AlarmTypes, id);
  }

  /** @inheritdoc */
  public get urlValue() {
    return String(this.id);
  }
}

/**
 * Contains constant instances of all available alarm types.
 * @category Model
 */
export const AlarmTypes = {
  /** Possible Resolution */
  1: new OnmsAlarmType(1, 'possible resolution'),
  /** Resolution Event */
  2: new OnmsAlarmType(2, 'resolution event'),
  /** No Possible Resolution */
  3: new OnmsAlarmType(3, 'no possible resolution'),
};
Object.freeze(AlarmTypes);
