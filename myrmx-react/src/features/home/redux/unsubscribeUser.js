import axios from 'axios';
import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  HOME_UNSUBSCRIBE_USER_BEGIN,
  HOME_UNSUBSCRIBE_USER_SUCCESS,
  HOME_UNSUBSCRIBE_USER_FAILURE,
  HOME_UNSUBSCRIBE_USER_DISMISS_ERROR,
} from './constants';
import config from '../../../common/config';

export function unsubscribeUser(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: HOME_UNSUBSCRIBE_USER_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.post(`${config.apiRootUrl}/unsubscribe/`, args);
      doRequest.then(
        (res) => {
          dispatch({
            type: HOME_UNSUBSCRIBE_USER_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: HOME_UNSUBSCRIBE_USER_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissUnsubscribeUserError() {
  return {
    type: HOME_UNSUBSCRIBE_USER_DISMISS_ERROR,
  };
}

export function useUnsubscribeUser() {
  const dispatch = useDispatch();

  const { unsubscribeUserPending, unsubscribeUserError } = useSelector(
    state => ({
      unsubscribeUserPending: state.home.unsubscribeUserPending,
      unsubscribeUserError: state.home.unsubscribeUserError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(unsubscribeUser(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissUnsubscribeUserError());
  }, [dispatch]);

  return {
    unsubscribeUser: boundAction,
    unsubscribeUserPending,
    unsubscribeUserError,
    dismissUnsubscribeUserError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_UNSUBSCRIBE_USER_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        unsubscribeUserPending: true,
        unsubscribeUserError: null,
      };

    case HOME_UNSUBSCRIBE_USER_SUCCESS:
      // The request is success
      return {
        ...state,
        unsubscribeUserPending: false,
        unsubscribeUserError: null,
      };

    case HOME_UNSUBSCRIBE_USER_FAILURE:
      // The request is failed
      return {
        ...state,
        unsubscribeUserPending: false,
        unsubscribeUserError: action.data.error,
      };

    case HOME_UNSUBSCRIBE_USER_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        unsubscribeUserError: null,
      };

    default:
      return state;
  }
}
