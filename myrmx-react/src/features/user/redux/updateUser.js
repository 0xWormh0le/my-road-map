import axios from 'axios';
import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  USER_UPDATE_USER_BEGIN,
  USER_UPDATE_USER_SUCCESS,
  USER_UPDATE_USER_FAILURE,
  USER_UPDATE_USER_DISMISS_ERROR,
} from './constants';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function updateUser(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: USER_UPDATE_USER_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.put(`${config.apiRootUrl}/profile/`, args, createAxiosConfigWithAuth(getState()));
      doRequest.then(
        (res) => {
          dispatch({
            type: USER_UPDATE_USER_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: USER_UPDATE_USER_FAILURE,
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
    type: USER_UPDATE_USER_DISMISS_ERROR,
  };
}

export function useUpdateUser() {
  const dispatch = useDispatch();

  const { updateUserPending, updateUserError } = useSelector(
    state => ({
      updateUserPending: state.user.updateUserPending,
      updateUserError: state.user.updateUserError,
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
    case USER_UPDATE_USER_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        updateUserPending: true,
        updateUserError: null,
      };

    case USER_UPDATE_USER_SUCCESS:
      // The request is success
      return {
        ...state,
        updateUserPending: false,
        updateUserError: null,
      };

    case USER_UPDATE_USER_FAILURE:
      // The request is failed
      return {
        ...state,
        updateUserPending: false,
        updateUserError: action.data.error,
      };

    case USER_UPDATE_USER_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        updateUserError: null,
      };

    default:
      return state;
  }
}
