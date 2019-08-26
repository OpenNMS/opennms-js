// @ts-ignore
import * as VersionCompare from 'version_compare';

/**
 * An OpenNMS version.
 * @category Rest API
 */
export class OnmsVersion {
  /**
   * The numeric version (ex: `19.0.0`).
   */
  public readonly version: string;

  /**
   * The internal display version.
   * @hidden
   */
  private readonly dv?: string;

  /** The display version (ex: `19.0.0-SNAPSHOT`). */
  public get displayVersion() {
    return this.dv || this.version;
  }

  /**
   * Construct a new version.
   * @param version - The numeric version.
   * @param displayVersion - The full display version
   *                         (including extra designators like `x.x.x-SNAPSHOT`).
   */
  constructor(version?: string, displayVersion?: string) {
    this.version = version || '0.0.0';
    this.dv = displayVersion;
  }

  /**
   * Returns true if this version is less than the passed version.
   */
  public lt(compare = '0.0.0') {
    return VersionCompare.lt(this.version, compare);
  }

  /**
   * Returns true if this version is less than or equal to the passed version.
   */
  public le(compare = '0.0.0') {
    return VersionCompare.lte(this.version, compare);
  }

  /**
   * Returns true if this version is equal to the passed version.
   */
  public eq(compare = '0.0.0') {
    return VersionCompare.matches(this.version, compare);
  }

  /**
   * Returns true if this version is greater than or equal to the passed version.
   */
  public ge(compare = '0.0.0') {
    return VersionCompare.gte(this.version, compare);
  }

  /**
   * Returns true if this version is greater than the passed version.
   */
  public gt(compare = '0.0.0') {
    return VersionCompare.gt(this.version, compare);
  }

  /**
   * Whether this version object is the same as another.
   */
  public equals(that: OnmsVersion) {
    return that &&
      this.version === that.version &&
      this.displayVersion === that.displayVersion;
  }

  /**
   * Create a new version object from this existing one.
   */
  public clone() {
    return new OnmsVersion(this.version, this.dv);
  }

  /** A human-readable representation of this version. */
  public toString() {
    return 'OnmsVersion[version=' + this.version + ',displayVersion=' + this.displayVersion + ']';
  }
}
