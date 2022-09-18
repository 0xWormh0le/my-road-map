import axios from 'axios';
import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  USER_UPDATE_PROFILE_PHOTO_BEGIN,
  USER_UPDATE_PROFILE_PHOTO_SUCCESS,
  USER_UPDATE_PROFILE_PHOTO_FAILURE,
  USER_UPDATE_PROFILE_PHOTO_DISMISS_ERROR,
} from './constants';
import config from '../../../common/config';
import { createAxiosConfigWithAuth, createAxiosFormDataConfigWithAuth } from '../../../common/apiHelpers';

export function updateProfilePhoto(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: USER_UPDATE_PROFILE_PHOTO_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      let doRequest = axios.patch(`${config.apiRootUrl}/profile/`, args, createAxiosFormDataConfigWithAuth(getState()));
      if (!args) {
        doRequest = axios.patch(`${config.apiRootUrl}/profile/`, { photo: null }, createAxiosConfigWithAuth(getState()));
      }
      doRequest.then(
        (res) => {
          dispatch({
            type: USER_UPDATE_PROFILE_PHOTO_SUCCESS,
            data: res.data.photo,
          });

          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: USER_UPDATE_PROFILE_PHOTO_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissUpdateProfilePhotoError() {
  return {
    type: USER_UPDATE_PROFILE_PHOTO_DISMISS_ERROR,
  };
}

export function useUpdateProfilePhoto() {
  const dispatch = useDispatch();

  const { userPhoto, updateProfilePhotoPending, updateProfilePhotoError } = useSelector(
    state => ({
      userPhoto: state.user.userPhoto,
      updateProfilePhotoPending: state.user.updateProfilePhotoPending,
      updateProfilePhotoError: state.user.updateProfilePhotoError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(updateProfilePhoto(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissUpdateProfilePhotoError());
  }, [dispatch]);

  return {
    userPhoto,
    updateProfilePhoto: boundAction,
    updateProfilePhotoPending,
    updateProfilePhotoError,
    dismissUpdateProfilePhotoError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case USER_UPDATE_PROFILE_PHOTO_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        updateProfilePhotoPending: true,
        updateProfilePhotoError: null,
      };

    case USER_UPDATE_PROFILE_PHOTO_SUCCESS:
      // The request is success
      return {
        ...state,
        userPhoto: action.data,
        updateProfilePhotoPending: false,
        updateProfilePhotoError: null,
      };

    case USER_UPDATE_PROFILE_PHOTO_FAILURE:
      // The request is failed
      return {
        ...state,
        updateProfilePhotoPending: false,
        updateProfilePhotoError: action.data.error,
      };

    case USER_UPDATE_PROFILE_PHOTO_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        updateProfilePhotoError: null,
      };

    default:
      return state;
  }
}
