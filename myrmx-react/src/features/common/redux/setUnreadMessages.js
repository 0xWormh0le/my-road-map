import { useCallback } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  COMMON_SET_UNREAD_MESSAGES,
} from './constants';

export function setUnreadMessages(args) {
  return {
    type: COMMON_SET_UNREAD_MESSAGES,
    data: args,
  };
}

export function useSetUnreadMessages() {
  const dispatch = useDispatch();

  const { unreadMessagesCount } = useSelector(
    state => ({
      unreadMessagesCount: state.common.unreadMessagesCount,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...params) => dispatch(setUnreadMessages(...params)), [dispatch]);
  return { unreadMessagesCount, setUnreadMessages: boundAction };
}

export function reducer(state, action) {
  switch (action.type) {
    case COMMON_SET_UNREAD_MESSAGES:
      return {
        ...state,
        unreadMessagesCount: action.data,
      };

    default:
      return state;
  }
}
