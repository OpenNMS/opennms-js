import {OnmsEnum, forId, forLabel} from '../internal/OnmsEnum';

/**
 * Represents an OpenNMS SNMP admin/oper status type.
 * @module OnmsSnmpStatusType
 */ /** */
export class OnmsSnmpStatusType extends OnmsEnum<number> {
  /** given an ID, return the matching snmp status type object */
  public static forId(id: number) {
    return forId(SnmpStatusTypes, id);
  }

  /** given a label, return the matching snmp status type object */
  public static forLabel(label: string) {
    return forLabel(SnmpStatusTypes, label);
  }
}

/* tslint:disable:object-literal-sort-keys */
/** @hidden */
export const SnmpStatusTypes = Object.freeze({
  1: new OnmsSnmpStatusType(1, 'UP'),
  2: new OnmsSnmpStatusType(2, 'DOWN'),
  3: new OnmsSnmpStatusType(3, 'TESTING'),
});
