import {OnmsVersion} from '../api/OnmsVersion';
import {ServerType} from '../api/Constants';

import Enum from 'es6-enum';

/**
 * A class that represents the capabilities an OpenNMS server has and other information about it.
 * @module ServerMetadata
 */ /** */
export class ServerMetadata {
  /** the version of the server */
  public version: OnmsVersion;

  /** the type of server (Horizon, Meridian) */
  public type: Enum;

  /**
   * Construct a ServerMetadata object.
   * @constructor
   * @param version the version of the server
   * @param type the type of server (Horizon, Meridian)
   */
  constructor(version?: OnmsVersion, type?: Enum) {
    this.version = version;
    this.type = type;
  }
}
