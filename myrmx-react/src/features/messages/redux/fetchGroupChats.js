import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import fp from 'lodash/fp';
import axios from 'axios';
import {
  MESSAGES_FETCH_GROUP_CHATS_BEGIN,
  MESSAGES_FETCH_GROUP_CHATS_SUCCESS,
  MESSAGES_FETCH_GROUP_CHATS_FAILURE,
  MESSAGES_FETCH_GROUP_CHATS_DISMISS_ERROR,
} from './constants';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function fetchGroupChats(args = {}) {
  return (dispatch, getState) => {
    dispatch({
      type: MESSAGES_FETCH_GROUP_CHATS_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const { search, page } = args;
      const doRequest = axios.get(`${config.apiRootUrl}/messages/groups/`, {
        params: {
          search,
          page: page ? page + 1 : undefined
        },
        ...createAxiosConfigWithAuth(getState())
      });
      doRequest.then(
        (res) => {
          const results = { page, ...res.data };
          dispatch({
            type: MESSAGES_FETCH_GROUP_CHATS_SUCCESS,
            data: results,
          });
          resolve(results);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: MESSAGES_FETCH_GROUP_CHATS_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissFetchGroupChatsError() {
  return {
    type: MESSAGES_FETCH_GROUP_CHATS_DISMISS_ERROR,
  };
}

export function cleanupGroupChats() {
  return {
    type: MESSAGES_FETCH_GROUP_CHATS_SUCCESS,
    data: {
      page: 0,
      next: null,
      count: 0,
      results: []
    },
  };
}

export function useFetchGroupChats() {
  const dispatch = useDispatch();

  const { groupChats, fetchGroupChatsPending, fetchGroupChatsError } = useSelector(
    state => ({
      groupChats: state.messages.groupChats,
      fetchGroupChatsPending: state.messages.fetchGroupChatsPending,
      fetchGroupChatsError: state.messages.fetchGroupChatsError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(fetchGroupChats(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissFetchGroupChatsError());
  }, [dispatch]);

  return {
    groupChats,
    fetchGroupChats: boundAction,
    fetchGroupChatsPending,
    fetchGroupChatsError,
    dismissFetchGroupChatsError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case MESSAGES_FETCH_GROUP_CHATS_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        fetchGroupChatsPending: true,
        fetchGroupChatsError: null,
      };

    case MESSAGES_FETCH_GROUP_CHATS_SUCCESS:
      // The request is success
      const page = (action.data && action.data.page) || 0;
      const results = page === 0 ? [] : state.groupChats.results;

      return fp.compose(
        fp.set('groupChats', {
          page,
          next: action.data.next,
          count: action.data.count,
          results: results.concat(action.data.results)
        }),
        fp.set('fetchGroupChatsPending', false),
        fp.set('fetchGroupChatsError', null)
      )(state);

    case MESSAGES_FETCH_GROUP_CHATS_FAILURE:
      // The request is failed
      return {
        ...state,
        fetchGroupChatsPending: false,
        fetchGroupChatsError: action.data.error,
      };

    case MESSAGES_FETCH_GROUP_CHATS_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        fetchGroupChatsError: null,
      };

    default:
      return state;
  }
}
