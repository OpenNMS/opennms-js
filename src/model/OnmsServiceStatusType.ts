import {OnmsEnum, forId, forLabel} from '../internal/OnmsEnum';

/**
 * Represents an OpenNMS monitored service status type.
 * @module OnmsServiceStatusType
 */
export class OnmsServiceStatusType extends OnmsEnum<string> {
  /** Given an ID, return the matching service status type object. */
  public static forId(id: string) {
    return forId(ServiceStatusTypes, id);
  }

  /** Given a label, return the matching service status type object. */
  public static forLabel(label: string) {
    return forLabel(ServiceStatusTypes, label);
  }

  /** Whether or not the service is managed. */
  public isManaged() {
    return this.id === 'A';
  }
}

/* tslint:disable:object-literal-sort-keys */
const ServiceStatusTypes = {
  /** Service is managed */
  MANAGED: new OnmsServiceStatusType('A', 'MANAGED'),
  /** Service is unmanaged */
  UNMANAGED: new OnmsServiceStatusType('U', 'UNMANAGED'),
  /** Service has been deleted */
  DELETED: new OnmsServiceStatusType('D', 'DELETED'),
  /** User has forced the service to be unmanaged */
  FORCED_UNMANAGED: new OnmsServiceStatusType('F', 'FORCED_UNMANAGED'),
  /** Service is not monitored */
  NOT_MONITORED: new OnmsServiceStatusType('N', 'NOT_MONITORED'),
  /** Service is temporarily unmanaged, rescan to resume */
  RESCAN_TO_RESUME: new OnmsServiceStatusType('R', 'RESCAN_TO_RESUME'),
  /** Service is managed, rescan to suspend monitoring */
  RESCAN_TO_SUSPEND: new OnmsServiceStatusType('S', 'RESCAN_TO_SUSPEND'),
  /** Service should only be monitored from remote locations */
  REMOTELY_MONITORED: new OnmsServiceStatusType('X', 'REMOTELY_MONITORED'),
};

/** @hidden */
const frozen = Object.freeze(ServiceStatusTypes);
export {frozen as ServiceStatusTypes};
