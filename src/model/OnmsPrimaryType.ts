import {OnmsEnum, forId, forLabel} from '../internal/OnmsEnum';

/**
 * Represents an OpenNMS "SNMP primary" type.
 * @module OnmsPrimaryType
 */ /** */
export class OnmsPrimaryType extends OnmsEnum<string> {
  public static forId(id: string) {
    return forId(OnmsPrimaryTypes, id);
  }

  public static forLabel(label: string) {
    return forLabel(OnmsPrimaryTypes, label);
  }

  public isPrimary() {
    return this.id === 'P';
  }
}

/* tslint:disable:object-literal-sort-keys */
/** @hidden */
export const OnmsPrimaryTypes = Object.freeze({
  PRIMARY: new OnmsPrimaryType('P', 'PRIMARY'),
  SECONDARY: new OnmsPrimaryType('S', 'SECONDARY'),
  NOT_ELIGIBLE: new OnmsPrimaryType('N', 'NOT_ELIGIBLE'),
});
