// tslint:disable:no-empty no-console variable-name

import pc from 'picocolors';

const arrayToString = (parms: any[]) => {
  return parms
           .map(val => {
             if (val === undefined) {
               return '';
             }
             if (val instanceof String || typeof val === 'string') {
               return val;
             }
             return JSON.stringify(val, null, 2)
           }).join(' ');
};

/**
 * Simple logger used for both CLI and browser use.
 * @category Internal
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
      this.impl.log(arrayToString(parms));
    }
  }

  /**
   * Chatty debug logging.  Enabled only if debug is enabled.
   * @param parms logging parameters
   */
  public trace(...parms: any[]) {
    if (this._debug) {
      this.impl.trace(pc.gray(arrayToString(parms)));
    }
  }

  /**
   * Normal debug logging.  Enabled only if debug is enabled.
   * @param parms logging parameters
   */
  public debug(...parms: any[]) {
    if (this._debug) {
      this.impl.debug(pc.gray(arrayToString(parms)));
    }
  }

  /**
   * Info logging.  Enabled by default.
   * @param parms logging parameters
   */
  public info(...parms: any[]) {
    if (!this._quiet && !this._silent) {
      this.impl.info(arrayToString(parms));
    }
  }

  /**
   * Warning logging. Enabled by default.
   * @param parms logging parameters
   */
  public warn(...parms: any[]) {
    if (!this._quiet && !this._silent) {
      this.impl.warn(pc.yellow(arrayToString(parms)));
    }
  }

  /**
   * Error logging. Enabled unless in silent mode.
   * @param parms logging parameters
   */
  public error(...parms: any[]) {
    if (!this._silent) {
      this.impl.error(pc.red(arrayToString(parms)));
    }
  }

  /**
   * "Fatal" logging. Enabled unless in silent mode.
   * @param parms logging parameters
   */
  public fatal(...parms: any[]) {
    if (!this._silent) {
      this.impl.error(pc.bold(pc.red(arrayToString(parms))));
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

/**
 * The default logging implementation.
 * Import a logger using:
 *
 * ```ts
 * import {log} from 'api/Logger';
 * ```
 *
 * @category Internal
 */
export const log = new Logger();
