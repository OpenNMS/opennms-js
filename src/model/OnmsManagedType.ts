import {IHasUrlValue} from '../api/IHasUrlValue';

import {OnmsEnum, forId, forLabel} from '../internal/OnmsEnum';

/**
 * Represents an OpenNMS node "is managed" type.
 * @module OnmsManagedType
 */
export class OnmsManagedType extends OnmsEnum<string> implements IHasUrlValue {
  /** Given an ID, return the matching managed type object. */
  public static forId(id?: string) {
    return forId(ManagedTypes, id);
  }

  /** Given a label, return the matching managed type object. */
  public static forLabel(label?: string) {
    return forLabel(ManagedTypes, label);
  }

  /** Whether or not the node is managed. */
  public isManaged() {
    return this.id === 'M';
  }

  /** @inheritdoc */
  public get urlValue() {
    return this.id;
  }
}

/* tslint:disable:object-literal-sort-keys */
const ManagedTypes = {
  /** Interface is managed */
  MANAGED: new OnmsManagedType('M', 'MANAGED'),
  /** Interface is an alias */
  ALIAS: new OnmsManagedType('A', 'ALIAS'),
  /** Interface is deleted */
  DELETED: new OnmsManagedType('D', 'DELETED'),
  /** Interface is not managed */
  UNMANAGED: new OnmsManagedType('U', 'UNMANAGED'),
  /** User has forced management to be disabled */
  FORCE_UNMANAGED: new OnmsManagedType('F', 'FORCE_UNMANAGED'),
  /** Interface is not polled */
  NOT_POLLED: new OnmsManagedType('N', 'NOT_POLLED'),
  /** Interface should only be polled remotely */
  REMOTE_ONLY: new OnmsManagedType('X', 'REMOTE_ONLY'),
};

/** @hidden */
const frozen = Object.freeze(ManagedTypes);
export {frozen as ManagedTypes};
