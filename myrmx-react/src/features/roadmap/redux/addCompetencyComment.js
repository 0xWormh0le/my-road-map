import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  ROADMAP_ADD_COMPETENCY_COMMENT_BEGIN,
  ROADMAP_ADD_COMPETENCY_COMMENT_SUCCESS,
  ROADMAP_ADD_COMPETENCY_COMMENT_FAILURE,
  ROADMAP_ADD_COMPETENCY_COMMENT_DISMISS_ERROR
} from './constants';

import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function addCompetencyComment(args = {}) {
  return (dispatch, getState) => {
    // optionally you can have getState as the second argument
    dispatch({
      type: ROADMAP_ADD_COMPETENCY_COMMENT_BEGIN,
    });

    const { roadmapId, stageId, competencyId, data } = args;

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.post(
        `${config.apiRootUrl}/roadmaps/${roadmapId}/stages/${stageId}/competencies/${competencyId}/comments/`,
        data,
        createAxiosConfigWithAuth(getState()),
      );
      doRequest.then(
        res => {
          dispatch({
            type: ROADMAP_ADD_COMPETENCY_COMMENT_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        err => {
          dispatch({
            type: ROADMAP_ADD_COMPETENCY_COMMENT_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissAddCompetencyCommentError() {
  return {
    type: ROADMAP_ADD_COMPETENCY_COMMENT_DISMISS_ERROR,
  };
}

export function useAddCompetencyComment() {
  const dispatch = useDispatch();

  const { addCompetencyCommentPending, addCompetencyCommentError } = useSelector(
    state => ({
      addCompetencyCommentPending: state.roadmap.addCompetencyCommentPending,
      addCompetencyCommentError: state.roadmap.addCompetencyCommentError
    }),
    shallowEqual
  );

  const boundAction = useCallback((...args) => dispatch(addCompetencyComment(...args)), [dispatch]);
  
  const boundDismissError = useCallback(() => {
    return dispatch(dismissAddCompetencyCommentError());
  }, [dispatch]);

  return {
    addCompetencyComment: boundAction,
    addCompetencyCommentPending,
    addCompetencyCommentError,
    dismissAddCompetencyCommentError: boundDismissError
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case ROADMAP_ADD_COMPETENCY_COMMENT_BEGIN:
      return {
        ...state,
        addCompetencyCommentPending: true,
        addCompetencyCommentError: null,
      };
    
    case ROADMAP_ADD_COMPETENCY_COMMENT_SUCCESS:
      return {
        ...state,
        addCompetencyCommentPending: false,
        addCompetencyCommentError: null,
      };

    case ROADMAP_ADD_COMPETENCY_COMMENT_FAILURE:
      return {
        ...state,
        addCompetencyCommentPending: false,
        addCompetencyCommentError: action.data.error,
      };
  
    case ROADMAP_ADD_COMPETENCY_COMMENT_DISMISS_ERROR:
      return {
        ...state,
        addCompetencyCommentError: null,
      };

    default:
      return state;
  }
}
