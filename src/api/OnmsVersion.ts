/**
 * An OpenNMS version.
 * @module OnmsVersion
 */ /** */
export class OnmsVersion {
  /** the display version */
  public displayVersion: string;

  /** the numeric version (x.x.x format) */
  public version: string;

  /**
   * construct a new version
   * @param version the numeric version (x.x.x format)
   * @param displayVersion the full version (including, eg, x.x.x-SNAPSHOT)
   */
  constructor(version: string, displayVersion?: string) {
    this.version = version;
    this.displayVersion = displayVersion || version;
  }
}
