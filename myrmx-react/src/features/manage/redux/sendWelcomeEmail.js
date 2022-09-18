import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  MANAGE_SEND_WELCOME_EMAIL_BEGIN,
  MANAGE_SEND_WELCOME_EMAIL_SUCCESS,
  MANAGE_SEND_WELCOME_EMAIL_FAILURE,
  MANAGE_SEND_WELCOME_EMAIL_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function sendWelcomeEmail(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: MANAGE_SEND_WELCOME_EMAIL_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const { userId } = args
      const doRequest = axios.post(
        `${config.apiRootUrl}/users/${userId}/resend-welcome-email/`,
        null,
        createAxiosConfigWithAuth(getState())
      );
      doRequest.then(
        (res) => {
          dispatch({
            type: MANAGE_SEND_WELCOME_EMAIL_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: MANAGE_SEND_WELCOME_EMAIL_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissSendWelcomeEmailError() {
  return {
    type: MANAGE_SEND_WELCOME_EMAIL_DISMISS_ERROR,
  };
}

export function useSendWelcomeEmail() {
  const dispatch = useDispatch();

  const { sendWelcomeEmailPending, sendWelcomeEmailError } = useSelector(
    state => ({
      sendWelcomeEmailPending: state.manage.sendWelcomeEmailPending,
      sendWelcomeEmailError: state.manage.sendWelcomeEmailError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(sendWelcomeEmail(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissSendWelcomeEmailError());
  }, [dispatch]);

  return {
    sendWelcomeEmail: boundAction,
    sendWelcomeEmailPending,
    sendWelcomeEmailError,
    dismissSendWelcomeEmailError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case MANAGE_SEND_WELCOME_EMAIL_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        sendWelcomeEmailPending: true,
        sendWelcomeEmailError: null,
      };

    case MANAGE_SEND_WELCOME_EMAIL_SUCCESS:
      // The request is success
      return {
        ...state,
        sendWelcomeEmailPending: false,
        sendWelcomeEmailError: null,
      };

    case MANAGE_SEND_WELCOME_EMAIL_FAILURE:
      // The request is failed
      return {
        ...state,
        sendWelcomeEmailPending: false,
        sendWelcomeEmailError: action.data.error,
      };

    case MANAGE_SEND_WELCOME_EMAIL_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        sendWelcomeEmailError: null,
      };

    default:
      return state;
  }
}
