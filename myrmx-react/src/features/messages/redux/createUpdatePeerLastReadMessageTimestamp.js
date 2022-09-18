import axios from 'axios';
import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  MESSAGES_CREATE_UPDATE_PEER_LAST_READ_MESSAGE_TIMESTAMP_BEGIN,
  MESSAGES_CREATE_UPDATE_PEER_LAST_READ_MESSAGE_TIMESTAMP_SUCCESS,
  MESSAGES_CREATE_UPDATE_PEER_LAST_READ_MESSAGE_TIMESTAMP_FAILURE,
  MESSAGES_CREATE_UPDATE_PEER_LAST_READ_MESSAGE_TIMESTAMP_DISMISS_ERROR,
} from './constants';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function createUpdatePeerLastReadMessageTimestamp(args = {}) {
  return (dispatch, getState) => {
    dispatch({
      type: MESSAGES_CREATE_UPDATE_PEER_LAST_READ_MESSAGE_TIMESTAMP_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.post(`${config.apiRootUrl}/messages/peer-last-read-message-timestamps/`, args, createAxiosConfigWithAuth(getState()));
      doRequest.then(
        (res) => {
          dispatch({
            type: MESSAGES_CREATE_UPDATE_PEER_LAST_READ_MESSAGE_TIMESTAMP_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: MESSAGES_CREATE_UPDATE_PEER_LAST_READ_MESSAGE_TIMESTAMP_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissCreateUpdatePeerLastReadMessageTimestampError() {
  return {
    type: MESSAGES_CREATE_UPDATE_PEER_LAST_READ_MESSAGE_TIMESTAMP_DISMISS_ERROR,
  };
}

export function useCreateUpdatePeerLastReadMessageTimestamp() {
  const dispatch = useDispatch();

  const { createUpdatePeerLastReadMessageTimestampPending, createUpdatePeerLastReadMessageTimestampError } = useSelector(
    state => ({
      createUpdatePeerLastReadMessageTimestampPending: state.messages.createUpdatePeerLastReadMessageTimestampPending,
      createUpdatePeerLastReadMessageTimestampError: state.messages.createUpdatePeerLastReadMessageTimestampError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(createUpdatePeerLastReadMessageTimestamp(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissCreateUpdatePeerLastReadMessageTimestampError());
  }, [dispatch]);

  return {
    createUpdatePeerLastReadMessageTimestamp: boundAction,
    createUpdatePeerLastReadMessageTimestampPending,
    createUpdatePeerLastReadMessageTimestampError,
    dismissCreateUpdatePeerLastReadMessageTimestampError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case MESSAGES_CREATE_UPDATE_PEER_LAST_READ_MESSAGE_TIMESTAMP_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        createUpdatePeerLastReadMessageTimestampPending: true,
        createUpdatePeerLastReadMessageTimestampError: null,
      };

    case MESSAGES_CREATE_UPDATE_PEER_LAST_READ_MESSAGE_TIMESTAMP_SUCCESS:
      // The request is success
      return {
        ...state,
        createUpdatePeerLastReadMessageTimestampPending: false,
        createUpdatePeerLastReadMessageTimestampError: null,
      };

    case MESSAGES_CREATE_UPDATE_PEER_LAST_READ_MESSAGE_TIMESTAMP_FAILURE:
      // The request is failed
      return {
        ...state,
        createUpdatePeerLastReadMessageTimestampPending: false,
        createUpdatePeerLastReadMessageTimestampError: action.data.error,
      };

    case MESSAGES_CREATE_UPDATE_PEER_LAST_READ_MESSAGE_TIMESTAMP_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        createUpdatePeerLastReadMessageTimestampError: null,
      };

    default:
      return state;
  }
}
