import {IHasUrlValue} from '../api/IHasUrlValue';

import {OnmsEnum, forId, forLabel} from '../internal/OnmsEnum';

/**
 * Represents an OpenNMS node label source.
 * @module OnmsNodeLabelSource
 */
export class OnmsNodeLabelSource extends OnmsEnum<string> implements IHasUrlValue {
  /** Given an ID, return the matching node label source object. */
  public static forId(id: string) {
    return forId(NodeLabelSources, id);
  }

  /** Given a label, return the matching node label source object. */
  public static forLabel(label: string) {
    return forLabel(NodeLabelSources, label);
  }

  /** The stringified value of this node label source as an OpenNMS URL parameter. */
  public get urlValue() {
    return this.id;
  }
}

/* tslint:disable:object-literal-sort-keys */
const NodeLabelSources = {
  /** Node label is set by the user. */
  USER: new OnmsNodeLabelSource('U', 'USER'),
  /** Node label was retrieved from NETBIOS/Windows */
  NETBIOS: new OnmsNodeLabelSource('N', 'NETBIOS'),
  /** Node label is the node's hostname */
  HOSTNAME: new OnmsNodeLabelSource('H', 'HOSTNAME'),
  /** Node label is the node's SNMP sysname */
  SYSNAME: new OnmsNodeLabelSource('S', 'SYSNAME'),
  /** Node label is the node's primary IP address */
  ADDRESS: new OnmsNodeLabelSource('A', 'ADDRESS'),
  /** Node label source is unknown */
  UNKNOWN: new OnmsNodeLabelSource(' ', 'UNKNOWN'),
};

/** @hidden */
const frozen = Object.freeze(NodeLabelSources);
export {frozen as NodeLabelSources};
