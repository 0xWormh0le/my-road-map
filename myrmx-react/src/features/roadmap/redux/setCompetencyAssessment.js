import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  ROADMAP_SET_COMPETENCY_ASSESSMENT_BEGIN,
  ROADMAP_SET_COMPETENCY_ASSESSMENT_SUCCESS,
  ROADMAP_SET_COMPETENCY_ASSESSMENT_FAILURE,
  ROADMAP_SET_COMPETENCY_ASSESSMENT_DISMISS_ERROR,
} from './constants';

import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function setCompetencyAssessment(args = {}) {
  return (dispatch, getState) => {
    // optionally you can have getState as the second argument
    dispatch({
      type: ROADMAP_SET_COMPETENCY_ASSESSMENT_BEGIN,
    });

    const { roadmapId, stageId, competencyId, sliderStatus, status, studentId } = args;

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.post(
        `${config.apiRootUrl}/roadmaps/${roadmapId}/stages/${stageId}/competencies/${competencyId}/assessments/`,
        {
          slider_status: sliderStatus,
          status: status,
          student: studentId
        },
        createAxiosConfigWithAuth(getState()),
      );
      doRequest.then(
        res => {
          dispatch({
            type: ROADMAP_SET_COMPETENCY_ASSESSMENT_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        err => {
          dispatch({
            type: ROADMAP_SET_COMPETENCY_ASSESSMENT_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissSetCompetencyAssessmentError() {
  return {
    type: ROADMAP_SET_COMPETENCY_ASSESSMENT_DISMISS_ERROR,
  };
}

export function useSetCompetencyAssessment() {
  const dispatch = useDispatch();

  const { setCompetencyAssessmentPending, setCompetencyAssessmentError } = useSelector(
    state => ({
      setCompetencyAssessmentPending: state.roadmap.setCompetencyAssessmentPending,
      setCompetencyAssessmentError: state.roadmap.setCompetencyAssessmentError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (...args) => {
      return dispatch(setCompetencyAssessment(...args));
    },
    [dispatch],
  );

  const boundDismissError = useCallback(() => {
    return dispatch(dismissSetCompetencyAssessmentError());
  }, [dispatch]);

  return {
    setCompetencyAssessment: boundAction,
    setCompetencyAssessmentPending,
    setCompetencyAssessmentError,
    dismissSetCompetencyAssessmentError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case ROADMAP_SET_COMPETENCY_ASSESSMENT_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        setCompetencyAssessmentPending: true,
        setCompetencyAssessmentError: null,
      };

    case ROADMAP_SET_COMPETENCY_ASSESSMENT_SUCCESS:
      // The request is success
      return {
        ...state,
        setCompetencyAssessmentPending: false,
        setCompetencyAssessmentError: null,
      };

    case ROADMAP_SET_COMPETENCY_ASSESSMENT_FAILURE:
      // The request is failed
      return {
        ...state,
        setCompetencyAssessmentPending: false,
        setCompetencyAssessmentError: action.data.error,
      };

    case ROADMAP_SET_COMPETENCY_ASSESSMENT_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        setCompetencyAssessmentError: null,
      };

    default:
      return state;
  }
}
