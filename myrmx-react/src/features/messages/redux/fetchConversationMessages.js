import axios from 'axios';
import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  MESSAGES_FETCH_CONVERSATION_MESSAGES_BEGIN,
  MESSAGES_FETCH_CONVERSATION_MESSAGES_SUCCESS,
  MESSAGES_FETCH_CONVERSATION_MESSAGES_FAILURE,
  MESSAGES_FETCH_CONVERSATION_MESSAGES_DISMISS_ERROR,
} from './constants';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

// TODO: Handle paged output here properly
export function fetchConversationMessages(args = {}) {
  return (dispatch, getState) => {
    dispatch({
      type: MESSAGES_FETCH_CONVERSATION_MESSAGES_BEGIN,
    });

    const { peerId, fetchNextPage } = args;
    let url = `${config.apiRootUrl}/messages/conversations/${peerId}/messages/`;
    if (fetchNextPage) {
      const nextUrl = getState().messages.conversationMessages[peerId].next;
      if (nextUrl) url = nextUrl;
    }
    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.get(
        url,
        {
          params: {
            // ordering: '-pk'
          },
          ...createAxiosConfigWithAuth(getState())
        }
      );
      doRequest.then(
        (res) => {
          dispatch({
            type: MESSAGES_FETCH_CONVERSATION_MESSAGES_SUCCESS,
            data: {
              peerId,
              messages: res.data.results,
              next: res.data.next,
              firstPage: !fetchNextPage,
            },
          });
          resolve(res.data.results);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: MESSAGES_FETCH_CONVERSATION_MESSAGES_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissFetchConversationMessagesError() {
  return {
    type: MESSAGES_FETCH_CONVERSATION_MESSAGES_DISMISS_ERROR,
  };
}

export function overwriteConversationMessages(peerId, messages) {
  return {
    type: MESSAGES_FETCH_CONVERSATION_MESSAGES_SUCCESS,
    data: {
      peerId,
      messages,
      overwrite: true,
    }
  };
}

export function useFetchConversationMessages() {
  const dispatch = useDispatch();

  const { conversationMessages, fetchConversationMessagesPending, fetchConversationMessagesError } = useSelector(
    state => ({
      conversationMessages: state.messages.conversationMessages,
      fetchConversationMessagesPending: state.messages.fetchConversationMessagesPending,
      fetchConversationMessagesError: state.messages.fetchConversationMessagesError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(fetchConversationMessages(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissFetchConversationMessagesError());
  }, [dispatch]);

  const boundOverwriteMessages = useCallback((...args) => {
    return dispatch(overwriteConversationMessages(...args));
  }, [dispatch]);

  return {
    conversationMessages,
    fetchConversationMessages: boundAction,
    fetchConversationMessagesPending,
    fetchConversationMessagesError,
    dismissFetchConversationMessagesError: boundDismissError,
    overwriteConversationMessages: boundOverwriteMessages,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case MESSAGES_FETCH_CONVERSATION_MESSAGES_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        fetchConversationMessagesPending: true,
        fetchConversationMessagesError: null,
      };

    case MESSAGES_FETCH_CONVERSATION_MESSAGES_SUCCESS:
      // The request is success
      let messages;
      if (!!action.data.overwrite) {
        messages = action.data.messages;
        action.data.next = state.conversationMessages[action.data.peerId].next;
      } else {
        // Messages in API responses are sorted in reverse chronological order, so we get them reversed
        messages = action.data.firstPage
          ? action.data.messages.reverse()
          : [...action.data.messages.reverse(), ...state.conversationMessages[action.data.peerId].messages];
      }
      return {
        ...state,
        fetchConversationMessagesPending: false,
        fetchConversationMessagesError: null,
        conversationMessages: Object.assign({}, state.conversationMessages, {
          [action.data.peerId]: {
            next: action.data.next,
            messages,
          },
        }),
      };

    case MESSAGES_FETCH_CONVERSATION_MESSAGES_FAILURE:
      // The request is failed
      return {
        ...state,
        fetchConversationMessagesPending: false,
        fetchConversationMessagesError: action.data.error,
      };

    case MESSAGES_FETCH_CONVERSATION_MESSAGES_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        fetchConversationMessagesError: null,
      };

    default:
      return state;
  }
}
