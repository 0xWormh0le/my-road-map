import axios from 'axios';
import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  MESSAGES_CREATE_PEER_TO_PEER_MESSAGE_BEGIN,
  MESSAGES_CREATE_PEER_TO_PEER_MESSAGE_SUCCESS,
  MESSAGES_CREATE_PEER_TO_PEER_MESSAGE_FAILURE,
  MESSAGES_CREATE_PEER_TO_PEER_MESSAGE_DISMISS_ERROR,
} from './constants';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function createPeerToPeerMessage(args = {}) {
  return (dispatch, getState) => {
    dispatch({
      type: MESSAGES_CREATE_PEER_TO_PEER_MESSAGE_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.post(`${config.apiRootUrl}/messages/conversations/`, args, createAxiosConfigWithAuth(getState()));
      doRequest.then(
        (res) => {
          dispatch({
            type: MESSAGES_CREATE_PEER_TO_PEER_MESSAGE_SUCCESS,
            data: res.data,
          });
          resolve(res.data);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: MESSAGES_CREATE_PEER_TO_PEER_MESSAGE_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissCreatePeerToPeerMessageError() {
  return {
    type: MESSAGES_CREATE_PEER_TO_PEER_MESSAGE_DISMISS_ERROR,
  };
}

export function useCreatePeerToPeerMessage() {
  const dispatch = useDispatch();

  const { createPeerToPeerMessagePending, createPeerToPeerMessageError } = useSelector(
    state => ({
      createPeerToPeerMessagePending: state.messages.createPeerToPeerMessagePending,
      createPeerToPeerMessageError: state.messages.createPeerToPeerMessageError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(createPeerToPeerMessage(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissCreatePeerToPeerMessageError());
  }, [dispatch]);

  return {
    createPeerToPeerMessage: boundAction,
    createPeerToPeerMessagePending,
    createPeerToPeerMessageError,
    dismissCreatePeerToPeerMessageError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case MESSAGES_CREATE_PEER_TO_PEER_MESSAGE_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        createPeerToPeerMessagePending: true,
        createPeerToPeerMessageError: null,
      };

    case MESSAGES_CREATE_PEER_TO_PEER_MESSAGE_SUCCESS:
      // The request is success
      return {
        ...state,
        createPeerToPeerMessagePending: false,
        createPeerToPeerMessageError: null,
      };

    case MESSAGES_CREATE_PEER_TO_PEER_MESSAGE_FAILURE:
      // The request is failed
      return {
        ...state,
        createPeerToPeerMessagePending: false,
        createPeerToPeerMessageError: action.data.error,
      };

    case MESSAGES_CREATE_PEER_TO_PEER_MESSAGE_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        createPeerToPeerMessageError: null,
      };

    default:
      return state;
  }
}
