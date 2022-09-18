import {
  COMMON_UPDATE_UNREAD_MESSAGES,
} from '../../../../src/features/common/redux/constants';

import {
  updateUnreadMessages,
  reducer,
} from '../../../../src/features/common/redux/updateUnreadMessages';

describe('common/redux/updateUnreadMessages', () => {
  it('returns correct action by updateUnreadMessages', () => {
    expect(updateUnreadMessages()).toHaveProperty('type', COMMON_UPDATE_UNREAD_MESSAGES);
  });

  it('handles action type COMMON_UPDATE_UNREAD_MESSAGES correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: COMMON_UPDATE_UNREAD_MESSAGES, data: 1 }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    const expectedState = { unreadMessagesCount: 1 };
    expect(state).toEqual(expectedState);
  });
});
