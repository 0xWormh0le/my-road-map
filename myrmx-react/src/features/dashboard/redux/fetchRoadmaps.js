import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import axios from 'axios';
import {
  DASHBOARD_FETCH_ROADMAPS_BEGIN,
  DASHBOARD_FETCH_ROADMAPS_SUCCESS,
  DASHBOARD_FETCH_ROADMAPS_FAILURE,
  DASHBOARD_FETCH_ROADMAPS_DISMISS_ERROR,
} from './constants';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function fetchRoadmaps(args = {}) {
  return (dispatch, getState) => {
    dispatch({
      type: DASHBOARD_FETCH_ROADMAPS_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const { assignedCoaches, search, page, ordering, asStudent } = args
      const doRequest = axios.get(
        `${config.apiRootUrl}/roadmaps/`,
        {
          params: {
            details: assignedCoaches ? 'assigned-coaches' : undefined,
            search,
            ordering,
            page: page ? page + 1 : undefined,
            asStudent,
          },
          ...createAxiosConfigWithAuth(getState()),
        }
      );
      doRequest.then(
        (res) => {
          dispatch({
            type: DASHBOARD_FETCH_ROADMAPS_SUCCESS,
            data: { page, ...res.data },
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: DASHBOARD_FETCH_ROADMAPS_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissFetchRoadmapsError() {
  return {
    type: DASHBOARD_FETCH_ROADMAPS_DISMISS_ERROR,
  };
}

export function useFetchRoadmaps(params) {
  const dispatch = useDispatch();

  const { roadmaps, fetchRoadmapsPending, fetchRoadmapsError } = useSelector(
    state => ({
      roadmaps: state.dashboard.roadmaps,
      fetchRoadmapsPending: state.dashboard.fetchRoadmapsPending,
      fetchRoadmapsError: state.dashboard.fetchRoadmapsError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(fetchRoadmaps(...args));
  }, [dispatch]);

  useEffect(() => {
    if (params) boundAction(...(params || []));
  }, [...(params || []), boundAction]); // eslint-disable-line

  const boundDismissError = useCallback(() => {
    return dispatch(dismissFetchRoadmapsError());
  }, [dispatch]);

  return {
    roadmaps,
    fetchRoadmaps: boundAction,
    fetchRoadmapsPending,
    fetchRoadmapsError,
    dismissFetchRoadmapsError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case DASHBOARD_FETCH_ROADMAPS_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        fetchRoadmapsPending: true,
        fetchRoadmapsError: null,
      };

    case DASHBOARD_FETCH_ROADMAPS_SUCCESS:
      // The request is success
      const page = action.data.page || 0
      const results = page === 0 ? [] : state.roadmaps.results

      return {
        ...state,
        fetchRoadmapsPending: false,
        fetchRoadmapsError: null,
        roadmaps: {
          page,
          next: action.data.next,
          count: action.data.count,
          results: results.concat(action.data.results),
        },
      };

    case DASHBOARD_FETCH_ROADMAPS_FAILURE:
      // The request is failed
      return {
        ...state,
        fetchRoadmapsPending: false,
        fetchRoadmapsError: action.data.error,
      };

    case DASHBOARD_FETCH_ROADMAPS_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        fetchRoadmapsError: null,
      };

    default:
      return state;
  }
}
