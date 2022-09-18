import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import axios from 'axios';
import {
  HOME_CONFIRM_RESET_PASSWORD_BEGIN,
  HOME_CONFIRM_RESET_PASSWORD_SUCCESS,
  HOME_CONFIRM_RESET_PASSWORD_FAILURE,
  HOME_CONFIRM_RESET_PASSWORD_DISMISS_ERROR,
} from './constants';
import config from '../../../common/config';

export function confirmResetPassword(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: HOME_CONFIRM_RESET_PASSWORD_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.post(`${config.apiRootUrl}/auth/password-reset/confirm/`, args);
      doRequest.then(
        (res) => {
          dispatch({
            type: HOME_CONFIRM_RESET_PASSWORD_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: HOME_CONFIRM_RESET_PASSWORD_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissConfirmResetPasswordError() {
  return {
    type: HOME_CONFIRM_RESET_PASSWORD_DISMISS_ERROR,
  };
}

export function useConfirmResetPassword() {
  const dispatch = useDispatch();

  const { confirmResetPasswordPending, confirmResetPasswordError } = useSelector(
    state => ({
      confirmResetPasswordPending: state.home.confirmResetPasswordPending,
      confirmResetPasswordError: state.home.confirmResetPasswordError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(confirmResetPassword(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissConfirmResetPasswordError());
  }, [dispatch]);

  return {
    confirmResetPassword: boundAction,
    confirmResetPasswordPending,
    confirmResetPasswordError,
    dismissConfirmResetPasswordError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_CONFIRM_RESET_PASSWORD_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        confirmResetPasswordPending: true,
        confirmResetPasswordError: null,
      };

    case HOME_CONFIRM_RESET_PASSWORD_SUCCESS:
      // The request is success
      return {
        ...state,
        confirmResetPasswordPending: false,
        confirmResetPasswordError: null,
      };

    case HOME_CONFIRM_RESET_PASSWORD_FAILURE:
      // The request is failed
      return {
        ...state,
        confirmResetPasswordPending: false,
        confirmResetPasswordError: action.data.error,
      };

    case HOME_CONFIRM_RESET_PASSWORD_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        confirmResetPasswordError: null,
      };

    default:
      return state;
  }
}
