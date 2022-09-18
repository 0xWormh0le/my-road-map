import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  ROADMAP_FETCH_ROADMAP_STAGES_BEGIN,
  ROADMAP_FETCH_ROADMAP_STAGES_SUCCESS,
  ROADMAP_FETCH_ROADMAP_STAGES_FAILURE,
  ROADMAP_FETCH_ROADMAP_STAGES_DISMISS_ERROR,
} from './constants';

import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function fetchRoadmapStages(args = {}) {
  return (dispatch, getState) => {
    // optionally you can have getState as the second argument
    dispatch({
      type: ROADMAP_FETCH_ROADMAP_STAGES_BEGIN,
    });

    const { roadmapId, studentId } = args;
    const requestConfig = createAxiosConfigWithAuth(getState());
    if (studentId) requestConfig.params = { forStudent: studentId };
    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.get(
        `${config.apiRootUrl}/roadmaps/${roadmapId}/stages/`,
        requestConfig,
      );
      doRequest.then(
        res => {
          dispatch({
            type: ROADMAP_FETCH_ROADMAP_STAGES_SUCCESS,
            data: res.data.results,
          });
          resolve(res.data.results);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        err => {
          dispatch({
            type: ROADMAP_FETCH_ROADMAP_STAGES_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissFetchRoadmapStagesError() {
  return {
    type: ROADMAP_FETCH_ROADMAP_STAGES_DISMISS_ERROR,
  };
}

export function useFetchRoadmapStages(params) {
  const dispatch = useDispatch();

  const { stages, fetchRoadmapStagesPending, fetchRoadmapStagesError } = useSelector(
    state => ({
      stages: state.roadmap.stages,
      fetchRoadmapStagesPending: state.roadmap.fetchRoadmapStagesPending,
      fetchRoadmapStagesError: state.roadmap.fetchRoadmapStagesError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (...args) => {
      return dispatch(fetchRoadmapStages(...args));
    },
    [dispatch],
  );

  useEffect(() => {
    if (params) boundAction(...(params || []));
  }, [...(params || []), boundAction]); // eslint-disable-line

  const boundDismissError = useCallback(() => {
    return dispatch(dismissFetchRoadmapStagesError());
  }, [dispatch]);

  return {
    stages,
    fetchRoadmapStages: boundAction,
    fetchRoadmapStagesPending,
    fetchRoadmapStagesError,
    dismissFetchRoadmapStagesError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case ROADMAP_FETCH_ROADMAP_STAGES_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        fetchRoadmapStagesPending: true,
        fetchRoadmapStagesError: null,
      };

    case ROADMAP_FETCH_ROADMAP_STAGES_SUCCESS:
      // The request is success
      return {
        ...state,
        fetchRoadmapStagesPending: false,
        fetchRoadmapStagesError: null,
        stages: Object.assign({}, state.stages, ...action.data.map(s => ({ [s.id]: s }))),
      };

    case ROADMAP_FETCH_ROADMAP_STAGES_FAILURE:
      // The request is failed
      return {
        ...state,
        fetchRoadmapStagesPending: false,
        fetchRoadmapStagesError: action.data.error,
      };

    case ROADMAP_FETCH_ROADMAP_STAGES_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        fetchRoadmapStagesError: null,
      };

    default:
      return state;
  }
}
