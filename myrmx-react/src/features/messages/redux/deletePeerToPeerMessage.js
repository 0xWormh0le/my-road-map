import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import axios from 'axios';
import {
  MESSAGES_DELETE_PEER_TO_PEER_MESSAGE_BEGIN,
  MESSAGES_DELETE_PEER_TO_PEER_MESSAGE_SUCCESS,
  MESSAGES_DELETE_PEER_TO_PEER_MESSAGE_FAILURE,
  MESSAGES_DELETE_PEER_TO_PEER_MESSAGE_DISMISS_ERROR,
} from './constants';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function deletePeerToPeerMessage(args = {}) {
  return (dispatch, getState) => {
    dispatch({
      type: MESSAGES_DELETE_PEER_TO_PEER_MESSAGE_BEGIN,
    });

    const { peerId, messageId } = args;
    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.delete(
        `${config.apiRootUrl}/messages/conversations/${peerId}/messages/${messageId}/`,
        createAxiosConfigWithAuth(getState())
      );
      doRequest.then(
        (res) => {
          dispatch({
            type: MESSAGES_DELETE_PEER_TO_PEER_MESSAGE_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: MESSAGES_DELETE_PEER_TO_PEER_MESSAGE_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissDeletePeerToPeerMessageError() {
  return {
    type: MESSAGES_DELETE_PEER_TO_PEER_MESSAGE_DISMISS_ERROR,
  };
}

export function useDeletePeerToPeerMessage() {
  const dispatch = useDispatch();

  const { deletePeerToPeerMessagePending, deletePeerToPeerMessageError } = useSelector(
    state => ({
      deletePeerToPeerMessagePending: state.messages.deletePeerToPeerMessagePending,
      deletePeerToPeerMessageError: state.messages.deletePeerToPeerMessageError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(deletePeerToPeerMessage(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissDeletePeerToPeerMessageError());
  }, [dispatch]);

  return {
    deletePeerToPeerMessage: boundAction,
    deletePeerToPeerMessagePending,
    deletePeerToPeerMessageError,
    dismissDeletePeerToPeerMessageError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case MESSAGES_DELETE_PEER_TO_PEER_MESSAGE_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        deletePeerToPeerMessagePending: true,
        deletePeerToPeerMessageError: null,
      };

    case MESSAGES_DELETE_PEER_TO_PEER_MESSAGE_SUCCESS:
      // The request is success
      return {
        ...state,
        deletePeerToPeerMessagePending: false,
        deletePeerToPeerMessageError: null,
      };

    case MESSAGES_DELETE_PEER_TO_PEER_MESSAGE_FAILURE:
      // The request is failed
      return {
        ...state,
        deletePeerToPeerMessagePending: false,
        deletePeerToPeerMessageError: action.data.error,
      };

    case MESSAGES_DELETE_PEER_TO_PEER_MESSAGE_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        deletePeerToPeerMessageError: null,
      };

    default:
      return state;
  }
}
