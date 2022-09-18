import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import axios from 'axios';
import {
  MESSAGES_DELETE_GROUP_CHAT_MESSAGE_BEGIN,
  MESSAGES_DELETE_GROUP_CHAT_MESSAGE_SUCCESS,
  MESSAGES_DELETE_GROUP_CHAT_MESSAGE_FAILURE,
  MESSAGES_DELETE_GROUP_CHAT_MESSAGE_DISMISS_ERROR,
} from './constants';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function deleteGroupChatMessage(args = {}) {
  return (dispatch, getState) => {
    dispatch({
      type: MESSAGES_DELETE_GROUP_CHAT_MESSAGE_BEGIN,
    });

    const { chatId, messageId } = args;
    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.delete(
        `${config.apiRootUrl}/messages/groups/${chatId}/messages/${messageId}/`,
        createAxiosConfigWithAuth(getState())
      );
      doRequest.then(
        (res) => {
          dispatch({
            type: MESSAGES_DELETE_GROUP_CHAT_MESSAGE_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: MESSAGES_DELETE_GROUP_CHAT_MESSAGE_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissDeleteGroupChatMessageError() {
  return {
    type: MESSAGES_DELETE_GROUP_CHAT_MESSAGE_DISMISS_ERROR,
  };
}

export function useDeleteGroupChatMessage() {
  const dispatch = useDispatch();

  const { deleteGroupChatMessagePending, deleteGroupChatMessageError } = useSelector(
    state => ({
      deleteGroupChatMessagePending: state.messages.deleteGroupChatMessagePending,
      deleteGroupChatMessageError: state.messages.deleteGroupChatMessageError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(deleteGroupChatMessage(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissDeleteGroupChatMessageError());
  }, [dispatch]);

  return {
    deleteGroupChatMessage: boundAction,
    deleteGroupChatMessagePending,
    deleteGroupChatMessageError,
    dismissDeleteGroupChatMessageError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case MESSAGES_DELETE_GROUP_CHAT_MESSAGE_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        deleteGroupChatMessagePending: true,
        deleteGroupChatMessageError: null,
      };

    case MESSAGES_DELETE_GROUP_CHAT_MESSAGE_SUCCESS:
      // The request is success
      return {
        ...state,
        deleteGroupChatMessagePending: false,
        deleteGroupChatMessageError: null,
      };

    case MESSAGES_DELETE_GROUP_CHAT_MESSAGE_FAILURE:
      // The request is failed
      return {
        ...state,
        deleteGroupChatMessagePending: false,
        deleteGroupChatMessageError: action.data.error,
      };

    case MESSAGES_DELETE_GROUP_CHAT_MESSAGE_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        deleteGroupChatMessageError: null,
      };

    default:
      return state;
  }
}
