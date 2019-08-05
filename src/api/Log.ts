// tslint:disable:no-empty no-console variable-name

import chalk from 'chalk';

/**
 * Simple logger used for both CLI and browser use.
 * @module Logger
 */
export class Logger {
  /** The actual "console" implementation to use. */
  private impl: Console = console;

  /**
   * Whether debugging is enabled.
   * @hidden
   */
  private _debug?: boolean;

  /**
   * Whether quiet (error-only) is enabled.
   * @hidden
   */
  private _quiet?: boolean;

  /**
   * Whether silent (no output) is enabled.
   * @hidden
   */
  private _silent?: boolean;

  /**
   * Clear the console.
   */
  public clear() {
    this.impl.clear();
  }

  /**
   * Standard console logging.
   * @param parms logging parameters
   */
  public log(...parms: any[]) {
    if (!this._silent) {
      this.impl.log(...parms);
    }
  }

  /**
   * Chatty debug logging.  Enabled only if debug is enabled.
   * @param parms logging parameters
   */
  public trace(...parms: any[]) {
    if (this._debug) {
      this.impl.trace(chalk.gray(...parms));
    }
  }

  /**
   * Normal debug logging.  Enabled only if debug is enabled.
   * @param parms logging parameters
   */
  public debug(...parms: any[]) {
    if (this._debug) {
      this.impl.debug(chalk.gray(...parms));
    }
  }

  /**
   * Info logging.  Enabled by default.
   * @param parms logging parameters
   */
  public info(...parms: any[]) {
    if (!this._quiet && !this._silent) {
      this.impl.info(...parms);
    }
  }

  /**
   * Warning logging. Enabled by default.
   * @param parms logging parameters
   */
  public warn(...parms: any[]) {
    if (!this._quiet && !this._silent) {
      this.impl.warn(chalk.yellow(...parms));
    }
  }

  /**
   * Error logging. Enabled unless in silent mode.
   * @param parms logging parameters
   */
  public error(...parms: any[]) {
    if (!this._silent) {
      this.impl.error(chalk.red(...parms));
    }
  }

  /**
   * "Fatal" logging. Enabled unless in silent mode.
   * @param parms logging parameters
   */
  public fatal(...parms: any[]) {
    if (!this._silent) {
      this.impl.error(chalk.bold.red(...parms));
    }
  }

  /**
   * Turn on all logging.
   */
  public setDebug() {
    this._debug = true;
    this._quiet = false;
    this._silent = false;
  }

  /**
   * Reset logging to info.
   */
  public setInfo() {
    this._debug = false;
    this._quiet = false;
    this._silent = false;
  }

  /**
   * Turn off all logging other than error.
   */
  public setQuiet() {
    this._debug = false;
    this._quiet = true;
    this._silent = false;
  }

  /**
   * Turn off all logging.
   */
  public setSilent() {
    this._debug = false;
    this._quiet = true;
    this._silent = true;
  }
}

export const log = new Logger();
