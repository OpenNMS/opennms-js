import {Address4, Address6} from 'ip-address';

/**
 * A utility class for random stuff.
 * @module Util
 */ /** */
export class Util {

  /**
   * Convert an IP address string to an [[Address4]] or [[Address6]] object.
   */
  public static toIPAddress(addr?: string) {
    if (addr) {
      if (addr.indexOf(':') >= 0) {
        return new Address6(addr);
      } else {
        return new Address4(addr);
      }
    }
    return undefined;
  }
}
