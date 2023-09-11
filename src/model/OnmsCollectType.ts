import {IHasUrlValue} from '../api/IHasUrlValue';

import {OnmsEnum, forId, forLabel} from '../internal/OnmsEnum';

/**
 * Represents an OpenNMS SNMP interface "should collect" type.
 * @category Model
 */
export class OnmsCollectType extends OnmsEnum<string> implements IHasUrlValue {
  /** given an ID, return the matching collect type object */
  public static forId(id?: string) {
    return forId(CollectTypes, id);
  }

  /** given a label, return the matching collect type object */
  public static forLabel(label?: string) {
    return forLabel(CollectTypes, label);
  }

  /** whether or not collection is enabled on the SNMP interface */
  public isCollectionEnabled() {
    return this.id === 'C' || this.id === 'UC';
  }

  /** @inheritdoc */
  public get urlValue() {
    return this.id;
  }
}

/* eslint-disable  */
/**
 * Contains constant instances of all available collect types.
 * @category Model
 */
export const CollectTypes = {
  /** Collection Enabled */
  COLLECT: new OnmsCollectType('C', 'COLLECT'),
  /** User has forced collection */
  FORCE_COLLECT: new OnmsCollectType('UC', 'FORCE_COLLECT'),
  /** Collection is disabled */
  DO_NOT_COLLECT: new OnmsCollectType('N', 'DO_NOT_COLLECT'),
  /** User has forced collection to be disabled */
  FORCE_DO_NOT_COLLECT: new OnmsCollectType('UN', 'FORCE_DO_NOT_COLLECT'),
};
Object.freeze(CollectTypes);
