import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  ROADMAP_FETCH_ROADMAP_COACHES_BEGIN,
  ROADMAP_FETCH_ROADMAP_COACHES_SUCCESS,
  ROADMAP_FETCH_ROADMAP_COACHES_FAILURE,
  ROADMAP_FETCH_ROADMAP_COACHES_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import fp from 'lodash/fp'
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function fetchRoadmapCoaches(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: ROADMAP_FETCH_ROADMAP_COACHES_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const { roadmapId, type } = args

      const doRequest = axios.get(`${config.apiRootUrl}/roadmaps/${roadmapId}/${type}-coaches/`, createAxiosConfigWithAuth(getState()));
      
      doRequest.then(
        (res) => {
          const result = { type, data: res.data.results }
          dispatch({
            type: ROADMAP_FETCH_ROADMAP_COACHES_SUCCESS,
            data: result,
          });
          resolve(result);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: ROADMAP_FETCH_ROADMAP_COACHES_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissFetchRoadmapCoachesError() {
  return {
    type: ROADMAP_FETCH_ROADMAP_COACHES_DISMISS_ERROR,
  };
}

export function useFetchRoadmapCoaches() {
  const dispatch = useDispatch();

  const { roadmapCoaches, fetchRoadmapCoachesPending, fetchRoadmapCoachesError } = useSelector(
    state => ({
      roadmapCoaches: state.roadmap.roadmapCoaches,
      fetchRoadmapCoachesPending: state.roadmap.fetchRoadmapCoachesPending,
      fetchRoadmapCoachesError: state.roadmap.fetchRoadmapCoachesError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(fetchRoadmapCoaches(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissFetchRoadmapCoachesError());
  }, [dispatch]);

  return {
    roadmapCoaches,
    fetchRoadmapCoaches: boundAction,
    fetchRoadmapCoachesPending,
    fetchRoadmapCoachesError,
    dismissFetchRoadmapCoachesError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case ROADMAP_FETCH_ROADMAP_COACHES_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        fetchRoadmapCoachesPending: true,
        fetchRoadmapCoachesError: null,
      };

    case ROADMAP_FETCH_ROADMAP_COACHES_SUCCESS:
      // The request is success

      return fp.compose(
        fp.set(`roadmapCoaches.${action.data.type}`, action.data.data),
        fp.set('fetchRoadmapCoachesPending', false),
        fp.set('fetchRoadmapCoachesError', null),
      )(state)

    case ROADMAP_FETCH_ROADMAP_COACHES_FAILURE:
      // The request is failed
      return {
        ...state,
        fetchRoadmapCoachesPending: false,
        fetchRoadmapCoachesError: action.data.error,
      };

    case ROADMAP_FETCH_ROADMAP_COACHES_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        fetchRoadmapCoachesError: null,
      };

    default:
      return state;
  }
}
