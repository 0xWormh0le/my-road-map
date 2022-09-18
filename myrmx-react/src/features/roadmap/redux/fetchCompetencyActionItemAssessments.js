import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  ROADMAP_FETCH_COMPETENCY_ACTION_ITEM_ASSESSMENTS_BEGIN,
  ROADMAP_FETCH_COMPETENCY_ACTION_ITEM_ASSESSMENTS_SUCCESS,
  ROADMAP_FETCH_COMPETENCY_ACTION_ITEM_ASSESSMENTS_FAILURE,
  ROADMAP_FETCH_COMPETENCY_ACTION_ITEM_ASSESSMENTS_DISMISS_ERROR,
} from './constants';

import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function fetchCompetencyActionItemAssessments(args = {}) {
  return (dispatch, getState) => {
    // optionally you can have getState as the second argument
    dispatch({
      type: ROADMAP_FETCH_COMPETENCY_ACTION_ITEM_ASSESSMENTS_BEGIN,
    });

    const { roadmapId, stageId, competencyId, actionItemId, student, attachment } = args;
    const fetchingSingleActionItem = !!actionItemId;
    const promise = new Promise((resolve, reject) => {
      let url = `${config.apiRootUrl}/roadmaps/${roadmapId}/stages/${stageId}/competencies/${competencyId}/action-item-assessments/`;
      if (fetchingSingleActionItem) {
        url += actionItemId + '/';
      }

      const doRequest = axios.get(url, {
        params: {
          details: attachment ? 'attachments' : undefined,
          student
        },
        ...createAxiosConfigWithAuth(getState())
      });
      doRequest.then(
        res => {
          const results = fetchingSingleActionItem ? [ res.data ] : res.data.results;
          dispatch({
            type: ROADMAP_FETCH_COMPETENCY_ACTION_ITEM_ASSESSMENTS_SUCCESS,
            data: results
          });
          resolve(results);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        err => {
          dispatch({
            type: ROADMAP_FETCH_COMPETENCY_ACTION_ITEM_ASSESSMENTS_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissFetchCompetencyActionItemAssessmentsError() {
  return {
    type: ROADMAP_FETCH_COMPETENCY_ACTION_ITEM_ASSESSMENTS_DISMISS_ERROR,
  };
}

export function useFetchCompetencyActionItemAssessments() {
  const dispatch = useDispatch();

  const {
    actionItems,
    fetchCompetencyActionItemAssessmentsPending,
    fetchCompetencyActionItemAssessmentsError,
  } = useSelector(
    state => ({
      actionItems: state.roadmap.actionItems,
      fetchCompetencyActionItemAssessmentsPending:
        state.roadmap.fetchCompetencyActionItemAssessmentsPending,
      fetchCompetencyActionItemAssessmentsError:
        state.roadmap.fetchCompetencyActionItemAssessmentsError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (...args) => {
      return dispatch(fetchCompetencyActionItemAssessments(...args));
    },
    [dispatch],
  );

  const boundDismissError = useCallback(() => {
    return dispatch(dismissFetchCompetencyActionItemAssessmentsError());
  }, [dispatch]);

  return {
    actionItems,
    fetchCompetencyActionItemAssessments: boundAction,
    fetchCompetencyActionItemAssessmentsPending,
    fetchCompetencyActionItemAssessmentsError,
    dismissFetchCompetencyActionItemAssessmentsError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case ROADMAP_FETCH_COMPETENCY_ACTION_ITEM_ASSESSMENTS_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        fetchCompetencyActionItemAssessmentsPending: true,
        fetchCompetencyActionItemAssessmentsError: null,
      };

    case ROADMAP_FETCH_COMPETENCY_ACTION_ITEM_ASSESSMENTS_SUCCESS:
      // The request is success
      return {
        ...state,
        fetchCompetencyActionItemAssessmentsPending: false,
        fetchCompetencyActionItemAssessmentsError: null,
        actionItems: Object.assign({}, state.actionItems, ...action.data.map(ai => ({ [ai.id]: ai }))),
      };

    case ROADMAP_FETCH_COMPETENCY_ACTION_ITEM_ASSESSMENTS_FAILURE:
      // The request is failed
      return {
        ...state,
        fetchCompetencyActionItemAssessmentsPending: false,
        fetchCompetencyActionItemAssessmentsError: action.data.error,
      };

    case ROADMAP_FETCH_COMPETENCY_ACTION_ITEM_ASSESSMENTS_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        fetchCompetencyActionItemAssessmentsError: null,
      };

    default:
      return state;
  }
}
