import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  COMMON_UPDATE_UNREAD_MESSAGES,
} from './constants';

export function updateUnreadMessages(args) {
  return {
    type: COMMON_UPDATE_UNREAD_MESSAGES,
    data: args,
  };
}

export function useUpdateUnreadMessages() {
  const dispatch = useDispatch();

  const { unreadMessagesCount } = useSelector(
    state => ({
      unreadMessagesCount: state.common.unreadMessagesCount,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...params) => dispatch(updateUnreadMessages(...params)), [dispatch]);

  return { unreadMessagesCount, updateUnreadMessages: boundAction };
}

export function reducer(state, action) {
  switch (action.type) {
    case COMMON_UPDATE_UNREAD_MESSAGES:
      return {
        ...state,
        unreadMessagesCount: (state.unreadMessagesCount || 0) + action.data,
      };

    default:
      return state;
  }
}
