import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  MANAGE_ADD_ROADMAP_BEGIN,
  MANAGE_ADD_ROADMAP_SUCCESS,
  MANAGE_ADD_ROADMAP_FAILURE,
  MANAGE_ADD_ROADMAP_DISMISS_ERROR,
} from './constants';

import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function addRoadmap(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: MANAGE_ADD_ROADMAP_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.post(
        `${config.apiRootUrl}/roadmaps/`,
        args,
        createAxiosConfigWithAuth(getState())
      )
      doRequest.then(
        (res) => {
          dispatch({
            type: MANAGE_ADD_ROADMAP_SUCCESS,
            data: res.data,
          });
          resolve(res.data);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: MANAGE_ADD_ROADMAP_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissAddRoadmapError() {
  return {
    type: MANAGE_ADD_ROADMAP_DISMISS_ERROR,
  };
}

export function useAddRoadmap() {
  const dispatch = useDispatch();

  const { addRoadmapPending, addRoadmapError } = useSelector(
    state => ({
      addRoadmapPending: state.manage.addRoadmapPending,
      addRoadmapError: state.manage.addRoadmapError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(addRoadmap(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissAddRoadmapError());
  }, [dispatch]);

  return {
    addRoadmap: boundAction,
    addRoadmapPending,
    addRoadmapError,
    dismissAddRoadmapError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case MANAGE_ADD_ROADMAP_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        addRoadmapPending: true,
        addRoadmapError: null,
      };

    case MANAGE_ADD_ROADMAP_SUCCESS:
      // The request is success
      return {
        ...state,
        addRoadmapPending: false,
        addRoadmapError: null,
      };

    case MANAGE_ADD_ROADMAP_FAILURE:
      // The request is failed
      return {
        ...state,
        addRoadmapPending: false,
        addRoadmapError: action.data.error,
      };

    case MANAGE_ADD_ROADMAP_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        addRoadmapError: null,
      };

    default:
      return state;
  }
}
