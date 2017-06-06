import {OnmsEnum} from '../internal/OnmsEnum';

/**
 * Represents an OpenNMS server type.
 * @module ServerType
 */ /** */
export class ServerType extends OnmsEnum {
}

/** @hidden */
export const SERVER_TYPES = Object.freeze({
  HORIZON: new ServerType(1, 'HORIZON'),
  MERIDIAN: new ServerType(2, 'MERIDIAN'),
});
