import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  MANAGE_COPY_ROADMAP_BEGIN,
  MANAGE_COPY_ROADMAP_SUCCESS,
  MANAGE_COPY_ROADMAP_FAILURE,
  MANAGE_COPY_ROADMAP_DISMISS_ERROR,
} from './constants';

import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function copyRoadmap(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: MANAGE_COPY_ROADMAP_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const { roadmapId } = args;
      const doRequest = axios.post(
        `${config.apiRootUrl}/roadmaps/${roadmapId}/copy-roadmap/`,
        args,
        createAxiosConfigWithAuth(getState())
      )

      doRequest.then(
        (res) => {
          dispatch({
            type: MANAGE_COPY_ROADMAP_SUCCESS,
            data: res.data,
          });
          resolve(res.data);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: MANAGE_COPY_ROADMAP_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissCopyRoadmapError() {
  return {
    type: MANAGE_COPY_ROADMAP_DISMISS_ERROR,
  };
}

export function useCopyRoadmap() {
  const dispatch = useDispatch();

  const { copyRoadmapPending, copyRoadmapError } = useSelector(
    state => ({
      copyRoadmapPending: state.manage.copyRoadmapPending,
      copyRoadmapError: state.manage.copyRoadmapError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(copyRoadmap(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissCopyRoadmapError());
  }, [dispatch]);

  return {
    copyRoadmap: boundAction,
    copyRoadmapPending,
    copyRoadmapError,
    dismissCopyRoadmapError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case MANAGE_COPY_ROADMAP_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        copyRoadmapPending: true,
        copyRoadmapError: null,
      };

    case MANAGE_COPY_ROADMAP_SUCCESS:
      // The request is success
      return {
        ...state,
        copyRoadmapPending: false,
        copyRoadmapError: null,
      };

    case MANAGE_COPY_ROADMAP_FAILURE:
      // The request is failed
      return {
        ...state,
        copyRoadmapPending: false,
        copyRoadmapError: action.data.error,
      };

    case MANAGE_COPY_ROADMAP_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        copyRoadmapError: null,
      };

    default:
      return state;
  }
}
