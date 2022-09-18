import { ROADMAP_SET_SELECTED_COMPETENCY } from '../../../../src/features/roadmap/redux/constants';

import {
  setSelectedCompetency,
  reducer,
} from '../../../../src/features/roadmap/redux/setSelectedCompetency';

describe('roadmap/redux/setSelectedCompetency', () => {
  it('returns correct action by setSelectedCompetency', () => {
    expect(setSelectedCompetency()).toHaveProperty('type', ROADMAP_SET_SELECTED_COMPETENCY);
  });

  it('handles action type ROADMAP_SET_SELECTED_COMPETENCY correctly', () => {
    const prevState = {};
    const state = reducer(prevState, { type: ROADMAP_SET_SELECTED_COMPETENCY });
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
