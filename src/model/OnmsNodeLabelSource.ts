import {OnmsEnum, forId, forLabel} from '../internal/OnmsEnum';

/**
 * Represents an OpenNMS node label source.
 * @module OnmsNodeLabelSource
 */ /** */
export class OnmsNodeLabelSource extends OnmsEnum<string> {
  /** given an ID, return the matching node label source object */
  public static forId(id: string) {
    return forId(NodeLabelSources, id);
  }

  /** given a label, return the matching node label source object */
  public static forLabel(label: string) {
    return forLabel(NodeLabelSources, label);
  }
}

/* tslint:disable:object-literal-sort-keys */
/** @hidden */
export const NodeLabelSources = Object.freeze({
  USER: new OnmsNodeLabelSource('U', 'USER'),
  NETBIOS: new OnmsNodeLabelSource('N', 'NETBIOS'),
  HOSTNAME: new OnmsNodeLabelSource('H', 'HOSTNAME'),
  SYSNAME: new OnmsNodeLabelSource('S', 'SYSNAME'),
  ADDRESS: new OnmsNodeLabelSource('A', 'ADDRESS'),
  UNKNOWN: new OnmsNodeLabelSource(' ', 'UNKNOWN'),
});
