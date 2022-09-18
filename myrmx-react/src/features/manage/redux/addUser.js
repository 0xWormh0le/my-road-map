import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  MANAGE_ADD_USER_BEGIN,
  MANAGE_ADD_USER_SUCCESS,
  MANAGE_ADD_USER_FAILURE,
  MANAGE_ADD_USER_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function addUser(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: MANAGE_ADD_USER_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.post(
        `${config.apiRootUrl}/users/`,
        args,
        createAxiosConfigWithAuth(getState())
      );
      doRequest.then(
        (res) => {
          dispatch({
            type: MANAGE_ADD_USER_SUCCESS,
            data: res.data,
          });
          resolve(res.data);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: MANAGE_ADD_USER_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissAddUserError() {
  return {
    type: MANAGE_ADD_USER_DISMISS_ERROR,
  };
}

export function useAddUser() {
  const dispatch = useDispatch();

  const { addUserPending, addUserError } = useSelector(
    state => ({
      addUserPending: state.manage.addUserPending,
      addUserError: state.manage.addUserError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(addUser(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissAddUserError());
  }, [dispatch]);

  return {
    addUser: boundAction,
    addUserPending,
    addUserError,
    dismissAddUserError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case MANAGE_ADD_USER_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        addUserPending: true,
        addUserError: null,
      };

    case MANAGE_ADD_USER_SUCCESS:
      // The request is success
      return {
        ...state,
        addUserPending: false,
        addUserError: null,
      };

    case MANAGE_ADD_USER_FAILURE:
      // The request is failed
      return {
        ...state,
        addUserPending: false,
        addUserError: action.data.error,
      };

    case MANAGE_ADD_USER_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        addUserError: null,
      };

    default:
      return state;
  }
}
