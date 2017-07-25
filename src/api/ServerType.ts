import {OnmsEnum} from '../internal/OnmsEnum';

/**
 * Represents an OpenNMS server type.
 * @module ServerType
 */
export class ServerType extends OnmsEnum<number> {
}

const ServerTypes = {
  /** OpenNMS Horizon */
  HORIZON: new ServerType(1, 'HORIZON'),

  /** OpenNMS Meridian */
  MERIDIAN: new ServerType(2, 'MERIDIAN'),
};

/** @hidden */
const frozen = Object.freeze(ServerTypes);
export {frozen as ServerTypes};
