/**
 * Represents server authentication config.
 * @module OnmsAuthConfig
 */
export class OnmsAuthConfig {
  /** The password to authenticate with. */
  public password: string;

  /** The username to connect as. */
  public username: string;

  /**
   * Construct an auth configuration object.
   * @constructor
   */
  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }

  /**
   * Whether this auth object is the same as another.
   */
  public equals(that?: OnmsAuthConfig) {
    return that &&
      this.username === that.username &&
      this.password === that.password;
  }

  /**
   * Create a new config object from this existing one.
   */
  public clone() {
    return new OnmsAuthConfig(this.username, this.password);
  }
}
