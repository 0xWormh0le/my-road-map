import {
  COMMON_LOGOUT,
} from '../../../../src/features/common/redux/constants';

import {
  logout,
  reducer,
} from '../../../../src/features/common/redux/logout';

describe('common/redux/logout', () => {
  it('returns correct action by logout', () => {
    expect(logout()).toHaveProperty('type', COMMON_LOGOUT);
  });

  it('handles action type COMMON_LOGOUT correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: COMMON_LOGOUT }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
