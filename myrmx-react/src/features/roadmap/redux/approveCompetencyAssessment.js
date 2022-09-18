import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  ROADMAP_APPROVE_COMPETENCY_ASSESSMENT_BEGIN,
  ROADMAP_APPROVE_COMPETENCY_ASSESSMENT_SUCCESS,
  ROADMAP_APPROVE_COMPETENCY_ASSESSMENT_FAILURE,
  ROADMAP_APPROVE_COMPETENCY_ASSESSMENT_DISMISS_ERROR,
} from './constants';

import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function approveCompetencyAssessment(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    const { roadmapId, stageId, competencyId, approved, assessmentId } = args;

    dispatch({
      type: ROADMAP_APPROVE_COMPETENCY_ASSESSMENT_BEGIN,
      data: approved ? 'approve' : 'reject'
    });

    const promise = new Promise((resolve, reject) => {
      const path = approved ? 'approve-assessment' : 'reject-assessment';

      const doRequest = axios.post(
        `${config.apiRootUrl}/roadmaps/${roadmapId}/stages/${stageId}/competencies/${competencyId}/assessments/${assessmentId}/${path}/`,
        null,
        createAxiosConfigWithAuth(getState())
      )
      doRequest.then(
        (res) => {
          dispatch({
            type: ROADMAP_APPROVE_COMPETENCY_ASSESSMENT_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: ROADMAP_APPROVE_COMPETENCY_ASSESSMENT_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissApproveCompetencyAssessmentError() {
  return {
    type: ROADMAP_APPROVE_COMPETENCY_ASSESSMENT_DISMISS_ERROR,
  };
}

export function useApproveCompetencyAssessment() {
  const dispatch = useDispatch();

  const { approveCompetencyAssessmentPending, approveCompetencyAssessmentError } = useSelector(
    state => ({
      approveCompetencyAssessmentPending: state.roadmap.approveCompetencyAssessmentPending,
      approveCompetencyAssessmentError: state.roadmap.approveCompetencyAssessmentError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(approveCompetencyAssessment(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissApproveCompetencyAssessmentError());
  }, [dispatch]);

  return {
    approveCompetencyAssessment: boundAction,
    approveCompetencyAssessmentPending,
    approveCompetencyAssessmentError,
    dismissApproveCompetencyAssessmentError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case ROADMAP_APPROVE_COMPETENCY_ASSESSMENT_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        approveCompetencyAssessmentPending: action.data,
        approveCompetencyAssessmentError: null,
      };

    case ROADMAP_APPROVE_COMPETENCY_ASSESSMENT_SUCCESS:
      // The request is success
      return {
        ...state,
        approveCompetencyAssessmentPending: false,
        approveCompetencyAssessmentError: null,
      };

    case ROADMAP_APPROVE_COMPETENCY_ASSESSMENT_FAILURE:
      // The request is failed
      return {
        ...state,
        approveCompetencyAssessmentPending: false,
        approveCompetencyAssessmentError: action.data.error,
      };

    case ROADMAP_APPROVE_COMPETENCY_ASSESSMENT_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        approveCompetencyAssessmentError: null,
      };

    default:
      return state;
  }
}
