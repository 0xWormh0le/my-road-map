import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import axios from 'axios';
import {
  HOME_RESET_PASSWORD_BEGIN,
  HOME_RESET_PASSWORD_SUCCESS,
  HOME_RESET_PASSWORD_FAILURE,
  HOME_RESET_PASSWORD_DISMISS_ERROR,
} from './constants';
import config from '../../../common/config';

export function resetPassword(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: HOME_RESET_PASSWORD_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.post(`${config.apiRootUrl}/auth/password-reset/`, args);
      doRequest.then(
        (res) => {
          dispatch({
            type: HOME_RESET_PASSWORD_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: HOME_RESET_PASSWORD_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissResetPasswordError() {
  return {
    type: HOME_RESET_PASSWORD_DISMISS_ERROR,
  };
}

export function useResetPassword() {
  const dispatch = useDispatch();

  const { resetPasswordPending, resetPasswordError } = useSelector(
    state => ({
      resetPasswordPending: state.home.resetPasswordPending,
      resetPasswordError: state.home.resetPasswordError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(resetPassword(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissResetPasswordError());
  }, [dispatch]);

  return {
    resetPassword: boundAction,
    resetPasswordPending,
    resetPasswordError,
    dismissResetPasswordError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_RESET_PASSWORD_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        resetPasswordPending: true,
        resetPasswordError: null,
      };

    case HOME_RESET_PASSWORD_SUCCESS:
      // The request is success
      return {
        ...state,
        resetPasswordPending: false,
        resetPasswordError: null,
      };

    case HOME_RESET_PASSWORD_FAILURE:
      // The request is failed
      return {
        ...state,
        resetPasswordPending: false,
        resetPasswordError: action.data.error,
      };

    case HOME_RESET_PASSWORD_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        resetPasswordError: null,
      };

    default:
      return state;
  }
}
