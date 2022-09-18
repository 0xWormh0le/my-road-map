import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import axios from 'axios';
import {
  MESSAGES_CREATE_GROUP_CHAT_BEGIN,
  MESSAGES_CREATE_GROUP_CHAT_SUCCESS,
  MESSAGES_CREATE_GROUP_CHAT_FAILURE,
  MESSAGES_CREATE_GROUP_CHAT_DISMISS_ERROR,
} from './constants';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function createGroupChat(args = {}) {
  return (dispatch, getState) => {
    dispatch({
      type: MESSAGES_CREATE_GROUP_CHAT_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.post(`${config.apiRootUrl}/messages/groups/`, args, createAxiosConfigWithAuth(getState()));
      doRequest.then(
        (res) => {
          dispatch({
            type: MESSAGES_CREATE_GROUP_CHAT_SUCCESS,
            data: res.data,
          });
          resolve(res.data);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: MESSAGES_CREATE_GROUP_CHAT_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissCreateGroupChatError() {
  return {
    type: MESSAGES_CREATE_GROUP_CHAT_DISMISS_ERROR,
  };
}

export function useCreateGroupChat() {
  const dispatch = useDispatch();

  const { createGroupChatPending, createGroupChatError } = useSelector(
    state => ({
      createGroupChatPending: state.messages.createGroupChatPending,
      createGroupChatError: state.messages.createGroupChatError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(createGroupChat(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissCreateGroupChatError());
  }, [dispatch]);

  return {
    createGroupChat: boundAction,
    createGroupChatPending,
    createGroupChatError,
    dismissCreateGroupChatError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case MESSAGES_CREATE_GROUP_CHAT_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        createGroupChatPending: true,
        createGroupChatError: null,
      };

    case MESSAGES_CREATE_GROUP_CHAT_SUCCESS:
      // The request is success
      return {
        ...state,
        createGroupChatPending: false,
        createGroupChatError: null,
      };

    case MESSAGES_CREATE_GROUP_CHAT_FAILURE:
      // The request is failed
      return {
        ...state,
        createGroupChatPending: false,
        createGroupChatError: action.data.error,
      };

    case MESSAGES_CREATE_GROUP_CHAT_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        createGroupChatError: null,
      };

    default:
      return state;
  }
}
