import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  ROADMAP_BULK_ASSIGN_ROADMAP_COACHES_BEGIN,
  ROADMAP_BULK_ASSIGN_ROADMAP_COACHES_SUCCESS,
  ROADMAP_BULK_ASSIGN_ROADMAP_COACHES_FAILURE,
  ROADMAP_BULK_ASSIGN_ROADMAP_COACHES_DISMISS_ERROR,
} from './constants';

import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function bulkAssignRoadmapCoaches(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: ROADMAP_BULK_ASSIGN_ROADMAP_COACHES_BEGIN,
    });

    const { roadmapId, ids } = args
    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.post(
        `${config.apiRootUrl}/roadmaps/${roadmapId}/assigned-coaches/bulk-assign/`,
        { coaches: ids },
        createAxiosConfigWithAuth(getState())
      );

      doRequest.then(
        (res) => {
          dispatch({
            type: ROADMAP_BULK_ASSIGN_ROADMAP_COACHES_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: ROADMAP_BULK_ASSIGN_ROADMAP_COACHES_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissBulkAssignRoadmapCoachesError() {
  return {
    type: ROADMAP_BULK_ASSIGN_ROADMAP_COACHES_DISMISS_ERROR,
  };
}

export function useBulkAssignRoadmapCoaches() {
  const dispatch = useDispatch();

  const { bulkAssignRoadmapCoachesPending, bulkAssignRoadmapCoachesError } = useSelector(
    state => ({
      bulkAssignRoadmapCoachesPending: state.roadmap.bulkAssignRoadmapCoachesPending,
      bulkAssignRoadmapCoachesError: state.roadmap.bulkAssignRoadmapCoachesError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(bulkAssignRoadmapCoaches(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissBulkAssignRoadmapCoachesError());
  }, [dispatch]);

  return {
    bulkAssignRoadmapCoaches: boundAction,
    bulkAssignRoadmapCoachesPending,
    bulkAssignRoadmapCoachesError,
    dismissBulkAssignRoadmapCoachesError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case ROADMAP_BULK_ASSIGN_ROADMAP_COACHES_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        bulkAssignRoadmapCoachesPending: true,
        bulkAssignRoadmapCoachesError: null,
      };

    case ROADMAP_BULK_ASSIGN_ROADMAP_COACHES_SUCCESS:
      // The request is success
      return {
        ...state,
        bulkAssignRoadmapCoachesPending: false,
        bulkAssignRoadmapCoachesError: null,
      };

    case ROADMAP_BULK_ASSIGN_ROADMAP_COACHES_FAILURE:
      // The request is failed
      return {
        ...state,
        bulkAssignRoadmapCoachesPending: false,
        bulkAssignRoadmapCoachesError: action.data.error,
      };

    case ROADMAP_BULK_ASSIGN_ROADMAP_COACHES_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        bulkAssignRoadmapCoachesError: null,
      };

    default:
      return state;
  }
}
