import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  MANAGE_REORDER_GLOBAL_QUESTIONS_BEGIN,
  MANAGE_REORDER_GLOBAL_QUESTIONS_SUCCESS,
  MANAGE_REORDER_GLOBAL_QUESTIONS_FAILURE,
  MANAGE_REORDER_GLOBAL_QUESTIONS_DISMISS_ERROR,
} from './constants';

import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function reorderGlobalQuestions(args = {}) {
  return (dispatch, getState) => {
    dispatch({
      type: MANAGE_REORDER_GLOBAL_QUESTIONS_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const { roadmapId, stageId, competencyId } = args;
      const doRequest = axios.post(
        `${config.apiRootUrl}/roadmaps/${roadmapId}/stages/${stageId}/competencies/${competencyId}/reorder-questions/`,
        args,
        createAxiosConfigWithAuth(getState())
      )
      doRequest.then(
        (res) => {
          dispatch({
            type: MANAGE_REORDER_GLOBAL_QUESTIONS_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: MANAGE_REORDER_GLOBAL_QUESTIONS_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissReorderGlobalQuestionsError() {
  return {
    type: MANAGE_REORDER_GLOBAL_QUESTIONS_DISMISS_ERROR,
  };
}

export function useReorderGlobalQuestions() {
  const dispatch = useDispatch();

  const { reorderGlobalQuestionsPending, reorderGlobalQuestionsError } = useSelector(
    state => ({
      reorderGlobalQuestionsPending: state.manage.reorderGlobalQuestionsPending,
      reorderGlobalQuestionsError: state.manage.reorderGlobalQuestionsError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(reorderGlobalQuestions(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissReorderGlobalQuestionsError());
  }, [dispatch]);

  return {
    reorderGlobalQuestions: boundAction,
    reorderGlobalQuestionsPending,
    reorderGlobalQuestionsError,
    dismissReorderGlobalQuestionsError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case MANAGE_REORDER_GLOBAL_QUESTIONS_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        reorderGlobalQuestionsPending: true,
        reorderGlobalQuestionsError: null,
      };

    case MANAGE_REORDER_GLOBAL_QUESTIONS_SUCCESS:
      // The request is success
      return {
        ...state,
        reorderGlobalQuestionsPending: false,
        reorderGlobalQuestionsError: null,
      };

    case MANAGE_REORDER_GLOBAL_QUESTIONS_FAILURE:
      // The request is failed
      return {
        ...state,
        reorderGlobalQuestionsPending: false,
        reorderGlobalQuestionsError: action.data.error,
      };

    case MANAGE_REORDER_GLOBAL_QUESTIONS_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        reorderGlobalQuestionsError: null,
      };

    default:
      return state;
  }
}
