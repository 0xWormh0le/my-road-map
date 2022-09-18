import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import axios from 'axios';
import {
  HOME_REGISTER_ACCOUNT_BEGIN,
  HOME_REGISTER_ACCOUNT_SUCCESS,
  HOME_REGISTER_ACCOUNT_FAILURE,
  HOME_REGISTER_ACCOUNT_DISMISS_ERROR,
} from './constants';
import config from '../../../common/config';

export function registerAccount(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: HOME_REGISTER_ACCOUNT_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.post(`${config.apiRootUrl}/auth/sign-up/`, args);
      doRequest.then(
        (res) => {
          dispatch({
            type: HOME_REGISTER_ACCOUNT_SUCCESS,
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
            type: HOME_REGISTER_ACCOUNT_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissRegisterAccountError() {
  return {
    type: HOME_REGISTER_ACCOUNT_DISMISS_ERROR,
  };
}

export function useRegisterAccount() {
  const dispatch = useDispatch();

  const { authToken, userApproved, registerAccountPending, registerAccountError } = useSelector(
    state => ({
      authToken: state.home.authToken,
      userApproved: state.home.userApproved,
      registerAccountPending: state.home.registerAccountPending,
      registerAccountError: state.home.registerAccountError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(registerAccount(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissRegisterAccountError());
  }, [dispatch]);

  return {
    authToken,
    userApproved,
    registerAccount: boundAction,
    registerAccountPending,
    registerAccountError,
    dismissRegisterAccountError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_REGISTER_ACCOUNT_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        registerAccountPending: true,
        registerAccountError: null,
      };

    case HOME_REGISTER_ACCOUNT_SUCCESS:
      // The request is success
      return {
        ...state,
        registerAccountPending: false,
        registerAccountError: null,
        authToken: action.data.token,
        userApproved: action.data.userApproved
      };

    case HOME_REGISTER_ACCOUNT_FAILURE:
      // The request is failed
      return {
        ...state,
        registerAccountPending: false,
        registerAccountError: action.data.error,
      };

    case HOME_REGISTER_ACCOUNT_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        registerAccountError: null,
      };

    default:
      return state;
  }
}
