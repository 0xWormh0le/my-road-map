import axios from 'axios';
import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  MESSAGES_CREATE_UPDATE_GROUP_LAST_READ_MESSAGE_TIMESTAMP_BEGIN,
  MESSAGES_CREATE_UPDATE_GROUP_LAST_READ_MESSAGE_TIMESTAMP_SUCCESS,
  MESSAGES_CREATE_UPDATE_GROUP_LAST_READ_MESSAGE_TIMESTAMP_FAILURE,
  MESSAGES_CREATE_UPDATE_GROUP_LAST_READ_MESSAGE_TIMESTAMP_DISMISS_ERROR,
} from './constants';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function createUpdateGroupLastReadMessageTimestamp(args = {}) {
  return (dispatch, getState) => {
    dispatch({
      type: MESSAGES_CREATE_UPDATE_GROUP_LAST_READ_MESSAGE_TIMESTAMP_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.post(`${config.apiRootUrl}/messages/group-last-read-message-timestamps/`, args, createAxiosConfigWithAuth(getState()));
      doRequest.then(
        (res) => {
          dispatch({
            type: MESSAGES_CREATE_UPDATE_GROUP_LAST_READ_MESSAGE_TIMESTAMP_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: MESSAGES_CREATE_UPDATE_GROUP_LAST_READ_MESSAGE_TIMESTAMP_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissCreateUpdateGroupLastReadMessageTimestampError() {
  return {
    type: MESSAGES_CREATE_UPDATE_GROUP_LAST_READ_MESSAGE_TIMESTAMP_DISMISS_ERROR,
  };
}

export function useCreateUpdateGroupLastReadMessageTimestamp() {
  const dispatch = useDispatch();

  const { createUpdateGroupLastReadMessageTimestampPending, createUpdateGroupLastReadMessageTimestampError } = useSelector(
    state => ({
      createUpdateGroupLastReadMessageTimestampPending: state.messages.createUpdateGroupLastReadMessageTimestampPending,
      createUpdateGroupLastReadMessageTimestampError: state.messages.createUpdateGroupLastReadMessageTimestampError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(createUpdateGroupLastReadMessageTimestamp(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissCreateUpdateGroupLastReadMessageTimestampError());
  }, [dispatch]);

  return {
    createUpdateGroupLastReadMessageTimestamp: boundAction,
    createUpdateGroupLastReadMessageTimestampPending,
    createUpdateGroupLastReadMessageTimestampError,
    dismissCreateUpdateGroupLastReadMessageTimestampError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case MESSAGES_CREATE_UPDATE_GROUP_LAST_READ_MESSAGE_TIMESTAMP_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        createUpdateGroupLastReadMessageTimestampPending: true,
        createUpdateGroupLastReadMessageTimestampError: null,
      };

    case MESSAGES_CREATE_UPDATE_GROUP_LAST_READ_MESSAGE_TIMESTAMP_SUCCESS:
      // The request is success
      return {
        ...state,
        createUpdateGroupLastReadMessageTimestampPending: false,
        createUpdateGroupLastReadMessageTimestampError: null,
      };

    case MESSAGES_CREATE_UPDATE_GROUP_LAST_READ_MESSAGE_TIMESTAMP_FAILURE:
      // The request is failed
      return {
        ...state,
        createUpdateGroupLastReadMessageTimestampPending: false,
        createUpdateGroupLastReadMessageTimestampError: action.data.error,
      };

    case MESSAGES_CREATE_UPDATE_GROUP_LAST_READ_MESSAGE_TIMESTAMP_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        createUpdateGroupLastReadMessageTimestampError: null,
      };

    default:
      return state;
  }
}
