import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import axios from 'axios';
import {
  MANAGE_DELETE_COHORT_BEGIN,
  MANAGE_DELETE_COHORT_SUCCESS,
  MANAGE_DELETE_COHORT_FAILURE,
  MANAGE_DELETE_COHORT_DISMISS_ERROR,
} from './constants';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function deleteCohort(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: MANAGE_DELETE_COHORT_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const { cohortId } = args
      const doRequest = axios.delete(
        `${config.apiRootUrl}/cohorts/${cohortId}/`,
        createAxiosConfigWithAuth(getState())
      )

      doRequest.then(
        (res) => {
          dispatch({
            type: MANAGE_DELETE_COHORT_SUCCESS,
            data: cohortId,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: MANAGE_DELETE_COHORT_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissDeleteCohortError() {
  return {
    type: MANAGE_DELETE_COHORT_DISMISS_ERROR,
  };
}

export function useDeleteCohort() {
  const dispatch = useDispatch();

  const { deleteCohortPending, deleteCohortError } = useSelector(
    state => ({
      deleteCohortPending: state.manage.deleteCohortPending,
      deleteCohortError: state.manage.deleteCohortError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(deleteCohort(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissDeleteCohortError());
  }, [dispatch]);

  return {
    deleteCohort: boundAction,
    deleteCohortPending,
    deleteCohortError,
    dismissDeleteCohortError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case MANAGE_DELETE_COHORT_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        deleteCohortPending: true,
        deleteCohortError: null,
      };

    case MANAGE_DELETE_COHORT_SUCCESS:
      // The request is success
      return {
        ...state,
        cohorts: state.cohorts.filter(c => c.id !== action.data),
        deleteCohortPending: false,
        deleteCohortError: null,
      };

    case MANAGE_DELETE_COHORT_FAILURE:
      // The request is failed
      return {
        ...state,
        deleteCohortPending: false,
        deleteCohortError: action.data.error,
      };

    case MANAGE_DELETE_COHORT_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        deleteCohortError: null,
      };

    default:
      return state;
  }
}
