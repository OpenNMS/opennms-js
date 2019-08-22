import {IHasUrlValue} from '../api/IHasUrlValue';

import {OnmsEnum, forId, forLabel} from '../internal/OnmsEnum';
/**
 * Represents an OpenNMS severity.
 * @category Model
 */
export class OnmsSeverity extends OnmsEnum<number> implements IHasUrlValue {
  /** @inheritdoc */
  public static forId(id?: string) {
    return forId(Severities, id);
  }

  /** @inheritdoc */
  public static forLabel(label?: string) {
    return forLabel(Severities, label);
  }

  /** @inheritdoc */
  public get urlValue() {
    return this.label;
  }
}

/* tslint:disable:object-literal-sort-keys */
/**
 * Contains constant instances of all severities.
 * @category Model
 */
const Severities = {
  INDETERMINATE: new OnmsSeverity(1, 'INDETERMINATE'),
  CLEARED: new OnmsSeverity(2, 'CLEARED'),
  NORMAL: new OnmsSeverity(3, 'NORMAL'),
  WARNING: new OnmsSeverity(4, 'WARNING'),
  MINOR: new OnmsSeverity(5, 'MINOR'),
  MAJOR: new OnmsSeverity(6, 'MAJOR'),
  CRITICAL: new OnmsSeverity(7, 'CRITICAL'),
};

/** @hidden */
const frozen = Object.freeze(Severities);
export {frozen as Severities};
