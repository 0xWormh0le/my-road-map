import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import axios from 'axios';
import {
  MESSAGES_CREATE_GROUP_CHAT_MESSAGE_BEGIN,
  MESSAGES_CREATE_GROUP_CHAT_MESSAGE_SUCCESS,
  MESSAGES_CREATE_GROUP_CHAT_MESSAGE_FAILURE,
  MESSAGES_CREATE_GROUP_CHAT_MESSAGE_DISMISS_ERROR,
} from './constants';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function createGroupChatMessage(args = {}) {
  return (dispatch, getState) => {
    dispatch({
      type: MESSAGES_CREATE_GROUP_CHAT_MESSAGE_BEGIN,
    });

    const chatId = args.chatId;
    delete args.chatId;
    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.post(`${config.apiRootUrl}/messages/groups/${chatId}/messages/`, args, createAxiosConfigWithAuth(getState()));
      doRequest.then(
        (res) => {
          dispatch({
            type: MESSAGES_CREATE_GROUP_CHAT_MESSAGE_SUCCESS,
            data: res.data,
          });
          resolve(res.data);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: MESSAGES_CREATE_GROUP_CHAT_MESSAGE_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissCreateGroupChatMessageError() {
  return {
    type: MESSAGES_CREATE_GROUP_CHAT_MESSAGE_DISMISS_ERROR,
  };
}

export function useCreateGroupChatMessage() {
  const dispatch = useDispatch();

  const { createGroupChatMessagePending, createGroupChatMessageError } = useSelector(
    state => ({
      createGroupChatMessagePending: state.messages.createGroupChatMessagePending,
      createGroupChatMessageError: state.messages.createGroupChatMessageError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(createGroupChatMessage(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissCreateGroupChatMessageError());
  }, [dispatch]);

  return {
    createGroupChatMessage: boundAction,
    createGroupChatMessagePending,
    createGroupChatMessageError,
    dismissCreateGroupChatMessageError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case MESSAGES_CREATE_GROUP_CHAT_MESSAGE_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        createGroupChatMessagePending: true,
        createGroupChatMessageError: null,
      };

    case MESSAGES_CREATE_GROUP_CHAT_MESSAGE_SUCCESS:
      // The request is success
      return {
        ...state,
        createGroupChatMessagePending: false,
        createGroupChatMessageError: null,
      };

    case MESSAGES_CREATE_GROUP_CHAT_MESSAGE_FAILURE:
      // The request is failed
      return {
        ...state,
        createGroupChatMessagePending: false,
        createGroupChatMessageError: action.data.error,
      };

    case MESSAGES_CREATE_GROUP_CHAT_MESSAGE_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        createGroupChatMessageError: null,
      };

    default:
      return state;
  }
}
