import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  MANAGE_UPDATE_ROADMAP_BEGIN,
  MANAGE_UPDATE_ROADMAP_SUCCESS,
  MANAGE_UPDATE_ROADMAP_FAILURE,
  MANAGE_UPDATE_ROADMAP_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function updateRoadmap(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: MANAGE_UPDATE_ROADMAP_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const { roadmapId, data } = args;
      const doRequest = axios.patch(
        `${config.apiRootUrl}/roadmaps/${roadmapId}/`,
        data,
        createAxiosConfigWithAuth(getState())
      );

      doRequest.then(
        (res) => {
          dispatch({
            type: MANAGE_UPDATE_ROADMAP_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: MANAGE_UPDATE_ROADMAP_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissUpdateRoadmapError() {
  return {
    type: MANAGE_UPDATE_ROADMAP_DISMISS_ERROR,
  };
}

export function useUpdateRoadmap() {
  const dispatch = useDispatch();

  const { updateRoadmapPending, updateRoadmapError } = useSelector(
    state => ({
      updateRoadmapPending: state.manage.updateRoadmapPending,
      updateRoadmapError: state.manage.updateRoadmapError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(updateRoadmap(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissUpdateRoadmapError());
  }, [dispatch]);

  return {
    updateRoadmap: boundAction,
    updateRoadmapPending,
    updateRoadmapError,
    dismissUpdateRoadmapError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case MANAGE_UPDATE_ROADMAP_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        updateRoadmapPending: true,
        updateRoadmapError: null,
      };

    case MANAGE_UPDATE_ROADMAP_SUCCESS:
      // The request is success
      return {
        ...state,
        updateRoadmapPending: false,
        updateRoadmapError: null,
      };

    case MANAGE_UPDATE_ROADMAP_FAILURE:
      // The request is failed
      return {
        ...state,
        updateRoadmapPending: false,
        updateRoadmapError: action.data.error,
      };

    case MANAGE_UPDATE_ROADMAP_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        updateRoadmapError: null,
      };

    default:
      return state;
  }
}
