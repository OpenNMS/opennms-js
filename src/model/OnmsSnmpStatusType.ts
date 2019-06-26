import {IHasUrlValue} from '../api/IHasUrlValue';

import {OnmsEnum, forId, forLabel} from '../internal/OnmsEnum';

/**
 * Represents an OpenNMS SNMP admin/oper status type.
 * @module OnmsSnmpStatusType
 */
export class OnmsSnmpStatusType extends OnmsEnum<number> implements IHasUrlValue {
  /** Given an ID, return the matching snmp status type object. */
  public static forId(id?: number) {
    return forId(SnmpStatusTypes, id);
  }

  /** Given a label, return the matching snmp status type object. */
  public static forLabel(label?: string) {
    return forLabel(SnmpStatusTypes, label);
  }

  /** @inheritdoc */
  public get urlValue() {
    return String(this.id);
  }
}

/* tslint:disable:object-literal-sort-keys */
const SnmpStatusTypes = {
  /** Device is up */
  1: new OnmsSnmpStatusType(1, 'UP'),
  /** Device is down */
  2: new OnmsSnmpStatusType(2, 'DOWN'),
  /** Device is in "testing" mode */
  3: new OnmsSnmpStatusType(3, 'TESTING'),
};

/** @hidden */
const frozen = Object.freeze(SnmpStatusTypes);
export {frozen as SnmpStatusTypes};
