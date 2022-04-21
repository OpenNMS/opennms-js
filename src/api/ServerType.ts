import {OnmsEnum} from '../internal/OnmsEnum';

/**
 * Represents an OpenNMS server type.
 * @category Rest
 */
export class ServerType extends OnmsEnum<number> {
}

/**
 * Contains constant instances of all server types.
 * @category Model
 */
export const ServerTypes = {
  /** OpenNMS Horizon */
  HORIZON: new ServerType(1, 'HORIZON'),

  /** OpenNMS Meridian */
  MERIDIAN: new ServerType(2, 'MERIDIAN'),
};
Object.freeze(ServerTypes);
