import {OnmsEnum} from '../internal/OnmsEnum';
/**
 * Represents an OpenNMS severity.
 * @module OnmsSeverity
 */ /** */
export class OnmsSeverity extends OnmsEnum {
}

/* tslint:disable:object-literal-sort-keys */
/** @hidden */
export const SEVERITIES = Object.freeze({
  INDETERMINATE: new OnmsSeverity(1, 'INDETERMINATE'),
  CLEARED: new OnmsSeverity(2, 'CLEARED'),
  NORMAL: new OnmsSeverity(3, 'NORMAL'),
  WARNING: new OnmsSeverity(4, 'WARNING'),
  MINOR: new OnmsSeverity(5, 'MINOR'),
  MAJOR: new OnmsSeverity(6, 'MAJOR'),
  CRITICAL: new OnmsSeverity(7, 'CRITICAL'),
});
