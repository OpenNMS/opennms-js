import {IHasUrlValue} from '../api/IHasUrlValue';

import {OnmsEnum} from '../internal/OnmsEnum';
/**
 * Represents an OpenNMS severity.
 * @module OnmsSeverity
 */
export class OnmsSeverity extends OnmsEnum<number> implements IHasUrlValue {
  /** The stringified value of this severity as an OpenNMS URL parameter. */
  public get urlValue() {
    return this.label;
  }
}

/* tslint:disable:object-literal-sort-keys */
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
