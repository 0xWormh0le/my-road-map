import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  USER_FETCH_NOTIFICATIONS_SETTINGS_BEGIN,
  USER_FETCH_NOTIFICATIONS_SETTINGS_SUCCESS,
  USER_FETCH_NOTIFICATIONS_SETTINGS_FAILURE,
  USER_FETCH_NOTIFICATIONS_SETTINGS_DISMISS_ERROR,
} from './constants';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';
import axios from 'axios';

export function fetchNotificationsSettings(args = {}) {
  return (dispatch, getState) => {
    dispatch({
      type: USER_FETCH_NOTIFICATIONS_SETTINGS_BEGIN,
    });

    const { deliveryType } = args;

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.get(
        `${config.apiRootUrl}/notifications-settings/?delivery_type=${deliveryType}`,
        createAxiosConfigWithAuth(getState()),
      );
      doRequest.then(
        (res) => {
          dispatch({
            type: USER_FETCH_NOTIFICATIONS_SETTINGS_SUCCESS,
            data: res.data,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: USER_FETCH_NOTIFICATIONS_SETTINGS_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissFetchNotificationsSettingsError() {
  return {
    type: USER_FETCH_NOTIFICATIONS_SETTINGS_DISMISS_ERROR,
  };
}

export function clearNotificationsSettings() {
  return {
    type: USER_FETCH_NOTIFICATIONS_SETTINGS_SUCCESS,
    data: undefined,
  };
}

export function useFetchNotificationsSettings() {
  const dispatch = useDispatch();

  const { notificationsSettings, fetchNotificationsSettingsPending, fetchNotificationsSettingsError } = useSelector(
    state => ({
      notificationsSettings: state.user.notificationsSettings,
      fetchNotificationsSettingsPending: state.user.fetchNotificationsSettingsPending,
      fetchNotificationsSettingsError: state.user.fetchNotificationsSettingsError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(fetchNotificationsSettings(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissFetchNotificationsSettingsError());
  }, [dispatch]);

  return {
    notificationsSettings,
    fetchNotificationsSettings: boundAction,
    fetchNotificationsSettingsPending,
    fetchNotificationsSettingsError,
    dismissFetchNotificationsSettingsError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case USER_FETCH_NOTIFICATIONS_SETTINGS_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        fetchNotificationsSettingsPending: true,
        fetchNotificationsSettingsError: null,
      };

    case USER_FETCH_NOTIFICATIONS_SETTINGS_SUCCESS:
      // The request is success
      return {
        ...state,
        fetchNotificationsSettingsPending: false,
        fetchNotificationsSettingsError: null,
        notificationsSettings: action.data,
      };

    case USER_FETCH_NOTIFICATIONS_SETTINGS_FAILURE:
      // The request is failed
      return {
        ...state,
        fetchNotificationsSettingsPending: false,
        fetchNotificationsSettingsError: action.data.error,
      };

    case USER_FETCH_NOTIFICATIONS_SETTINGS_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        fetchNotificationsSettingsError: null,
      };

    default:
      return state;
  }
}
