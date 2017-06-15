import {OnmsEnum, forId, forLabel} from '../internal/OnmsEnum';

/**
 * Represents an OpenNMS monitored service status type.
 * @module OnmsServiceStatusType
 */ /** */
export class OnmsServiceStatusType extends OnmsEnum<string> {
  public static forId(id: string) {
    return forId(OnmsServiceStatusTypes, id);
  }

  public static forLabel(label: string) {
    return forLabel(OnmsServiceStatusTypes, label);
  }

  public isManaged() {
    return this.id === 'A';
  }
}

/* tslint:disable:object-literal-sort-keys */
/** @hidden */
export const OnmsServiceStatusTypes = Object.freeze({
  MANAGED: new OnmsServiceStatusType('A', 'MANAGED'),
  UNMANAGED: new OnmsServiceStatusType('U', 'UNMANAGED'),
  DELETED: new OnmsServiceStatusType('D', 'DELETED'),
  FORCED_UNMANAGED: new OnmsServiceStatusType('F', 'FORCED_UNMANAGED'),
  NOT_MONITORED: new OnmsServiceStatusType('N', 'NOT_MONITORED'),
  RESCAN_TO_RESUME: new OnmsServiceStatusType('R', 'RESCAN_TO_RESUME'),
  RESCAN_TO_SUSPEND: new OnmsServiceStatusType('S', 'RESCAN_TO_SUSPEND'),
  REMOTELY_MONITORED: new OnmsServiceStatusType('X', 'REMOTELY_MONITORED'),
});
