import {OnmsVersion} from '../api/OnmsVersion';
import {ServerType, ServerTypes} from '../api/ServerType';
import {TicketerConfig} from './TicketerConfig';

/**
 * A class that represents the capabilities an OpenNMS server has and other information about it.
 * @module ServerMetadata
 */
export class ServerMetadata {
  /** The version of the server. */
  public version: OnmsVersion;

  /** The type of server (Horizon, Meridian). */
  public type: ServerType;

  /** The ticketer config. Requires at least version 21.0.0 of OpenNMS. */
  public ticketerConfig: TicketerConfig;

  /**
   * Construct a ServerMetadata object.
   * @constructor
   * @param version the version of the server
   * @param type the type of server (Horizon, Meridian)
   */
  constructor(version?: string | OnmsVersion, type?: ServerType) {
    if (version instanceof OnmsVersion) {
      this.version = version || new OnmsVersion('0.0.0');
    } else {
      this.version = new OnmsVersion(version || '0.0.0');
    }
    this.type = type || ServerTypes.HORIZON;
  }

  /** Can you ack alarms through ReST? */
  public ackAlarms() {
    return this.version.ge('14.0.0');
  }

  /** Does this server support flow data? */
  public flows() {
    if (this.type && this.type === ServerTypes.MERIDIAN) {
      return this.version.ge('2019.0.0');
    } else {
      return this.version.ge('22.0.0');
    }
  }

  /** Does this server support graphs? (ie, the measurements API) */
  public graphs() {
    if (this.type && this.type === ServerTypes.MERIDIAN) {
      return this.version.ge('2016.1.0');
    } else {
      return this.version.ge('16.0.0');
    }
  }

  /** Does this server support outage summaries? */
  public outageSummaries() {
    return this.version.ge('14.0.3');
  }

  /** Does this server support setting the location on a node? */
  public setNodeLocation() {
    return this.version.ge('15.0.2');
  }

  /** Is it safe to use JSON for most operations? */
  public useJson() {
    if (this.type && this.type === ServerTypes.MERIDIAN) {
      return this.version.ge('2017.0.0');
    } else {
      return this.version.ge('19.0.0');
    }
  }

  /** Does this server support situations? */
  public situations() {
    if (this.type && this.type === ServerTypes.MERIDIAN) {
      return this.version.ge('2019.0.0');
    } else {
      return this.version.ge('23.0.0');
    }
  }

  /** Does this server support ticketer configuration metadata? */
  public ticketer() {
    if (this.type && this.type === ServerTypes.MERIDIAN) {
      return this.version.ge('2017.0.0');
    } else {
      return this.version.ge('21.0.0');
    }
  }

  /** What version of the ReST API does this server support? */
  public apiVersion() {
    if (this.type && this.type === ServerTypes.MERIDIAN) {
      return this.version.ge('2017.1.0') ? 2 : 1;
    } else {
      return this.version.ge('20.1.0') ? 2 : 1;
    }
  }

  /** Does this version support the drift 2.0 flows enhancements? */
  public enhancedFlows() {
    if (this.type && this.type === ServerTypes.MERIDIAN) {
      return this.version.ge('2019.0.0');
    } else {
      return this.version.ge('25.0.0');
    }
  }

  /** Returns a convenient data structure with all capabilities listed. */
  public capabilities(): {[key: string]: any} {
    return {
      ackAlarms: this.ackAlarms(),
      apiVersion: this.apiVersion(),
      enhancedFlows: this.enhancedFlows(),
      flows: this.flows(),
      graphs: this.graphs(),
      outageSummaries: this.outageSummaries(),
      setNodeLocation: this.setNodeLocation(),
      situations: this.situations(),
      ticketer: this.ticketer(),
      type: (this.type === ServerTypes.MERIDIAN ? 'Meridian' : 'Horizon'),
    };
  }

  /** A human-readable representation of the metadata. */
  public toString() {
    return 'ServerMetadata[version=' + this.version.toString()
      + ',apiVersion=' + this.apiVersion()
      + ',type=' + this.type.toString()
      + ',ackAlarms=' + this.ackAlarms()
      + ',enhancedFlows=' + this.enhancedFlows()
      + ',flows=' + this.flows()
      + ',graphs=' + this.graphs()
      + ',outageSummaries=' + this.outageSummaries()
      + ',setNodeLocation=' + this.setNodeLocation()
      + ',situations=' + this.situations()
      + ',ticketer=' + this.ticketer()
      + ']';
  }

  /**
   * Whether this metadata object is the same as another.
   */
  public equals(that?: ServerMetadata) {
    return that &&
      (this.version === that.version || (this.version && this.version.equals(that.version))) &&
      (this.type === that.type || this.type.id === that.type.id) &&
      (this.ticketerConfig === that.ticketerConfig ||
        (this.ticketerConfig && this.ticketerConfig.equals(that.ticketerConfig)));
  }

  /**
   * Create a new metadata object from this existing one.
   */
  public clone() {
    return new ServerMetadata(this.version.clone(), this.type);
  }
}
