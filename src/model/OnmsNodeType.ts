import {IHasUrlValue} from '../api/IHasUrlValue';

import {OnmsEnum, forId, forLabel} from '../internal/OnmsEnum';

/**
 * Represents an OpenNMS node type.
 * @module OnmsNodeType
 */
export class OnmsNodeType extends OnmsEnum<string> implements IHasUrlValue {
  /** Given an ID (A, D, etc.), return the corresponding node type object. */
  public static forId(id: string) {
    return forId(NodeTypes, id);
  }

  /** Given a label (ACTIVE, etc.), return the corresponding node type object. */
  public static forLabel(label: string) {
    return forLabel(NodeTypes, label);
  }

  public get urlValue() {
    return this.id;
  }
}

/* tslint:disable:object-literal-sort-keys */
const NodeTypes = {
  /** Node is active */
  ACTIVE: new OnmsNodeType('A', 'ACTIVE'),
  /** Node is disabled */
  DELETED: new OnmsNodeType('D', 'DELETED'),
  /** Node state is unknown */
  UNKNOWN: new OnmsNodeType(' ', 'UNKNOWN'),
};

/** @hidden */
const frozen = Object.freeze(NodeTypes);
export {frozen as NodeTypes};
