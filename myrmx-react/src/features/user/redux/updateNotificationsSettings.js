import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  USER_UPDATE_NOTIFICATIONS_SETTINGS_BEGIN,
  USER_UPDATE_NOTIFICATIONS_SETTINGS_SUCCESS,
  USER_UPDATE_NOTIFICATIONS_SETTINGS_FAILURE,
  USER_UPDATE_NOTIFICATIONS_SETTINGS_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';
import config from '../../../common/config';

export function updateNotificationsSettings(args = {}) {
  return (dispatch, getState) => {
    dispatch({
      type: USER_UPDATE_NOTIFICATIONS_SETTINGS_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.post(
        `${config.apiRootUrl}/notifications-settings/`,
        args,
        createAxiosConfigWithAuth(getState()),
      );
      doRequest.then(
        (res) => {
          dispatch({
            type: USER_UPDATE_NOTIFICATIONS_SETTINGS_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: USER_UPDATE_NOTIFICATIONS_SETTINGS_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissUpdateNotificationsSettingsError() {
  return {
    type: USER_UPDATE_NOTIFICATIONS_SETTINGS_DISMISS_ERROR,
  };
}

export function useUpdateNotificationsSettings() {
  const dispatch = useDispatch();

  const { updateNotificationsSettingsPending, updateNotificationsSettingsError } = useSelector(
    state => ({
      updateNotificationsSettingsPending: state.user.updateNotificationsSettingsPending,
      updateNotificationsSettingsError: state.user.updateNotificationsSettingsError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(updateNotificationsSettings(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissUpdateNotificationsSettingsError());
  }, [dispatch]);

  return {
    updateNotificationsSettings: boundAction,
    updateNotificationsSettingsPending,
    updateNotificationsSettingsError,
    dismissUpdateNotificationsSettingsError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case USER_UPDATE_NOTIFICATIONS_SETTINGS_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        updateNotificationsSettingsPending: true,
        updateNotificationsSettingsError: null,
      };

    case USER_UPDATE_NOTIFICATIONS_SETTINGS_SUCCESS:
      // The request is success
      return {
        ...state,
        updateNotificationsSettingsPending: false,
        updateNotificationsSettingsError: null,
      };

    case USER_UPDATE_NOTIFICATIONS_SETTINGS_FAILURE:
      // The request is failed
      return {
        ...state,
        updateNotificationsSettingsPending: false,
        updateNotificationsSettingsError: action.data.error,
      };

    case USER_UPDATE_NOTIFICATIONS_SETTINGS_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        updateNotificationsSettingsError: null,
      };

    default:
      return state;
  }
}
