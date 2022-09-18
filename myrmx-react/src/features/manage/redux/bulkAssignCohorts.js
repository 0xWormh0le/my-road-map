import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  MANAGE_BULK_ASSIGN_COHORTS_BEGIN,
  MANAGE_BULK_ASSIGN_COHORTS_SUCCESS,
  MANAGE_BULK_ASSIGN_COHORTS_FAILURE,
  MANAGE_BULK_ASSIGN_COHORTS_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function bulkAssignCohorts(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: MANAGE_BULK_ASSIGN_COHORTS_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const { roadmapId } = args
      const doRequest = axios.post(
        `${config.apiRootUrl}/roadmaps/${roadmapId}/bulk-assign-cohorts/`,
        args,
        createAxiosConfigWithAuth(getState())
      );
      doRequest.then(
        (res) => {
          dispatch({
            type: MANAGE_BULK_ASSIGN_COHORTS_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: MANAGE_BULK_ASSIGN_COHORTS_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissBulkAssignCohortsError() {
  return {
    type: MANAGE_BULK_ASSIGN_COHORTS_DISMISS_ERROR,
  };
}

export function useBulkAssignCohorts() {
  const dispatch = useDispatch();

  const { bulkAssignCohortsPending, bulkAssignCohortsError } = useSelector(
    state => ({
      bulkAssignCohortsPending: state.manage.bulkAssignCohortsPending,
      bulkAssignCohortsError: state.manage.bulkAssignCohortsError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(bulkAssignCohorts(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissBulkAssignCohortsError());
  }, [dispatch]);

  return {
    bulkAssignCohorts: boundAction,
    bulkAssignCohortsPending,
    bulkAssignCohortsError,
    dismissBulkAssignCohortsError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case MANAGE_BULK_ASSIGN_COHORTS_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        bulkAssignCohortsPending: true,
        bulkAssignCohortsError: null,
      };

    case MANAGE_BULK_ASSIGN_COHORTS_SUCCESS:
      // The request is success
      return {
        ...state,
        bulkAssignCohortsPending: false,
        bulkAssignCohortsError: null,
      };

    case MANAGE_BULK_ASSIGN_COHORTS_FAILURE:
      // The request is failed
      return {
        ...state,
        bulkAssignCohortsPending: false,
        bulkAssignCohortsError: action.data.error,
      };

    case MANAGE_BULK_ASSIGN_COHORTS_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        bulkAssignCohortsError: null,
      };

    default:
      return state;
  }
}
