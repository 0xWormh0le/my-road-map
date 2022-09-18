import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  MANAGE_DELETE_USER_ROADMAP_BEGIN,
  MANAGE_DELETE_USER_ROADMAP_SUCCESS,
  MANAGE_DELETE_USER_ROADMAP_FAILURE,
  MANAGE_DELETE_USER_ROADMAP_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import config from '../../../common/config';
import fp from 'lodash/fp'
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';


export function deleteUserRoadmap(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: MANAGE_DELETE_USER_ROADMAP_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const { userId, roadmapId } = args
      const doRequest = axios.delete(
        `${config.apiRootUrl}/users/${userId}/assigned-roadmaps/${roadmapId}/`,
        createAxiosConfigWithAuth(getState())
      );
      doRequest.then(
        (res) => {
          dispatch({
            type: MANAGE_DELETE_USER_ROADMAP_SUCCESS,
            data: roadmapId,
          });
          resolve(roadmapId);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: MANAGE_DELETE_USER_ROADMAP_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissDeleteUserRoadmapError() {
  return {
    type: MANAGE_DELETE_USER_ROADMAP_DISMISS_ERROR,
  };
}

export function useDeleteUserRoadmap() {
  const dispatch = useDispatch();

  const { deleteUserRoadmapPending, deleteUserRoadmapError } = useSelector(
    state => ({
      deleteUserRoadmapPending: state.manage.deleteUserRoadmapPending,
      deleteUserRoadmapError: state.manage.deleteUserRoadmapError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(deleteUserRoadmap(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissDeleteUserRoadmapError());
  }, [dispatch]);

  return {
    deleteUserRoadmap: boundAction,
    deleteUserRoadmapPending,
    deleteUserRoadmapError,
    dismissDeleteUserRoadmapError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case MANAGE_DELETE_USER_ROADMAP_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        deleteUserRoadmapPending: true,
        deleteUserRoadmapError: null,
      };

    case MANAGE_DELETE_USER_ROADMAP_SUCCESS:
      // The request is success
      
      if (state.userRoadmaps && state.userRoadmaps.assigned) {
        const available = state.userRoadmaps.assigned.filter(rm => rm.id === action.data)
        const assigned = state.userRoadmaps.assigned.filter(rm => rm.id !== action.data)
  
        return fp.compose(
          fp.set('userRoadmaps.assigned', assigned),
          fp.set('userRoadmaps.available', state.userRoadmaps.available.concat(available)),
          fp.set('deleteUserRoadmapPending', false),
          fp.set('deleteUserRoadmapError', null),
        )(state)
      } else {
        return state
      }

    case MANAGE_DELETE_USER_ROADMAP_FAILURE:
      // The request is failed
      return {
        ...state,
        deleteUserRoadmapPending: false,
        deleteUserRoadmapError: action.data.error,
      };

    case MANAGE_DELETE_USER_ROADMAP_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        deleteUserRoadmapError: null,
      };

    default:
      return state;
  }
}
