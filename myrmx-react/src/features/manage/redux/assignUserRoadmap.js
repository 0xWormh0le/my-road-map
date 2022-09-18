import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  MANAGE_ASSIGN_USER_ROADMAP_BEGIN,
  MANAGE_ASSIGN_USER_ROADMAP_SUCCESS,
  MANAGE_ASSIGN_USER_ROADMAP_FAILURE,
  MANAGE_ASSIGN_USER_ROADMAP_DISMISS_ERROR,
} from './constants';
import fp from 'lodash/fp';
import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function assignUserRoadmap(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: MANAGE_ASSIGN_USER_ROADMAP_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const { userId, roadmapId } = args
      const doRequest = axios.post(
        `${config.apiRootUrl}/users/${userId}/assigned-roadmaps/`,
        { roadmap_id: roadmapId },
        createAxiosConfigWithAuth(getState())
      );

      doRequest.then(
        (res) => {
          dispatch({
            type: MANAGE_ASSIGN_USER_ROADMAP_SUCCESS,
            data: roadmapId,
          });
          resolve(roadmapId);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: MANAGE_ASSIGN_USER_ROADMAP_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissAssignUserRoadmapError() {
  return {
    type: MANAGE_ASSIGN_USER_ROADMAP_DISMISS_ERROR,
  };
}

export function useAssignUserRoadmap() {
  const dispatch = useDispatch();

  const { assignUserRoadmapPending, assignUserRoadmapError } = useSelector(
    state => ({
      assignUserRoadmapPending: state.manage.assignUserRoadmapPending,
      assignUserRoadmapError: state.manage.assignUserRoadmapError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(assignUserRoadmap(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissAssignUserRoadmapError());
  }, [dispatch]);

  return {
    assignUserRoadmap: boundAction,
    assignUserRoadmapPending,
    assignUserRoadmapError,
    dismissAssignUserRoadmapError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case MANAGE_ASSIGN_USER_ROADMAP_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        assignUserRoadmapPending: true,
        assignUserRoadmapError: null,
      };

    case MANAGE_ASSIGN_USER_ROADMAP_SUCCESS:
      // The request is success
      const assigned = state.userRoadmaps.available.filter(rm => rm.id === action.data)
      const available = state.userRoadmaps.available.filter(rm => rm.id !== action.data)

      return fp.compose(
        fp.set('userRoadmaps.assigned', state.userRoadmaps.assigned.concat(assigned)),
        fp.set('userRoadmaps.available', available),
        fp.set('assignUserRoadmapPending', false),
        fp.set('assignUserRoadmapError', null),
      )(state)

    case MANAGE_ASSIGN_USER_ROADMAP_FAILURE:
      // The request is failed
      return {
        ...state,
        assignUserRoadmapPending: false,
        assignUserRoadmapError: action.data.error,
      };

    case MANAGE_ASSIGN_USER_ROADMAP_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        assignUserRoadmapError: null,
      };

    default:
      return state;
  }
}
