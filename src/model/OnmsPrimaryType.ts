import {IHasUrlValue} from '../api/IHasUrlValue';

import {OnmsEnum, forId, forLabel} from '../internal/OnmsEnum';

/**
 * Represents an OpenNMS "SNMP primary" type.
 * @category Model
 */
export class OnmsPrimaryType extends OnmsEnum<string> implements IHasUrlValue {
  /** Given an ID, return the matching primary type object. */
  public static forId(id?: string) {
    return forId(PrimaryTypes, id);
  }

  /** Given a label, return the matching primary type object. */
  public static forLabel(label?: string) {
    return forLabel(PrimaryTypes, label);
  }

  /** Whether or not the interface is a primary SNMP interface. */
  public isPrimary() {
    return this.id === 'P';
  }

  /** @inheritdoc */
  public get urlValue() {
    return this.id;
  }
}

/* tslint:disable:object-literal-sort-keys */
/**
 * Contains constant instances of all primary SNMP types.
 * @category Model
 */
const PrimaryTypes = {
  /** Primary SNMP interface */
  PRIMARY: new OnmsPrimaryType('P', 'PRIMARY'),
  /** Secondary SNMP interface */
  SECONDARY: new OnmsPrimaryType('S', 'SECONDARY'),
  /** SNMP interface is not eligible for collection */
  NOT_ELIGIBLE: new OnmsPrimaryType('N', 'NOT_ELIGIBLE'),
};

/** @hidden */
const frozen = Object.freeze(PrimaryTypes);
export {frozen as PrimaryTypes};
