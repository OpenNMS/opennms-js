import {OnmsEnum, forId, forLabel} from '../internal/OnmsEnum';

/**
 * Represents an OpenNMS node type.
 * @module OnmsNodeType
 */ /** */
export class OnmsNodeType extends OnmsEnum<string> {
  public static forId(id: string) {
    return forId(OnmsNodeTypes, id);
  }

  public static forLabel(label: string) {
    return forLabel(OnmsNodeTypes, label);
  }
}

/* tslint:disable:object-literal-sort-keys */
/** @hidden */
export const OnmsNodeTypes = Object.freeze({
  ACTIVE: new OnmsNodeType('A', 'ACTIVE'),
  DELETED: new OnmsNodeType('D', 'DELETED'),
  UNKNOWN: new OnmsNodeType(' ', 'UNKNOWN'),
});
