import * as VersionCompare from 'version_compare';

/**
 * An OpenNMS version.
 * @module OnmsVersion
 */ /** */
export class OnmsVersion {
  /** the numeric version (x.x.x format) */
  public version: string;

  /** the display version */
  public get displayVersion() {
    return this.dv || this.version;
  }

  public set displayVersion(displayVersion: string) {
    this.dv = displayVersion;
  }

  /** the internal display version */
  private dv: string;

  /**
   * construct a new version
   * @param version the numeric version (x.x.x format)
   * @param displayVersion the full version (including, eg, x.x.x-SNAPSHOT)
   */
  constructor(version?: string, displayVersion?: string) {
    this.version = version || '0.0.0';
    this.displayVersion = displayVersion;
  }

  /** this version is less than the passed version */
  public lt(compare = '0.0.0') {
    return VersionCompare.lt(this.version, compare);
  }

  /** this version is less than or equal to the passed version */
  public le(compare = '0.0.0') {
    return VersionCompare.lte(this.version, compare);
  }

  /** this version is equal to the passed version */
  public eq(compare = '0.0.0') {
    return VersionCompare.matches(this.version, compare);
  }

  /** this version is greater than or equal to the passed version */
  public ge(compare = '0.0.0') {
    return VersionCompare.gte(this.version, compare);
  }

  /** this version is greater than the passed version */
  public gt(compare = '0.0.0') {
    return VersionCompare.gt(this.version, compare);
  }
}
