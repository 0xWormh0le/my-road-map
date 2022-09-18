import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  ROADMAP_FETCH_COMPETENCY_ASSESSMENTS_BEGIN,
  ROADMAP_FETCH_COMPETENCY_ASSESSMENTS_SUCCESS,
  ROADMAP_FETCH_COMPETENCY_ASSESSMENTS_FAILURE,
  ROADMAP_FETCH_COMPETENCY_ASSESSMENTS_DISMISS_ERROR,
} from './constants';

import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function fetchCompetencyAssessments(args = {}) {
  return (dispatch, getState) => {
    // optionally you can have getState as the second argument
    dispatch({
      type: ROADMAP_FETCH_COMPETENCY_ASSESSMENTS_BEGIN,
    });

    const { roadmapId, stageId, competencyId, student } = args;
    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.get(
        `${config.apiRootUrl}/roadmaps/${roadmapId}/stages/${stageId}/competencies/${competencyId}/assessments/`,
        {
          params: {
            ordering: '-pk',
            student
          },
          ...createAxiosConfigWithAuth(getState())
        }
      );
      doRequest.then(
        res => {
          dispatch({
            type: ROADMAP_FETCH_COMPETENCY_ASSESSMENTS_SUCCESS,
            data: res.data.results,
          });
          resolve(res.data.results);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        err => {
          dispatch({
            type: ROADMAP_FETCH_COMPETENCY_ASSESSMENTS_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissFetchCompetencyAssessmentsError() {
  return {
    type: ROADMAP_FETCH_COMPETENCY_ASSESSMENTS_DISMISS_ERROR,
  };
}

export function useFetchCompetencyAssessments() {
  const dispatch = useDispatch();

  const {
    competencyAssessments,
    fetchCompetencyAssessmentsPending,
    fetchCompetencyAssessmentsError
  } = useSelector(
    state => ({
      competencyAssessments: state.roadmap.competencyAssessments,
      fetchCompetencyAssessmentsPending: state.roadmap.fetchCompetencyAssessmentsPending,
      fetchCompetencyAssessmentsError: state.roadmap.fetchCompetencyAssessmentsError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (...args) => {
      return dispatch(fetchCompetencyAssessments(...args));
    },
    [dispatch],
  );

  const boundDismissError = useCallback(() => {
    return dispatch(dismissFetchCompetencyAssessmentsError());
  }, [dispatch]);

  return {
    competencyAssessments,
    fetchCompetencyAssessments: boundAction,
    fetchCompetencyAssessmentsPending,
    fetchCompetencyAssessmentsError,
    dismissFetchCompetencyAssessmentsError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case ROADMAP_FETCH_COMPETENCY_ASSESSMENTS_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        fetchCompetencyAssessmentsPending: true,
        fetchCompetencyAssessmentsError: null,
      };

    case ROADMAP_FETCH_COMPETENCY_ASSESSMENTS_SUCCESS:
      // The request is success
      return {
        ...state,
        competencyAssessments: action.data,
        fetchCompetencyAssessmentsPending: false,
        fetchCompetencyAssessmentsError: null,
      };

    case ROADMAP_FETCH_COMPETENCY_ASSESSMENTS_FAILURE:
      // The request is failed
      return {
        ...state,
        fetchCompetencyAssessmentsPending: false,
        fetchCompetencyAssessmentsError: action.data.error,
      };

    case ROADMAP_FETCH_COMPETENCY_ASSESSMENTS_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        fetchCompetencyAssessmentsError: null,
      };

    default:
      return state;
  }
}
