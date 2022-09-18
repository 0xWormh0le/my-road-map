import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  USER_BULK_SWITCH_NOTIFICATIONS_SETTINGS_BEGIN,
  USER_BULK_SWITCH_NOTIFICATIONS_SETTINGS_SUCCESS,
  USER_BULK_SWITCH_NOTIFICATIONS_SETTINGS_FAILURE,
  USER_BULK_SWITCH_NOTIFICATIONS_SETTINGS_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function bulkSwitchNotificationsSettings(args = {}) {
  return (dispatch, getState) => {
    dispatch({
      type: USER_BULK_SWITCH_NOTIFICATIONS_SETTINGS_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.post(
        `${config.apiRootUrl}/notifications-settings/bulk-switch/`,
        args,
        createAxiosConfigWithAuth(getState()),
      );
      doRequest.then(
        (res) => {
          dispatch({
            type: USER_BULK_SWITCH_NOTIFICATIONS_SETTINGS_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: USER_BULK_SWITCH_NOTIFICATIONS_SETTINGS_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissBulkSwitchNotificationsSettingsError() {
  return {
    type: USER_BULK_SWITCH_NOTIFICATIONS_SETTINGS_DISMISS_ERROR,
  };
}

export function useBulkSwitchNotificationsSettings() {
  const dispatch = useDispatch();

  const { bulkSwitchNotificationsSettingsPending, bulkSwitchNotificationsSettingsError } = useSelector(
    state => ({
      bulkSwitchNotificationsSettingsPending: state.user.bulkSwitchNotificationsSettingsPending,
      bulkSwitchNotificationsSettingsError: state.user.bulkSwitchNotificationsSettingsError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(bulkSwitchNotificationsSettings(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissBulkSwitchNotificationsSettingsError());
  }, [dispatch]);

  return {
    bulkSwitchNotificationsSettings: boundAction,
    bulkSwitchNotificationsSettingsPending,
    bulkSwitchNotificationsSettingsError,
    dismissBulkSwitchNotificationsSettingsError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case USER_BULK_SWITCH_NOTIFICATIONS_SETTINGS_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        bulkSwitchNotificationsSettingsPending: true,
        bulkSwitchNotificationsSettingsError: null,
      };

    case USER_BULK_SWITCH_NOTIFICATIONS_SETTINGS_SUCCESS:
      // The request is success
      return {
        ...state,
        bulkSwitchNotificationsSettingsPending: false,
        bulkSwitchNotificationsSettingsError: null,
      };

    case USER_BULK_SWITCH_NOTIFICATIONS_SETTINGS_FAILURE:
      // The request is failed
      return {
        ...state,
        bulkSwitchNotificationsSettingsPending: false,
        bulkSwitchNotificationsSettingsError: action.data.error,
      };

    case USER_BULK_SWITCH_NOTIFICATIONS_SETTINGS_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        bulkSwitchNotificationsSettingsError: null,
      };

    default:
      return state;
  }
}
