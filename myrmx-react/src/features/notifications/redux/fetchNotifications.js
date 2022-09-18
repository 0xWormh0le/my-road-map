import axios from 'axios';
import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import queryString from 'query-string';
import fp from 'lodash/fp';
import {
  NOTIFICATIONS_FETCH_NOTIFICATIONS_BEGIN,
  NOTIFICATIONS_FETCH_NOTIFICATIONS_SUCCESS,
  NOTIFICATIONS_FETCH_NOTIFICATIONS_FAILURE,
  NOTIFICATIONS_FETCH_NOTIFICATIONS_DISMISS_ERROR,
} from './constants';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function fetchNotifications(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: NOTIFICATIONS_FETCH_NOTIFICATIONS_BEGIN,
    });

    const { page, verb } = args;
    const qsUrlPart = verb ? `?${queryString.stringify({verb})}` : '';
    const url = `${config.apiRootUrl}/notifications/${qsUrlPart}`;
    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.get(url, {
        params: {
          page: page ? page + 1 : undefined
        },
        ...createAxiosConfigWithAuth(getState())
      });

      doRequest.then(
        (res) => {
          const results = { page, ...res.data };
          dispatch({
            type: NOTIFICATIONS_FETCH_NOTIFICATIONS_SUCCESS,
            data: results,
          });
          resolve(results);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: NOTIFICATIONS_FETCH_NOTIFICATIONS_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissFetchNotificationsError() {
  return {
    type: NOTIFICATIONS_FETCH_NOTIFICATIONS_DISMISS_ERROR,
  };
}

export function useFetchNotifications() {
  const dispatch = useDispatch();

  const { notifications, fetchNotificationsPending, fetchNotificationsError } = useSelector(
    state => ({
      notifications: state.notifications.notifications,
      fetchNotificationsPending: state.notifications.fetchNotificationsPending,
      fetchNotificationsError: state.notifications.fetchNotificationsError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(fetchNotifications(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissFetchNotificationsError());
  }, [dispatch]);

  return {
    notifications,
    fetchNotifications: boundAction,
    fetchNotificationsPending,
    fetchNotificationsError,
    dismissFetchNotificationsError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case NOTIFICATIONS_FETCH_NOTIFICATIONS_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        fetchNotificationsPending: true,
        fetchNotificationsError: null,
      };

    case NOTIFICATIONS_FETCH_NOTIFICATIONS_SUCCESS:
      const page = action.data.page || 0
      const results = page === 0 ? [] : state.notifications.results
      return fp.compose(
        fp.set('notifications', {
          page,
          next: action.data.next,
          count: action.data.count,
          results: results.concat(action.data.results)
        }),
        fp.set('fetchNotificationsPending', false),
        fp.set('fetchNotificationsError', null)
      )(state);

    case NOTIFICATIONS_FETCH_NOTIFICATIONS_FAILURE:
      // The request is failed
      return {
        ...state,
        fetchNotificationsPending: false,
        fetchNotificationsError: action.data.error,
      };

    case NOTIFICATIONS_FETCH_NOTIFICATIONS_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        fetchNotificationsError: null,
      };

    default:
      return state;
  }
}
