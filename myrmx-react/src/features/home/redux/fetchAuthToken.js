import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import axios from 'axios';
import {
  HOME_FETCH_AUTH_TOKEN_BEGIN,
  HOME_FETCH_AUTH_TOKEN_SUCCESS,
  HOME_FETCH_AUTH_TOKEN_FAILURE,
  HOME_FETCH_AUTH_TOKEN_DISMISS_ERROR,
} from './constants';
import config from '../../../common/config';

export function fetchAuthToken(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: HOME_FETCH_AUTH_TOKEN_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.post(`${config.apiRootUrl}/auth/login/`, args);
      doRequest.then(
        (res) => {
          dispatch({
            type: HOME_FETCH_AUTH_TOKEN_SUCCESS,
            data: {
              token: res.data.key,
              userApproved: res.data.user_is_approved
            },
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: HOME_FETCH_AUTH_TOKEN_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissFetchAuthTokenError() {
  return {
    type: HOME_FETCH_AUTH_TOKEN_DISMISS_ERROR,
  };
}

export function clearAuthToken(callback) {
  return (dispatch, getState) => {
    if (getState().home.authToken) {
      dispatch({
        type: HOME_FETCH_AUTH_TOKEN_SUCCESS,
        data: {
          token: undefined,
          userApproved: undefined,
        },
      });
      if (typeof callback === 'function') callback();
    }
  };
}

export function clearUserApprovedStatus(callback) {
  return (dispatch, getState) => {
    if (getState().home.userApproved) {
      dispatch({
        type: HOME_FETCH_AUTH_TOKEN_SUCCESS,
        data: {
          token: getState().home.authToken,
          userApproved: undefined,
        },
      });
      if (typeof callback === 'function') callback();
    }
  };
}

export function updateUserApprovedStatus(userApproved) {
  return (dispatch, getState) => {
    dispatch({
      type: HOME_FETCH_AUTH_TOKEN_SUCCESS,
      data: {
        token: getState().home.authToken,
        userApproved,
      },
    })
  };
}

export function useFetchAuthToken(params) {
  const dispatch = useDispatch();

  const { authToken, userApproved, fetchAuthTokenPending, fetchAuthTokenError } = useSelector(
    state => ({
      authToken: state.home.authToken,
      userApproved: state.home.userApproved,
      fetchAuthTokenPending: state.home.fetchAuthTokenPending,
      fetchAuthTokenError: state.home.fetchAuthTokenError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(fetchAuthToken(...args));
  }, [dispatch]);

  useEffect(() => {
    if (params) boundAction(...(params || []));
  }, [...(params || []), boundAction]); // eslint-disable-line

  const boundDismissError = useCallback(() => {
    return dispatch(dismissFetchAuthTokenError());
  }, [dispatch]);

  return {
    authToken,
    userApproved,
    fetchAuthToken: boundAction,
    fetchAuthTokenPending,
    fetchAuthTokenError,
    dismissFetchAuthTokenError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_FETCH_AUTH_TOKEN_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        fetchAuthTokenPending: true,
        fetchAuthTokenError: null,
      };

    case HOME_FETCH_AUTH_TOKEN_SUCCESS:
      // The request is success
      return {
        ...state,
        fetchAuthTokenPending: false,
        fetchAuthTokenError: null,
        authToken: action.data.token,
        userApproved: action.data.userApproved
      };

    case HOME_FETCH_AUTH_TOKEN_FAILURE:
      // The request is failed
      return {
        ...state,
        fetchAuthTokenPending: false,
        fetchAuthTokenError: action.data.error,
      };

    case HOME_FETCH_AUTH_TOKEN_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        fetchAuthTokenError: null,
      };

    default:
      return state;
  }
}
