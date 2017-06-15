import {OnmsEnum} from '../internal/OnmsEnum';

/**
 * Represents an OpenNMS server type.
 * @module ServerType
 */ /** */
export class ServerType extends OnmsEnum<number> {
}

/** @hidden */
export const ServerTypes = Object.freeze({
  HORIZON: new ServerType(1, 'HORIZON'),
  MERIDIAN: new ServerType(2, 'MERIDIAN'),
});
