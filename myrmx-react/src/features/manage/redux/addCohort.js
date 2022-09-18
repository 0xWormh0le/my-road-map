import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  MANAGE_ADD_COHORT_BEGIN,
  MANAGE_ADD_COHORT_SUCCESS,
  MANAGE_ADD_COHORT_FAILURE,
  MANAGE_ADD_COHORT_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function addCohort(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: MANAGE_ADD_COHORT_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.post(
        `${config.apiRootUrl}/cohorts/`,
        args,
        createAxiosConfigWithAuth(getState())
      )
      doRequest.then(
        (res) => {
          dispatch({
            type: MANAGE_ADD_COHORT_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: MANAGE_ADD_COHORT_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissAddCohortError() {
  return {
    type: MANAGE_ADD_COHORT_DISMISS_ERROR,
  };
}

export function useAddCohort() {
  const dispatch = useDispatch();

  const { addCohortPending, addCohortError } = useSelector(
    state => ({
      addCohortPending: state.manage.addCohortPending,
      addCohortError: state.manage.addCohortError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(addCohort(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissAddCohortError());
  }, [dispatch]);

  return {
    addCohort: boundAction,
    addCohortPending,
    addCohortError,
    dismissAddCohortError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case MANAGE_ADD_COHORT_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        addCohortPending: true,
        addCohortError: null,
      };

    case MANAGE_ADD_COHORT_SUCCESS:
      // The request is success
      return {
        ...state,
        addCohortPending: false,
        addCohortError: null,
      };

    case MANAGE_ADD_COHORT_FAILURE:
      // The request is failed
      return {
        ...state,
        addCohortPending: false,
        addCohortError: action.data.error,
      };

    case MANAGE_ADD_COHORT_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        addCohortError: null,
      };

    default:
      return state;
  }
}
