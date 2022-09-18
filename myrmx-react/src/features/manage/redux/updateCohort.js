import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  MANAGE_UPDATE_COHORT_BEGIN,
  MANAGE_UPDATE_COHORT_SUCCESS,
  MANAGE_UPDATE_COHORT_FAILURE,
  MANAGE_UPDATE_COHORT_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function updateCohort(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: MANAGE_UPDATE_COHORT_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const { groupId, ...data } = args
      const doRequest = axios.patch(
        `${config.apiRootUrl}/cohorts/${groupId}/`,
        data,
        createAxiosConfigWithAuth(getState())
      )
      doRequest.then(
        (res) => {
          dispatch({
            type: MANAGE_UPDATE_COHORT_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: MANAGE_UPDATE_COHORT_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissUpdateCohortError() {
  return {
    type: MANAGE_UPDATE_COHORT_DISMISS_ERROR,
  };
}

export function useUpdateCohort() {
  const dispatch = useDispatch();

  const { updateCohortPending, updateCohortError } = useSelector(
    state => ({
      updateCohortPending: state.manage.updateCohortPending,
      updateCohortError: state.manage.updateCohortError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(updateCohort(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissUpdateCohortError());
  }, [dispatch]);

  return {
    updateCohort: boundAction,
    updateCohortPending,
    updateCohortError,
    dismissUpdateCohortError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case MANAGE_UPDATE_COHORT_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        updateCohortPending: true,
        updateCohortError: null,
      };

    case MANAGE_UPDATE_COHORT_SUCCESS:
      // The request is success
      return {
        ...state,
        updateCohortPending: false,
        updateCohortError: null,
      };

    case MANAGE_UPDATE_COHORT_FAILURE:
      // The request is failed
      return {
        ...state,
        updateCohortPending: false,
        updateCohortError: action.data.error,
      };

    case MANAGE_UPDATE_COHORT_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        updateCohortError: null,
      };

    default:
      return state;
  }
}
