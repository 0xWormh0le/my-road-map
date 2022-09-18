import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import fp from 'lodash/fp';
import {
  MANAGE_FETCH_COHORT_USERS_BEGIN,
  MANAGE_FETCH_COHORT_USERS_SUCCESS,
  MANAGE_FETCH_COHORT_USERS_FAILURE,
  MANAGE_FETCH_COHORT_USERS_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function fetchCohortUsers(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: MANAGE_FETCH_COHORT_USERS_BEGIN,
    });

    const { cohortId, page } = args
    const url = `${config.apiRootUrl}/cohorts/${cohortId}/users/`

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.get(url, {
        params: {
          page: page ? page + 1 : undefined
        },
        ...createAxiosConfigWithAuth(getState())
      })

      doRequest.then(
        (res) => {
          const results = { page, ...res.data };
          dispatch({
            type: MANAGE_FETCH_COHORT_USERS_SUCCESS,
            data: results,
          });
          resolve(results);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: MANAGE_FETCH_COHORT_USERS_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissFetchCohortUsersError() {
  return {
    type: MANAGE_FETCH_COHORT_USERS_DISMISS_ERROR,
  };
}

export function useFetchCohortUsers() {
  const dispatch = useDispatch();

  const { cohortUsers, fetchCohortUsersPending, fetchCohortUsersError } = useSelector(
    state => ({
      fetchCohortUsersPending: state.manage.fetchCohortUsersPending,
      fetchCohortUsersError: state.manage.fetchCohortUsersError,
      cohortUsers: state.manage.cohortUsers
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(fetchCohortUsers(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissFetchCohortUsersError());
  }, [dispatch]);

  return {
    cohortUsers,
    fetchCohortUsers: boundAction,
    fetchCohortUsersPending,
    fetchCohortUsersError,
    dismissFetchCohortUsersError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case MANAGE_FETCH_COHORT_USERS_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        fetchCohortUsersPending: true,
        fetchCohortUsersError: null,
      };

    case MANAGE_FETCH_COHORT_USERS_SUCCESS:
      const page = action.data.page || 0
      const results = page === 0 ? [] : state.cohortUsers.results
      return fp.compose(
        fp.set('cohortUsers', {
          page,
          next: action.data.next,
          count: action.data.count,
          results: results.concat(action.data.results)
        }),
        fp.set('fetchCohortUsersPending', false),
        fp.set('fetchCohortUsersError', null)
      )(state);

    case MANAGE_FETCH_COHORT_USERS_FAILURE:
      // The request is failed
      return {
        ...state,
        fetchCohortUsersPending: false,
        fetchCohortUsersError: action.data.error,
      };

    case MANAGE_FETCH_COHORT_USERS_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        fetchCohortUsersError: null,
      };

    default:
      return state;
  }
}
