import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  ROADMAP_FETCH_RECENT_COMPETENCY_BEGIN,
  ROADMAP_FETCH_RECENT_COMPETENCY_SUCCESS,
  ROADMAP_FETCH_RECENT_COMPETENCY_FAILURE,
  ROADMAP_FETCH_RECENT_COMPETENCY_DISMISS_ERROR,
} from './constants';

import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function fetchRecentCompetency(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: ROADMAP_FETCH_RECENT_COMPETENCY_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.get(
        `${config.apiRootUrl}/recent-competencies/`,
        createAxiosConfigWithAuth(getState()),
      );
      doRequest.then(
        (res) => {
          dispatch({
            type: ROADMAP_FETCH_RECENT_COMPETENCY_SUCCESS,
            data: res.data.results,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: ROADMAP_FETCH_RECENT_COMPETENCY_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissFetchRecentCompetencyError() {
  return {
    type: ROADMAP_FETCH_RECENT_COMPETENCY_DISMISS_ERROR,
  };
}

export function useFetchRecentCompetency() {
  const dispatch = useDispatch();

  const { recentCompetencies, fetchRecentCompetencyPending, fetchRecentCompetencyError } = useSelector(
    state => ({
      recentCompetencies: state.roadmap.recentCompetencies,
      fetchRecentCompetencyPending: state.roadmap.fetchRecentCompetencyPending,
      fetchRecentCompetencyError: state.roadmap.fetchRecentCompetencyError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(fetchRecentCompetency(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissFetchRecentCompetencyError());
  }, [dispatch]);

  return {
    recentCompetencies,
    fetchRecentCompetency: boundAction,
    fetchRecentCompetencyPending,
    fetchRecentCompetencyError,
    dismissFetchRecentCompetencyError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case ROADMAP_FETCH_RECENT_COMPETENCY_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        fetchRecentCompetencyPending: true,
        fetchRecentCompetencyError: null,
      };

    case ROADMAP_FETCH_RECENT_COMPETENCY_SUCCESS:
      // The request is success
      return {
        ...state,
        fetchRecentCompetencyPending: false,
        fetchRecentCompetencyError: null,
        recentCompetencies: action.data
      };

    case ROADMAP_FETCH_RECENT_COMPETENCY_FAILURE:
      // The request is failed
      return {
        ...state,
        fetchRecentCompetencyPending: false,
        fetchRecentCompetencyError: action.data.error,
      };

    case ROADMAP_FETCH_RECENT_COMPETENCY_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        fetchRecentCompetencyError: null,
      };

    default:
      return state;
  }
}
