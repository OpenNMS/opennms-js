import {OnmsEnum, forId, forLabel} from '../internal/OnmsEnum';

/**
 * Represents an OpenNMS "SNMP primary" type.
 * @module OnmsPrimaryType
 */ /** */
export class OnmsPrimaryType extends OnmsEnum<string> {
  /** given an ID, return the matching primary type object */
  public static forId(id: string) {
    return forId(PrimaryTypes, id);
  }

  /** given a label, return the matching primary type object */
  public static forLabel(label: string) {
    return forLabel(PrimaryTypes, label);
  }

  /** whether or not the interface is a primary SNMP interface */
  public isPrimary() {
    return this.id === 'P';
  }
}

/* tslint:disable:object-literal-sort-keys */
/** @hidden */
export const PrimaryTypes = Object.freeze({
  PRIMARY: new OnmsPrimaryType('P', 'PRIMARY'),
  SECONDARY: new OnmsPrimaryType('S', 'SECONDARY'),
  NOT_ELIGIBLE: new OnmsPrimaryType('N', 'NOT_ELIGIBLE'),
});
