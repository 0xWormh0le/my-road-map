import axios from 'axios';
import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  COMMON_FETCH_AGORA_RTM_TOKEN_BEGIN,
  COMMON_FETCH_AGORA_RTM_TOKEN_SUCCESS,
  COMMON_FETCH_AGORA_RTM_TOKEN_FAILURE,
  COMMON_FETCH_AGORA_RTM_TOKEN_DISMISS_ERROR,
} from './constants';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function fetchAgoraRtmToken(args = {}) {
  return (dispatch, getState) => {
    dispatch({
      type: COMMON_FETCH_AGORA_RTM_TOKEN_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.get(`${config.apiRootUrl}/messages/get-rtm-token/`, createAxiosConfigWithAuth(getState()));
      doRequest.then(
        (res) => {
          dispatch({
            type: COMMON_FETCH_AGORA_RTM_TOKEN_SUCCESS,
            data: res.data.token,
          });
          resolve(res.data.token);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: COMMON_FETCH_AGORA_RTM_TOKEN_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissFetchAgoraRtmTokenError() {
  return {
    type: COMMON_FETCH_AGORA_RTM_TOKEN_DISMISS_ERROR,
  };
}

export function clearAgoraRtmToken() {
  return {
    type: COMMON_FETCH_AGORA_RTM_TOKEN_SUCCESS,
    data: undefined,
  };
}

export function useFetchAgoraRtmToken() {
  const dispatch = useDispatch();

  const { agoraRtmToken, fetchAgoraRtmTokenPending, fetchAgoraRtmTokenError } = useSelector(
    state => ({
      agoraRtmToken: state.common.agoraRtmToken,
      fetchAgoraRtmTokenPending: state.common.fetchAgoraRtmTokenPending,
      fetchAgoraRtmTokenError: state.common.fetchAgoraRtmTokenError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(fetchAgoraRtmToken(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissFetchAgoraRtmTokenError());
  }, [dispatch]);

  return {
    agoraRtmToken,
    fetchAgoraRtmToken: boundAction,
    fetchAgoraRtmTokenPending,
    fetchAgoraRtmTokenError,
    dismissFetchAgoraRtmTokenError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case COMMON_FETCH_AGORA_RTM_TOKEN_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        fetchAgoraRtmTokenPending: true,
        fetchAgoraRtmTokenError: null,
      };

    case COMMON_FETCH_AGORA_RTM_TOKEN_SUCCESS:
      // The request is success
      return {
        ...state,
        fetchAgoraRtmTokenPending: false,
        fetchAgoraRtmTokenError: null,
        agoraRtmToken: action.data,
      };

    case COMMON_FETCH_AGORA_RTM_TOKEN_FAILURE:
      // The request is failed
      return {
        ...state,
        fetchAgoraRtmTokenPending: false,
        fetchAgoraRtmTokenError: action.data.error,
      };

    case COMMON_FETCH_AGORA_RTM_TOKEN_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        fetchAgoraRtmTokenError: null,
      };

    default:
      return state;
  }
}
