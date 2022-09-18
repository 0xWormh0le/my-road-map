import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  ROADMAP_SET_ACTION_ITEM_ASSESSMENT_BEGIN,
  ROADMAP_SET_ACTION_ITEM_ASSESSMENT_SUCCESS,
  ROADMAP_SET_ACTION_ITEM_ASSESSMENT_FAILURE,
  ROADMAP_SET_ACTION_ITEM_ASSESSMENT_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function setActionItemAssessment(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: ROADMAP_SET_ACTION_ITEM_ASSESSMENT_BEGIN,
    });

    const { roadmapId, stageId, competencyId, actionItemId, approve } = args;

    const promise = new Promise((resolve, reject) => {
      const path = approve ? 'approve-ai' : 'reject-ai'
      const doRequest = axios.post(
        `${config.apiRootUrl}/roadmaps/${roadmapId}/stages/${stageId}/competencies/${competencyId}/action-item-assessments/${actionItemId}/${path}/`,
        null,
        createAxiosConfigWithAuth(getState()),
      );
      doRequest.then(
        (res) => {
          dispatch({
            type: ROADMAP_SET_ACTION_ITEM_ASSESSMENT_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: ROADMAP_SET_ACTION_ITEM_ASSESSMENT_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissSetActionItemAssessmentError() {
  return {
    type: ROADMAP_SET_ACTION_ITEM_ASSESSMENT_DISMISS_ERROR,
  };
}

export function useSetActionItemAssessment() {
  const dispatch = useDispatch();

  const { setActionItemAssessmentPending, setActionItemAssessmentError } = useSelector(
    state => ({
      setActionItemAssessmentPending: state.roadmap.setActionItemAssessmentPending,
      setActionItemAssessmentError: state.roadmap.setActionItemAssessmentError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(setActionItemAssessment(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissSetActionItemAssessmentError());
  }, [dispatch]);

  return {
    setActionItemAssessment: boundAction,
    setActionItemAssessmentPending,
    setActionItemAssessmentError,
    dismissSetActionItemAssessmentError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case ROADMAP_SET_ACTION_ITEM_ASSESSMENT_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        setActionItemAssessmentPending: true,
        setActionItemAssessmentError: null,
      };

    case ROADMAP_SET_ACTION_ITEM_ASSESSMENT_SUCCESS:
      // The request is success
      return {
        ...state,
        setActionItemAssessmentPending: false,
        setActionItemAssessmentError: null,
      };

    case ROADMAP_SET_ACTION_ITEM_ASSESSMENT_FAILURE:
      // The request is failed
      return {
        ...state,
        setActionItemAssessmentPending: false,
        setActionItemAssessmentError: action.data.error,
      };

    case ROADMAP_SET_ACTION_ITEM_ASSESSMENT_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        setActionItemAssessmentError: null,
      };

    default:
      return state;
  }
}
