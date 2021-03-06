import {IHasUrlValue} from '../api/IHasUrlValue';

/**
 * Represents a physical (MAC) address.
 * @category Model
 */
export class PhysAddr implements IHasUrlValue {
  /** The MAC address string. */
  public addr: string;

  constructor(addr: string) {
    this.addr = addr.toUpperCase().replace(/[^0-9A-F]/g, '');
  }

  /** A human-readable string suitable for display. */
  public toString() {
    const asArray = this.addr.split('');
    if (asArray.length === 12) {
      return asArray[0] + asArray[1] + ':' +
        asArray[2] + asArray[3] + ':' +
        asArray[4] + asArray[5] + ':' +
        asArray[6] + asArray[7] + ':' +
        asArray[8] + asArray[9] + ':' +
        asArray[10] + asArray[11];
    } else {
      return this.addr;
    }
  }

  /** @inheritdoc */
  public get urlValue() {
    return this.toString();
  }
}
