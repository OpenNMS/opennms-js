/**
 * Represents an RRD graph definition attribute.
 * @module RrdGraphAttribute
 */
export class RrdGraphAttribute {
  /** The attribute's name. */
  public name: string;

  /** The RRD's relative path. */
  public relativePath: string;

  /** The RRD file name. */
  public rrdFile: string;
}
