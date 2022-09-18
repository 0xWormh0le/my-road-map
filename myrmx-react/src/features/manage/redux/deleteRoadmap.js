import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  MANAGE_DELETE_ROADMAP_BEGIN,
  MANAGE_DELETE_ROADMAP_SUCCESS,
  MANAGE_DELETE_ROADMAP_FAILURE,
  MANAGE_DELETE_ROADMAP_DISMISS_ERROR,
} from '../redux/constants';
import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function deleteRoadmap(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: MANAGE_DELETE_ROADMAP_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const { roadmapId } = args
      const doRequest = axios.delete(
        `${config.apiRootUrl}/roadmaps/${roadmapId}/`,
        createAxiosConfigWithAuth(getState())
      );
      doRequest.then(
        (res) => {
          dispatch({
            type: MANAGE_DELETE_ROADMAP_SUCCESS,
            data: roadmapId,
          });
          resolve(roadmapId);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: MANAGE_DELETE_ROADMAP_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissDeleteRoadmapError() {
  return {
    type: MANAGE_DELETE_ROADMAP_DISMISS_ERROR,
  };
}

export function useDeleteRoadmap() {
  const dispatch = useDispatch();

  const { deleteRoadmapPending, deleteRoadmapError } = useSelector(
    state => ({
      deleteRoadmapPending: state.manage.deleteRoadmapPending,
      deleteRoadmapError: state.manage.deleteRoadmapError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(deleteRoadmap(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissDeleteRoadmapError());
  }, [dispatch]);

  return {
    deleteRoadmap: boundAction,
    deleteRoadmapPending,
    deleteRoadmapError,
    dismissDeleteRoadmapError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case MANAGE_DELETE_ROADMAP_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        deleteRoadmapPending: true,
        deleteRoadmapError: null,
      };

    case MANAGE_DELETE_ROADMAP_SUCCESS:
      // The request is success
      return {
        ...state,
        // roadmaps: state.roadmaps.filter(x => x.id === action.data),
        deleteRoadmapPending: false,
        deleteRoadmapError: null,
      };

    case MANAGE_DELETE_ROADMAP_FAILURE:
      // The request is failed
      return {
        ...state,
        deleteRoadmapPending: false,
        deleteRoadmapError: action.data.error,
      };

    case MANAGE_DELETE_ROADMAP_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        deleteRoadmapError: null,
      };

    default:
      return state;
  }
}
