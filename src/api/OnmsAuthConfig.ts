/**
 * Represents server authentication config.
 * @module OnmsAuthConfig
 */ /** */
export class OnmsAuthConfig {
  /** The password to authenticate with */
  public password: string;

  /** The username to connect as */
  public username: string;

  /**
   * Construct an auth configuration object.
   * @constructor
   */
  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }
}
