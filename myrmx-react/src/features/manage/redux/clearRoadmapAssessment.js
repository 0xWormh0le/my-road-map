import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  MANAGE_CLEAR_ROADMAP_ASSESSMENT_BEGIN,
  MANAGE_CLEAR_ROADMAP_ASSESSMENT_SUCCESS,
  MANAGE_CLEAR_ROADMAP_ASSESSMENT_FAILURE,
  MANAGE_CLEAR_ROADMAP_ASSESSMENT_DISMISS_ERROR,
} from './constants';

import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function clearRoadmapAssessment(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: MANAGE_CLEAR_ROADMAP_ASSESSMENT_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const { roadmapId } = args;
      const doRequest = axios.post(
        `${config.apiRootUrl}/roadmaps/${roadmapId}/clear-assessments/`,
        args,
        createAxiosConfigWithAuth(getState())
      )
      doRequest.then(
        (res) => {
          dispatch({
            type: MANAGE_CLEAR_ROADMAP_ASSESSMENT_SUCCESS,
            data: res.data,
          });
          resolve(res.data);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: MANAGE_CLEAR_ROADMAP_ASSESSMENT_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissClearRoadmapAssessmentError() {
  return {
    type: MANAGE_CLEAR_ROADMAP_ASSESSMENT_DISMISS_ERROR,
  };
}

export function useClearRoadmapAssessment() {
  const dispatch = useDispatch();

  const { clearRoadmapAssessmentPending, clearRoadmapAssessmentError } = useSelector(
    state => ({
      clearRoadmapAssessmentPending: state.manage.clearRoadmapAssessmentPending,
      clearRoadmapAssessmentError: state.manage.clearRoadmapAssessmentError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(clearRoadmapAssessment(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissClearRoadmapAssessmentError());
  }, [dispatch]);

  return {
    clearRoadmapAssessment: boundAction,
    clearRoadmapAssessmentPending,
    clearRoadmapAssessmentError,
    dismissClearRoadmapAssessmentError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case MANAGE_CLEAR_ROADMAP_ASSESSMENT_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        clearRoadmapAssessmentPending: true,
        clearRoadmapAssessmentError: null,
      };

    case MANAGE_CLEAR_ROADMAP_ASSESSMENT_SUCCESS:
      // The request is success
      return {
        ...state,
        clearRoadmapAssessmentPending: false,
        clearRoadmapAssessmentError: null,
      };

    case MANAGE_CLEAR_ROADMAP_ASSESSMENT_FAILURE:
      // The request is failed
      return {
        ...state,
        clearRoadmapAssessmentPending: false,
        clearRoadmapAssessmentError: action.data.error,
      };

    case MANAGE_CLEAR_ROADMAP_ASSESSMENT_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        clearRoadmapAssessmentError: null,
      };

    default:
      return state;
  }
}
