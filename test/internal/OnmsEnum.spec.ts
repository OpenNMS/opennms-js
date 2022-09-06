declare const describe, beforeEach, it, expect, require;

import {forId} from '../../src/internal/OnmsEnum';
import {TroubleTicketStates} from '../../src/model/OnmsTroubleTicketState';

describe('Get enum for', () => {
  it('index 0', () => {
    const state = forId(TroubleTicketStates, 0);
    expect(state).toBe(TroubleTicketStates.OPEN);
  });
  it('undefined', () => {
    const state = forId(TroubleTicketStates, undefined);
    expect(state).toBeUndefined();
  });
  it('index 1', () => {
    const state = forId(TroubleTicketStates, 1);
    expect(state).toBe(TroubleTicketStates.CREATE_PENDING);
  });  
});

