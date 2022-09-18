import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  ROADMAP_FETCH_ROADMAP_BEGIN,
  ROADMAP_FETCH_ROADMAP_SUCCESS,
  ROADMAP_FETCH_ROADMAP_FAILURE,
  ROADMAP_FETCH_ROADMAP_DISMISS_ERROR,
} from './constants';

import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function fetchRoadmap(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: ROADMAP_FETCH_ROADMAP_BEGIN,
    });

    const { roadmapId } = args;
    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.get(
        `${config.apiRootUrl}/roadmaps/${roadmapId}/`,
        createAxiosConfigWithAuth(getState()),
      );
      doRequest.then(
        (res) => {
          dispatch({
            type: ROADMAP_FETCH_ROADMAP_SUCCESS,
            data: res.data,
          });
          resolve(res.data);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: ROADMAP_FETCH_ROADMAP_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissFetchRoadmapError() {
  return {
    type: ROADMAP_FETCH_ROADMAP_DISMISS_ERROR,
  };
}

export function useFetchRoadmap() {
  const dispatch = useDispatch();

  const { roadmaps, fetchRoadmapPending, fetchRoadmapError } = useSelector(
    state => ({
      roadmaps: state.roadmap.roadmaps,
      fetchRoadmapPending: state.roadmap.fetchRoadmapPending,
      fetchRoadmapError: state.roadmap.fetchRoadmapError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(fetchRoadmap(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissFetchRoadmapError());
  }, [dispatch]);

  return {
    roadmaps,
    fetchRoadmap: boundAction,
    fetchRoadmapPending,
    fetchRoadmapError,
    dismissFetchRoadmapError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case ROADMAP_FETCH_ROADMAP_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        fetchRoadmapPending: true,
        fetchRoadmapError: null,
      };

    case ROADMAP_FETCH_ROADMAP_SUCCESS:
      // The request is success
      return {
        ...state,
        fetchRoadmapPending: false,
        fetchRoadmapError: null,
        roadmaps: Object.assign({}, state.roadmaps, { [action.data.id]: action.data }),
      };

    case ROADMAP_FETCH_ROADMAP_FAILURE:
      // The request is failed
      return {
        ...state,
        fetchRoadmapPending: false,
        fetchRoadmapError: action.data.error,
      };

    case ROADMAP_FETCH_ROADMAP_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        fetchRoadmapError: null,
      };

    default:
      return state;
  }
}
