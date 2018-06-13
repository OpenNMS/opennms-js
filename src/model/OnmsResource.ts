import {IHasUrlValue} from '../api/IHasUrlValue';

import {RrdGraphAttribute} from './RrdGraphAttribute';

/**
 * Represents an OpenNMS node resource.
 * @module OnmsResource
 */
export class OnmsResource implements IHasUrlValue {
  /** the resource ID */
  public id: string;

  /** the resource's label */
  public label: string;

  /** the resource's name */
  public name: string;

  /** the type of resource */
  public typeLabel: string;

  /** the link to the resource in the OpenNMS web UI */
  public link: string;

  /** the resource's parent resource */
  public parentId: string;

  /** the children of this resource */
  public children: OnmsResource[] = [];

  /** string property attributes */
  public stringPropertyAttributes: { [s: string]: string; } = {};

  /** external value attributes */
  public externalValueAttributes: { [s: string]: string; } = {};

  /** RRD graph attributes */
  public rrdGraphAttributes: { [s: string]: RrdGraphAttribute; } = {};

  /** graph names */
  public graphNames: string[] = [];

  /** The stringified value of this resource as an OpenNMS URL parameter. */
  public get urlValue() {
    return String(this.id);
  }
}
