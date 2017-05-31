import {OnmsVersion} from '../api/OnmsVersion';
import {ServerType} from '../api/Constants';

/**
 * A class that represents the capabilities an OpenNMS server has and other information about it.
 * @module ServerMetadata
 */ /** */
export class ServerMetadata {
  /** the version of the server */
  public version: OnmsVersion;

  /** the type of server (Horizon, Meridian) */
  public type: symbol;

  /**
   * Construct a ServerMetadata object.
   * @constructor
   * @param version the version of the server
   * @param type the type of server (Horizon, Meridian)
   */
  constructor(version?: string | OnmsVersion, type?: symbol) {
    if (version instanceof OnmsVersion) {
      this.version = version;
    } else {
      this.version = new OnmsVersion(version || '0.0.0');
    }
    this.type = type || ServerType.HORIZON;
  }

  /** can you ack alarms through ReST */
  public ackAlarms() {
    return this.version.ge('14.0.0');
  }

  /** does this server support graphs (ie, the measurements API) */
  public graphs() {
    if (this.type && this.type === ServerType.MERIDIAN) {
      return this.version.ge('2016.1.0');
    } else {
      return this.version.ge('16.0.0');
    }
  }

  /** does this server support outage summaries */
  public outageSummaries() {
    return this.version.ge('14.0.3');
  }

  /** does this server support setting the location on a node */
  public setLocation() {
    return this.version.ge('15.0.2');
  }
}
