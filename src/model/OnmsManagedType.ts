import {OnmsEnum, forId, forLabel} from '../internal/OnmsEnum';

/**
 * Represents an OpenNMS "is managed" type.
 * @module OnmsManagedType
 */ /** */
export class OnmsManagedType extends OnmsEnum<string> {
  public static forId(id: string) {
    return forId(OnmsManagedTypes, id);
  }

  public static forLabel(label: string) {
    return forLabel(OnmsManagedTypes, label);
  }

  public isManaged() {
    return this.id === 'M';
  }
}

/* tslint:disable:object-literal-sort-keys */
/** @hidden */
export const OnmsManagedTypes = Object.freeze({
  MANAGED: new OnmsManagedType('M', 'MANAGED'),
  ALIAS: new OnmsManagedType('A', 'ALIAS'),
  DELETED: new OnmsManagedType('D', 'DELETED'),
  UNMANAGED: new OnmsManagedType('U', 'UNMANAGED'),
  FORCE_UNMANAGED: new OnmsManagedType('F', 'FORCE_UNMANAGED'),
  NOT_POLLED: new OnmsManagedType('N', 'NOT_POLLED'),
  REMOTE_ONLY: new OnmsManagedType('X', 'REMOTE_ONLY'),
});
