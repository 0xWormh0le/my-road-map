import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  MANAGE_FETCH_COHORTS_BEGIN,
  MANAGE_FETCH_COHORTS_SUCCESS,
  MANAGE_FETCH_COHORTS_FAILURE,
  MANAGE_FETCH_COHORTS_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function fetchCohorts(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: MANAGE_FETCH_COHORTS_BEGIN,
    });

    const { cohortId, page } = args
    const url = `${config.apiRootUrl}/cohorts/` + (cohortId ? `${cohortId}/` : '')
    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.get(
        url,
        {
          params: {
            page: page ? page + 1 : undefined,
          },
          ...createAxiosConfigWithAuth(getState())
        }
      );
      doRequest.then(
        (res) => {
          dispatch({
            type: MANAGE_FETCH_COHORTS_SUCCESS,
            data: cohortId ? { page, results: [ res.data ] } : { page, ...res.data },
          });
          resolve(cohortId ? res.data : res.data.results);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: MANAGE_FETCH_COHORTS_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissFetchCohortsError() {
  return {
    type: MANAGE_FETCH_COHORTS_DISMISS_ERROR,
  };
}

export function useFetchCohorts() {
  const dispatch = useDispatch();

  const { fetchCohortsPending, fetchCohortsError, cohorts } = useSelector(
    state => ({
      cohorts: state.manage.cohorts,
      fetchCohortsPending: state.manage.fetchCohortsPending,
      fetchCohortsError: state.manage.fetchCohortsError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(fetchCohorts(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissFetchCohortsError());
  }, [dispatch]);

  return {
    cohorts,
    fetchCohorts: boundAction,
    fetchCohortsPending,
    fetchCohortsError,
    dismissFetchCohortsError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case MANAGE_FETCH_COHORTS_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        fetchCohortsPending: true,
        fetchCohortsError: null,
      };

    case MANAGE_FETCH_COHORTS_SUCCESS:
      // The request is success
      const page = action.data.page || 0
      const results = page === 0 ? [] : state.cohorts.results

      return {
        ...state,
        cohorts: {
          page,
          next: action.data.next,
          ccount: action.data.count,
          results: results.concat(action.data.results)
        },
        fetchCohortsPending: false,
        fetchCohortsError: null,
      };

    case MANAGE_FETCH_COHORTS_FAILURE:
      // The request is failed
      return {
        ...state,
        fetchCohortsPending: false,
        fetchCohortsError: action.data.error,
      };

    case MANAGE_FETCH_COHORTS_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        fetchCohortsError: null,
      };

    default:
      return state;
  }
}
