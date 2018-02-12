import {IHasUrlValue} from '../api/IHasUrlValue';

import {OnmsEnum} from '../internal/OnmsEnum';

/**
 * Represents an OpenNMS trouble ticket state.
 * @module OnmsTroubleTicketState
 */
export class OnmsTroubleTicketState extends OnmsEnum<number> implements IHasUrlValue {
  public get urlValue() {
    return this.label;
  }
}

/* tslint:disable:object-literal-sort-keys */
const TroubleTicketStates = {
  /** Trouble ticket is currently open */
  OPEN: new OnmsTroubleTicketState(0, 'OPEN'),
  /** Trouble ticket is being created */
  CREATE_PENDING: new OnmsTroubleTicketState(1, 'CREATE_PENDING'),
  /** Trouble ticket creation has failed */
  CREATE_FAILED: new OnmsTroubleTicketState(2, 'CREATE_FAILED'),
  /** Trouble ticket is pending an update from the remote helpdesk system */
  UPDATE_PENDING: new OnmsTroubleTicketState(3, 'UPDATE_PENDING'),
  /** Updating ticket state from the remote helpdesk system failed */
  UPDATE_FAILED: new OnmsTroubleTicketState(4, 'UPDATE_FAILED'),
  /** Trouble ticket has been closed */
  CLOSED: new OnmsTroubleTicketState(5, 'CLOSED'),
  /** Trouble ticket is pending closure in the remote helpdesk system */
  CLOSE_PENDING: new OnmsTroubleTicketState(6, 'CLOSE_PENDING'),
  /** An attempt to mark the ticket closed in the remote helpdesk system has failed */
  CLOSE_FAILED: new OnmsTroubleTicketState(7, 'CLOSE_FAILED'),
  /** Trouble ticket has been resolved */
  RESOLVED: new OnmsTroubleTicketState(8, 'RESOLVED'),
  /** Trouble ticket is in the process of being marked resolved */
  RESOLVE_PENDING: new OnmsTroubleTicketState(9, 'RESOLVE_PENDING'),
  /** Resolving ticket in the remote helpdesk system has failed */
  RESOLVE_FAILED: new OnmsTroubleTicketState(10, 'RESOLVE_FAILED'),
  /** Trouble ticket has been canceled */
  CANCELLED: new OnmsTroubleTicketState(11, 'CANCELLED'),
  /** Trouble ticket is in the process of being marked as canceled */
  CANCEL_PENDING: new OnmsTroubleTicketState(12, 'CANCEL_PENDING'),
  /** An attempt to mark the ticket canceled in the remote helpdesk system has failed */
  CANCEL_FAILED: new OnmsTroubleTicketState(13, 'CANCEL_FAILED'),
};

/** @hidden */
const frozen = Object.freeze(TroubleTicketStates);
export {frozen as TroubleTicketStates};
