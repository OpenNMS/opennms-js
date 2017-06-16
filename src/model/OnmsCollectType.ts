import {OnmsEnum, forId, forLabel} from '../internal/OnmsEnum';

/**
 * Represents an OpenNMS SNMP interface "should collect" type.
 * @module OnmsCollectType
 */ /** */
export class OnmsCollectType extends OnmsEnum<string> {
  /** given an ID, return the matching collect type object */
  public static forId(id: string) {
    return forId(CollectTypes, id);
  }

  /** given a label, return the matching collect type object */
  public static forLabel(label: string) {
    return forLabel(CollectTypes, label);
  }

  /** whether or not collection is enabled on the SNMP interface */
  public isCollectionEnabled() {
    return this.id === 'C' || this.id === 'UC';
  }
}

/* tslint:disable:object-literal-sort-keys */
/** @hidden */
export const CollectTypes = Object.freeze({
  COLLECT: new OnmsCollectType('C', 'COLLECT'),
  FORCE_COLLECT: new OnmsCollectType('UC', 'FORCE_COLLECT'),
  DO_NOT_COLLECT: new OnmsCollectType('N', 'DO_NOT_COLLECT'),
  FORCE_DO_NOT_COLLECT: new OnmsCollectType('UN', 'FORCE_DO_NOT_COLLECT'),
});
