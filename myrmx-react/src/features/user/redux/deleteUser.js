import axios from 'axios';
import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  USER_DELETE_USER_BEGIN,
  USER_DELETE_USER_SUCCESS,
  USER_DELETE_USER_FAILURE,
  USER_DELETE_USER_DISMISS_ERROR,
} from './constants';
import { logout } from '../../common/redux/logout';

import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function deleteUser(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: USER_DELETE_USER_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.delete(`${config.apiRootUrl}/profile/`, createAxiosConfigWithAuth(getState()));
      doRequest.then(
        (res) => {
          dispatch({
            type: USER_DELETE_USER_SUCCESS,
            data: res,
          });
          dispatch(logout())
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: USER_DELETE_USER_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissDeleteUserError() {
  return {
    type: USER_DELETE_USER_DISMISS_ERROR,
  };
}

export function useDeleteUser() {
  const dispatch = useDispatch();

  const { deleteUserPending, deleteUserError } = useSelector(
    state => ({
      deleteUserPending: state.user.deleteUserPending,
      deleteUserError: state.user.deleteUserError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(deleteUser(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissDeleteUserError());
  }, [dispatch]);

  return {
    deleteUser: boundAction,
    deleteUserPending,
    deleteUserError,
    dismissDeleteUserError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case USER_DELETE_USER_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        deleteUserPending: true,
        deleteUserError: null,
      };

    case USER_DELETE_USER_SUCCESS:
      // The request is success
      return {
        ...state,
        deleteUserPending: false,
        deleteUserError: null,
      };

    case USER_DELETE_USER_FAILURE:
      // The request is failed
      return {
        ...state,
        deleteUserPending: false,
        deleteUserError: action.data.error,
      };

    case USER_DELETE_USER_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        deleteUserError: null,
      };

    default:
      return state;
  }
}
