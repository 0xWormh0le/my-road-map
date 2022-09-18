import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  MANAGE_DELETE_GLOBAL_QUESTION_BEGIN,
  MANAGE_DELETE_GLOBAL_QUESTION_SUCCESS,
  MANAGE_DELETE_GLOBAL_QUESTION_FAILURE,
  MANAGE_DELETE_GLOBAL_QUESTION_DISMISS_ERROR,
} from './constants';

import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function deleteGlobalQuestion(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: MANAGE_DELETE_GLOBAL_QUESTION_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const { roadmapId, stageId, competencyId, questionId } = args;
      
      const doRequest = axios.delete(
        `${config.apiRootUrl}/roadmaps/${roadmapId}/stages/${stageId}/competencies/${competencyId}/global-questions/${questionId}/`,
        createAxiosConfigWithAuth(getState())
      )

      doRequest.then(
        (res) => {
          dispatch({
            type: MANAGE_DELETE_GLOBAL_QUESTION_SUCCESS,
            data: questionId,
          });
          resolve(questionId);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: MANAGE_DELETE_GLOBAL_QUESTION_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissDeleteGlobalQuestionError() {
  return {
    type: MANAGE_DELETE_GLOBAL_QUESTION_DISMISS_ERROR,
  };
}

export function useDeleteGlobalQuestion() {
  const dispatch = useDispatch();

  const { deleteGlobalQuestionPending, deleteGlobalQuestionError } = useSelector(
    state => ({
      deleteGlobalQuestionPending: state.manage.deleteGlobalQuestionPending,
      deleteGlobalQuestionError: state.manage.deleteGlobalQuestionError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(deleteGlobalQuestion(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissDeleteGlobalQuestionError());
  }, [dispatch]);

  return {
    deleteGlobalQuestion: boundAction,
    deleteGlobalQuestionPending,
    deleteGlobalQuestionError,
    dismissDeleteGlobalQuestionError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case MANAGE_DELETE_GLOBAL_QUESTION_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        deleteGlobalQuestionPending: true,
        deleteGlobalQuestionError: null,
      };

    case MANAGE_DELETE_GLOBAL_QUESTION_SUCCESS:
      // The request is success
      return {
        ...state,
        globalQuestions: state.globalQuestions.filter(x => x.id !== action.data),
        deleteGlobalQuestionPending: false,
        deleteGlobalQuestionError: null,
      };

    case MANAGE_DELETE_GLOBAL_QUESTION_FAILURE:
      // The request is failed
      return {
        ...state,
        deleteGlobalQuestionPending: false,
        deleteGlobalQuestionError: action.data.error,
      };

    case MANAGE_DELETE_GLOBAL_QUESTION_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        deleteGlobalQuestionError: null,
      };

    default:
      return state;
  }
}
