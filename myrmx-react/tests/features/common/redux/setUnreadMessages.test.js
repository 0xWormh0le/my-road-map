import {
  COMMON_SET_UNREAD_MESSAGES,
} from '../../../../src/features/common/redux/constants';

import {
  setUnreadMessages,
  reducer,
} from '../../../../src/features/common/redux/setUnreadMessages';

describe('common/redux/setUnreadMessages', () => {
  it('returns correct action by setUnreadMessages', () => {
    expect(setUnreadMessages()).toHaveProperty('type', COMMON_SET_UNREAD_MESSAGES);
  });

  it('handles action type COMMON_SET_UNREAD_MESSAGES correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: COMMON_SET_UNREAD_MESSAGES }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
