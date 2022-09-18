import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  NOTIFICATIONS_MARK_ALL_READ_BEGIN,
  NOTIFICATIONS_MARK_ALL_READ_SUCCESS,
  NOTIFICATIONS_MARK_ALL_READ_FAILURE,
  NOTIFICATIONS_MARK_ALL_READ_DISMISS_ERROR,
} from './constants';

import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function markAllRead(args = {}) {
  return (dispatch, getState) => {
    dispatch({
      type: NOTIFICATIONS_MARK_ALL_READ_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.post(
        `${config.apiRootUrl}/notifications/mark-all-read/`,
        {},
        createAxiosConfigWithAuth(getState()),
      );
      doRequest.then(
        (res) => {
          dispatch({
            type: NOTIFICATIONS_MARK_ALL_READ_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: NOTIFICATIONS_MARK_ALL_READ_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissMarkAllReadError() {
  return {
    type: NOTIFICATIONS_MARK_ALL_READ_DISMISS_ERROR,
  };
}

export function useMarkAllRead() {
  const dispatch = useDispatch();

  const { markAllReadPending, markAllReadError } = useSelector(
    state => ({
      markAllReadPending: state.notifications.markAllReadPending,
      markAllReadError: state.notifications.markAllReadError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(markAllRead(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissMarkAllReadError());
  }, [dispatch]);

  return {
    markAllRead: boundAction,
    markAllReadPending,
    markAllReadError,
    dismissMarkAllReadError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case NOTIFICATIONS_MARK_ALL_READ_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        markAllReadPending: true,
        markAllReadError: null,
      };

    case NOTIFICATIONS_MARK_ALL_READ_SUCCESS:
      // The request is success
      return {
        ...state,
        markAllReadPending: false,
        markAllReadError: null,
      };

    case NOTIFICATIONS_MARK_ALL_READ_FAILURE:
      // The request is failed
      return {
        ...state,
        markAllReadPending: false,
        markAllReadError: action.data.error,
      };

    case NOTIFICATIONS_MARK_ALL_READ_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        markAllReadError: null,
      };

    default:
      return state;
  }
}
