import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  MANAGE_BULK_ASSIGN_USER_ROADMAPS_BEGIN,
  MANAGE_BULK_ASSIGN_USER_ROADMAPS_SUCCESS,
  MANAGE_BULK_ASSIGN_USER_ROADMAPS_FAILURE,
  MANAGE_BULK_ASSIGN_USER_ROADMAPS_DISMISS_ERROR,
} from './constants';

import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';


export function bulkAssignUserRoadmaps(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: MANAGE_BULK_ASSIGN_USER_ROADMAPS_BEGIN,
    });

    const { userId, ids } = args
    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.post(
        `${config.apiRootUrl}/users/${userId}/assigned-roadmaps/bulk-assign/`,
        { roadmaps: ids },
        createAxiosConfigWithAuth(getState())
      );
      doRequest.then(
        (res) => {
          dispatch({
            type: MANAGE_BULK_ASSIGN_USER_ROADMAPS_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: MANAGE_BULK_ASSIGN_USER_ROADMAPS_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissBulkAssignUserRoadmapsError() {
  return {
    type: MANAGE_BULK_ASSIGN_USER_ROADMAPS_DISMISS_ERROR,
  };
}

export function useBulkAssignUserRoadmaps() {
  const dispatch = useDispatch();

  const { bulkAssignUserRoadmapsPending, bulkAssignUserRoadmapsError } = useSelector(
    state => ({
      bulkAssignUserRoadmapsPending: state.manage.bulkAssignUserRoadmapsPending,
      bulkAssignUserRoadmapsError: state.manage.bulkAssignUserRoadmapsError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(bulkAssignUserRoadmaps(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissBulkAssignUserRoadmapsError());
  }, [dispatch]);

  return {
    bulkAssignUserRoadmaps: boundAction,
    bulkAssignUserRoadmapsPending,
    bulkAssignUserRoadmapsError,
    dismissBulkAssignUserRoadmapsError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case MANAGE_BULK_ASSIGN_USER_ROADMAPS_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        bulkAssignUserRoadmapsPending: true,
        bulkAssignUserRoadmapsError: null,
      };

    case MANAGE_BULK_ASSIGN_USER_ROADMAPS_SUCCESS:
      // The request is success
      return {
        ...state,
        bulkAssignUserRoadmapsPending: false,
        bulkAssignUserRoadmapsError: null,
      };

    case MANAGE_BULK_ASSIGN_USER_ROADMAPS_FAILURE:
      // The request is failed
      return {
        ...state,
        bulkAssignUserRoadmapsPending: false,
        bulkAssignUserRoadmapsError: action.data.error,
      };

    case MANAGE_BULK_ASSIGN_USER_ROADMAPS_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        bulkAssignUserRoadmapsError: null,
      };

    default:
      return state;
  }
}
