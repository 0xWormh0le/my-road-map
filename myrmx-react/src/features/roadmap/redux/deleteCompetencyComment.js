import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  ROADMAP_DELETE_COMPETENCY_COMMENT_BEGIN,
  ROADMAP_DELETE_COMPETENCY_COMMENT_SUCCESS,
  ROADMAP_DELETE_COMPETENCY_COMMENT_FAILURE,
  ROADMAP_DELETE_COMPETENCY_COMMENT_DISMISS_ERROR,
} from './constants';

import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function deleteCompetencyComment(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: ROADMAP_DELETE_COMPETENCY_COMMENT_BEGIN,
    });

    const { roadmapId, stageId, competencyId, commentId } = args;

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.delete(
        `${config.apiRootUrl}/roadmaps/${roadmapId}/stages/${stageId}/competencies/${competencyId}/comments/${commentId}/`,
        createAxiosConfigWithAuth(getState())
      );
      doRequest.then(
        (res) => {
          dispatch({
            type: ROADMAP_DELETE_COMPETENCY_COMMENT_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: ROADMAP_DELETE_COMPETENCY_COMMENT_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissDeleteCompetencyCommentError() {
  return {
    type: ROADMAP_DELETE_COMPETENCY_COMMENT_DISMISS_ERROR,
  };
}

export function useDeleteCompetencyComment() {
  const dispatch = useDispatch();

  const { deleteCompetencyCommentPending, deleteCompetencyCommentError } = useSelector(
    state => ({
      deleteCompetencyCommentPending: state.roadmap.deleteCompetencyCommentPending,
      deleteCompetencyCommentError: state.roadmap.deleteCompetencyCommentError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(deleteCompetencyComment(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissDeleteCompetencyCommentError());
  }, [dispatch]);

  return {
    deleteCompetencyComment: boundAction,
    deleteCompetencyCommentPending,
    deleteCompetencyCommentError,
    dismissDeleteCompetencyCommentError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case ROADMAP_DELETE_COMPETENCY_COMMENT_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        deleteCompetencyCommentPending: true,
        deleteCompetencyCommentError: null,
      };

    case ROADMAP_DELETE_COMPETENCY_COMMENT_SUCCESS:
      // The request is success
      return {
        ...state,
        deleteCompetencyCommentPending: false,
        deleteCompetencyCommentError: null,
      };

    case ROADMAP_DELETE_COMPETENCY_COMMENT_FAILURE:
      // The request is failed
      return {
        ...state,
        deleteCompetencyCommentPending: false,
        deleteCompetencyCommentError: action.data.error,
      };

    case ROADMAP_DELETE_COMPETENCY_COMMENT_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        deleteCompetencyCommentError: null,
      };

    default:
      return state;
  }
}
