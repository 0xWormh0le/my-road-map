import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  NOTIFICATIONS_MARK_NOTIFICATION_READ_BEGIN,
  NOTIFICATIONS_MARK_NOTIFICATION_READ_SUCCESS,
  NOTIFICATIONS_MARK_NOTIFICATION_READ_FAILURE,
  NOTIFICATIONS_MARK_NOTIFICATION_READ_DISMISS_ERROR,
} from './constants';

import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function markNotificationRead(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: NOTIFICATIONS_MARK_NOTIFICATION_READ_BEGIN,
    });

    const { notificationId } = args;
    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.patch(
        `${config.apiRootUrl}/notifications/${notificationId}/`,
        { read: true },
        createAxiosConfigWithAuth(getState()),
      );
      doRequest.then(
        (res) => {
          dispatch({
            type: NOTIFICATIONS_MARK_NOTIFICATION_READ_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: NOTIFICATIONS_MARK_NOTIFICATION_READ_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissMarkNotificationReadError() {
  return {
    type: NOTIFICATIONS_MARK_NOTIFICATION_READ_DISMISS_ERROR,
  };
}

export function useMarkNotificationRead() {
  const dispatch = useDispatch();

  const { markNotificationReadPending, markNotificationReadError } = useSelector(
    state => ({
      markNotificationReadPending: state.notifications.markNotificationReadPending,
      markNotificationReadError: state.notifications.markNotificationReadError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(markNotificationRead(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissMarkNotificationReadError());
  }, [dispatch]);

  return {
    markNotificationRead: boundAction,
    markNotificationReadPending,
    markNotificationReadError,
    dismissMarkNotificationReadError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case NOTIFICATIONS_MARK_NOTIFICATION_READ_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        markNotificationReadPending: true,
        markNotificationReadError: null,
      };

    case NOTIFICATIONS_MARK_NOTIFICATION_READ_SUCCESS:
      // The request is success
      return {
        ...state,
        markNotificationReadPending: false,
        markNotificationReadError: null,
      };

    case NOTIFICATIONS_MARK_NOTIFICATION_READ_FAILURE:
      // The request is failed
      return {
        ...state,
        markNotificationReadPending: false,
        markNotificationReadError: action.data.error,
      };

    case NOTIFICATIONS_MARK_NOTIFICATION_READ_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        markNotificationReadError: null,
      };

    default:
      return state;
  }
}
