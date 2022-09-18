import axios from 'axios';
import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  MESSAGES_FETCH_CONVERSATIONS_BEGIN,
  MESSAGES_FETCH_CONVERSATIONS_SUCCESS,
  MESSAGES_FETCH_CONVERSATIONS_FAILURE,
  MESSAGES_FETCH_CONVERSATIONS_DISMISS_ERROR,
} from './constants';
import config from '../../../common/config';
import fp from 'lodash/fp';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';


export function fetchConversations(args = {}) {
  return (dispatch, getState) => {
    dispatch({
      type: MESSAGES_FETCH_CONVERSATIONS_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const { search, page } = args;
      const doRequest = axios.get(`${config.apiRootUrl}/messages/conversations/`, {
        params: {
          search,
          page: page ? page + 1 : undefined
        }, 
        ...createAxiosConfigWithAuth(getState())
      });
      doRequest.then(
        (res) => {
          const results = { page, ...res.data}
          dispatch({
            type: MESSAGES_FETCH_CONVERSATIONS_SUCCESS,
            data: results,
          });
          resolve(results);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: MESSAGES_FETCH_CONVERSATIONS_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissFetchConversationsError() {
  return {
    type: MESSAGES_FETCH_CONVERSATIONS_DISMISS_ERROR,
  };
}

export function cleanupConversations() {
  return {
    type: MESSAGES_FETCH_CONVERSATIONS_SUCCESS,
    data: {
      page: 0,
      next: null,
      count: 0,
      results: []
    },
  };
}

export function useFetchConversations() {
  const dispatch = useDispatch();

  const { conversations, fetchConversationsPending, fetchConversationsError } = useSelector(
    state => ({
      conversations: state.messages.conversations,
      fetchConversationsPending: state.messages.fetchConversationsPending,
      fetchConversationsError: state.messages.fetchConversationsError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(fetchConversations(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissFetchConversationsError());
  }, [dispatch]);

  return {
    conversations,
    fetchConversations: boundAction,
    fetchConversationsPending,
    fetchConversationsError,
    dismissFetchConversationsError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case MESSAGES_FETCH_CONVERSATIONS_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        fetchConversationsPending: true,
        fetchConversationsError: null,
      };

    case MESSAGES_FETCH_CONVERSATIONS_SUCCESS:
      // The request is success
      const page = (action.data && action.data.page) || 0;
      const results = page === 0 ? [] : state.conversations.results;

      return fp.compose(
        fp.set('conversations', {
          page,
          next: action.data.next,
          count: action.data.count,
          results: results.concat(action.data.results)
        }),
        fp.set('fetchConversationsPending', false),
        fp.set('fetchConversationsError', null)
      )(state);

    case MESSAGES_FETCH_CONVERSATIONS_FAILURE:
      // The request is failed
      return {
        ...state,
        fetchConversationsPending: false,
        fetchConversationsError: action.data.error,
      };

    case MESSAGES_FETCH_CONVERSATIONS_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        fetchConversationsError: null,
      };

    default:
      return state;
  }
}
