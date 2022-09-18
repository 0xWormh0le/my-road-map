import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  MANAGE_UPDATE_USER_BEGIN,
  MANAGE_UPDATE_USER_SUCCESS,
  MANAGE_UPDATE_USER_FAILURE,
  MANAGE_UPDATE_USER_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function updateUser(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: MANAGE_UPDATE_USER_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const { userId, data } = args
      const doRequest = axios.patch(
        `${config.apiRootUrl}/users/${userId}/`,
        data,
        createAxiosConfigWithAuth(getState())
      );
      doRequest.then(
        (res) => {
          dispatch({
            type: MANAGE_UPDATE_USER_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: MANAGE_UPDATE_USER_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissUpdateUserError() {
  return {
    type: MANAGE_UPDATE_USER_DISMISS_ERROR,
  };
}

export function useUpdateUser() {
  const dispatch = useDispatch();

  const { updateUserPending, updateUserError } = useSelector(
    state => ({
      updateUserPending: state.manage.updateUserPending,
      updateUserError: state.manage.updateUserError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(updateUser(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissUpdateUserError());
  }, [dispatch]);

  return {
    updateUser: boundAction,
    updateUserPending,
    updateUserError,
    dismissUpdateUserError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case MANAGE_UPDATE_USER_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        updateUserPending: true,
        updateUserError: null,
      };

    case MANAGE_UPDATE_USER_SUCCESS:
      // The request is success
      return {
        ...state,
        updateUserPending: false,
        updateUserError: null,
      };

    case MANAGE_UPDATE_USER_FAILURE:
      // The request is failed
      return {
        ...state,
        updateUserPending: false,
        updateUserError: action.data.error,
      };

    case MANAGE_UPDATE_USER_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        updateUserError: null,
      };

    default:
      return state;
  }
}
