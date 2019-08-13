/**
 * Represents server authentication config.
 * @module OnmsAuthConfig
 */
export class OnmsAuthConfig {
  /** The password to authenticate with. */
  public readonly password: string | null;

  /** The username to connect as. */
  public readonly username: string | null;

  /**
   * Construct an auth configuration object.
   * @constructor
   */
  constructor(username?: string | null, password?: string | null) {
    this.username = username || null;
    this.password = password || null;
    Object.freeze(this);
  }

  /**
   * Whether this auth object is the same as another.
   */
  public equals(that?: OnmsAuthConfig | null) {
    return that
      && this.username === that.username
      && this.password === that.password;
  }

  /**
   * Create a new config object from this existing one.
   */
  public clone() {
    return new OnmsAuthConfig(this.username, this.password);
  }
}
