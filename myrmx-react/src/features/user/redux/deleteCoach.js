import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  USER_DELETE_COACH_BEGIN,
  USER_DELETE_COACH_SUCCESS,
  USER_DELETE_COACH_FAILURE,
  USER_DELETE_COACH_DISMISS_ERROR,
} from './constants';

import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function deleteCoach(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: USER_DELETE_COACH_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.post(
        `${config.apiRootUrl}/remove-coach/`,
        { coach_id: args },
        createAxiosConfigWithAuth(getState())
      );

      doRequest.then(
        (res) => {
          dispatch({
            type: USER_DELETE_COACH_SUCCESS,
            data: args,
          });
          resolve(args);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: USER_DELETE_COACH_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissDeleteCoachError() {
  return {
    type: USER_DELETE_COACH_DISMISS_ERROR,
  };
}

export function useDeleteCoach() {
  const dispatch = useDispatch();

  const { deleteCoachPending, deleteCoachError } = useSelector(
    state => ({
      deleteCoachPending: state.user.deleteCoachPending,
      deleteCoachError: state.user.deleteCoachError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(deleteCoach(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissDeleteCoachError());
  }, [dispatch]);

  return {
    deleteCoach: boundAction,
    deleteCoachPending,
    deleteCoachError,
    dismissDeleteCoachError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case USER_DELETE_COACH_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        deleteCoachPending: true,
        deleteCoachError: null,
      };

    case USER_DELETE_COACH_SUCCESS:
      // The request is success
      return {
        ...state,
        deleteCoachPending: false,
        deleteCoachError: null,
      };

    case USER_DELETE_COACH_FAILURE:
      // The request is failed
      return {
        ...state,
        deleteCoachPending: false,
        deleteCoachError: action.data.error,
      };

    case USER_DELETE_COACH_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        deleteCoachError: null,
      };

    default:
      return state;
  }
}
