import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  MANAGE_UPDATE_USER_AVATAR_BEGIN,
  MANAGE_UPDATE_USER_AVATAR_SUCCESS,
  MANAGE_UPDATE_USER_AVATAR_FAILURE,
  MANAGE_UPDATE_USER_AVATAR_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth, createAxiosFormDataConfigWithAuth } from '../../../common/apiHelpers';

export function updateUserAvatar(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: MANAGE_UPDATE_USER_AVATAR_BEGIN,
    });

    const { userId, data } = args
    const promise = new Promise((resolve, reject) => {
      let doRequest = axios.patch(
        `${config.apiRootUrl}/users/${userId}/`,
        data ? data : { photo: null },
        data ? createAxiosFormDataConfigWithAuth(getState()) : createAxiosConfigWithAuth(getState())
      );
      doRequest.then(
        (res) => {
          dispatch({
            type: MANAGE_UPDATE_USER_AVATAR_SUCCESS,
            data: res.data,
          });
          resolve(res.data);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: MANAGE_UPDATE_USER_AVATAR_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissUpdateUserAvatarError() {
  return {
    type: MANAGE_UPDATE_USER_AVATAR_DISMISS_ERROR,
  };
}

export function useUpdateUserAvatar() {
  const dispatch = useDispatch();

  const { updateUserAvatarPending, updateUserAvatarError } = useSelector(
    state => ({
      updateUserAvatarPending: state.manage.updateUserAvatarPending,
      updateUserAvatarError: state.manage.updateUserAvatarError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(updateUserAvatar(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissUpdateUserAvatarError());
  }, [dispatch]);

  return {
    updateUserAvatar: boundAction,
    updateUserAvatarPending,
    updateUserAvatarError,
    dismissUpdateUserAvatarError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case MANAGE_UPDATE_USER_AVATAR_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        updateUserAvatarPending: true,
        updateUserAvatarError: null,
      };

    case MANAGE_UPDATE_USER_AVATAR_SUCCESS:
      // The request is success
      return {
        ...state,
        updateUserAvatarPending: false,
        updateUserAvatarError: null,
      };

    case MANAGE_UPDATE_USER_AVATAR_FAILURE:
      // The request is failed
      return {
        ...state,
        updateUserAvatarPending: false,
        updateUserAvatarError: action.data.error,
      };

    case MANAGE_UPDATE_USER_AVATAR_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        updateUserAvatarError: null,
      };

    default:
      return state;
  }
}
