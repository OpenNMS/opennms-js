import {IHasUrlValue} from '../api/IHasUrlValue';

import {Util} from '../internal/Util';

/**
 * Represents an OpenNMS event or alarm parameter.
 * @category Model
 */
export class OnmsParm implements IHasUrlValue {
  /** the name of the parm */
  public name: string;

  /** the raw parm value from the server (as a string) */
  public valueString: string;

  /** the parm type */
  public type: string;

  /** the value coerced to a native type (if possible) */
  public get value() {
    switch (this.type) {
      // numeric types
      case 'Counter32':
      case 'Counter64':
      case 'Gauge32':
      case 'Gauge64':
      case 'Int32':
      case 'Int64':
      case 'TimeTicks':
        return parseInt(this.type, 10);

      // other types
      case 'Null': return null;
      case 'IpAddress': return Util.toIPAddress(this.valueString);

      // everything else is a string
      case 'ObjectIdentifier':
      case 'OctetString':
      case 'Opaque':
      case 'string':
      default: return this.valueString;
    }
  }

  constructor(name: string, type: string, value: string) {
    this.name = name;
    this.type = type;
    this.valueString = value;
  }

  /**
   * The string value of this parameter.
   */
  public toString(): string {
    return this.valueString;
  }

  /**
   * The value of this parameter to be used when serializing to a URL.
   */
  public get urlValue() {
    return this.valueString;
  }
}
