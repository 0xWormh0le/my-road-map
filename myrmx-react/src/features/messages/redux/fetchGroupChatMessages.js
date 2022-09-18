import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import axios from 'axios';
import {
  MESSAGES_FETCH_GROUP_CHAT_MESSAGES_BEGIN,
  MESSAGES_FETCH_GROUP_CHAT_MESSAGES_SUCCESS,
  MESSAGES_FETCH_GROUP_CHAT_MESSAGES_FAILURE,
  MESSAGES_FETCH_GROUP_CHAT_MESSAGES_DISMISS_ERROR,
} from './constants';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function fetchGroupChatMessages(args = {}) {
  return (dispatch, getState) => {
    dispatch({
      type: MESSAGES_FETCH_GROUP_CHAT_MESSAGES_BEGIN,
    });

    const { chatId, fetchNextPage } = args;
    let url = `${config.apiRootUrl}/messages/groups/${chatId}/messages/`;
    if (fetchNextPage) {
      const nextUrl = getState().messages.groupChatMessages[chatId].next;
      if (nextUrl) url = nextUrl;
    }
    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.get(url, createAxiosConfigWithAuth(getState()));
      doRequest.then(
        (res) => {
          dispatch({
            type: MESSAGES_FETCH_GROUP_CHAT_MESSAGES_SUCCESS,
            data: {
              chatId,
              messages: res.data.results,
              next: res.data.next,
              firstPage: !fetchNextPage,
            },
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: MESSAGES_FETCH_GROUP_CHAT_MESSAGES_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissFetchGroupChatMessagesError() {
  return {
    type: MESSAGES_FETCH_GROUP_CHAT_MESSAGES_DISMISS_ERROR,
  };
}

export function overwriteGroupChatMessages(chatId, messages) {
  return {
    type: MESSAGES_FETCH_GROUP_CHAT_MESSAGES_SUCCESS,
    data: {
      chatId,
      messages,
      overwrite: true,
    }
  };
}

export function useFetchGroupChatMessages() {
  const dispatch = useDispatch();

  const { groupChatMessages, fetchGroupChatMessagesPending, fetchGroupChatMessagesError } = useSelector(
    state => ({
      groupChatMessages: state.messages.groupChatMessages,
      fetchGroupChatMessagesPending: state.messages.fetchGroupChatMessagesPending,
      fetchGroupChatMessagesError: state.messages.fetchGroupChatMessagesError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(fetchGroupChatMessages(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissFetchGroupChatMessagesError());
  }, [dispatch]);

  const boundOverwriteMessages = useCallback((...args) => {
    return dispatch(overwriteGroupChatMessages(...args));
  }, [dispatch]);

  return {
    groupChatMessages,
    fetchGroupChatMessages: boundAction,
    fetchGroupChatMessagesPending,
    fetchGroupChatMessagesError,
    dismissFetchGroupChatMessagesError: boundDismissError,
    overwriteGroupChatMessages: boundOverwriteMessages,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case MESSAGES_FETCH_GROUP_CHAT_MESSAGES_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        fetchGroupChatMessagesPending: true,
        fetchGroupChatMessagesError: null,
      };

    case MESSAGES_FETCH_GROUP_CHAT_MESSAGES_SUCCESS:
      // The request is success
      let messages;
      if (!!action.data.overwrite) {
        messages = action.data.messages;
        action.data.next = state.groupChatMessages[action.data.chatId].next;
      } else {
        // Messages in API responses are sorted in reverse chronological order, so we get them reversed
        messages = action.data.firstPage
          ? action.data.messages.reverse()
          : [...action.data.messages.reverse(), ...(state.groupChatMessages[action.data.chatId]?.messages || [])];
      }
      return {
        ...state,
        fetchGroupChatMessagesPending: false,
        fetchGroupChatMessagesError: null,
        groupChatMessages: Object.assign({}, state.groupChatMessages, {
          [action.data.chatId]: {
            next: action.data.next,
            messages,
          },
        }),
      };

    case MESSAGES_FETCH_GROUP_CHAT_MESSAGES_FAILURE:
      // The request is failed
      return {
        ...state,
        fetchGroupChatMessagesPending: false,
        fetchGroupChatMessagesError: action.data.error,
      };

    case MESSAGES_FETCH_GROUP_CHAT_MESSAGES_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        fetchGroupChatMessagesError: null,
      };

    default:
      return state;
  }
}
