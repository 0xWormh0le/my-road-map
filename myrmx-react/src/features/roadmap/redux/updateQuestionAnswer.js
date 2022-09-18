import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  ROADMAP_UPDATE_QUESTION_ANSWER_BEGIN,
  ROADMAP_UPDATE_QUESTION_ANSWER_SUCCESS,
  ROADMAP_UPDATE_QUESTION_ANSWER_FAILURE,
  ROADMAP_UPDATE_QUESTION_ANSWER_DISMISS_ERROR,
} from './constants';

import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function updateQuestionAnswer(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: ROADMAP_UPDATE_QUESTION_ANSWER_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const { roadmapId, stageId, competencyId, answerId } = args;

      const doRequest = axios.patch(
        `${config.apiRootUrl}/roadmaps/${roadmapId}/stages/${stageId}/competencies/${competencyId}/question-answers/${answerId}/`,
        args,
        createAxiosConfigWithAuth(getState())
      )

      doRequest.then(
        (res) => {
          dispatch({
            type: ROADMAP_UPDATE_QUESTION_ANSWER_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: ROADMAP_UPDATE_QUESTION_ANSWER_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissUpdateQuestionAnswerError() {
  return {
    type: ROADMAP_UPDATE_QUESTION_ANSWER_DISMISS_ERROR,
  };
}

export function useUpdateQuestionAnswer() {
  const dispatch = useDispatch();

  const { updateQuestionAnswerPending, updateQuestionAnswerError } = useSelector(
    state => ({
      updateQuestionAnswerPending: state.roadmap.updateQuestionAnswerPending,
      updateQuestionAnswerError: state.roadmap.updateQuestionAnswerError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(updateQuestionAnswer(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissUpdateQuestionAnswerError());
  }, [dispatch]);

  return {
    updateQuestionAnswer: boundAction,
    updateQuestionAnswerPending,
    updateQuestionAnswerError,
    dismissUpdateQuestionAnswerError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case ROADMAP_UPDATE_QUESTION_ANSWER_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        updateQuestionAnswerPending: true,
        updateQuestionAnswerError: null,
      };

    case ROADMAP_UPDATE_QUESTION_ANSWER_SUCCESS:
      // The request is success
      return {
        ...state,
        updateQuestionAnswerPending: false,
        updateQuestionAnswerError: null,
      };

    case ROADMAP_UPDATE_QUESTION_ANSWER_FAILURE:
      // The request is failed
      return {
        ...state,
        updateQuestionAnswerPending: false,
        updateQuestionAnswerError: action.data.error,
      };

    case ROADMAP_UPDATE_QUESTION_ANSWER_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        updateQuestionAnswerError: null,
      };

    default:
      return state;
  }
}
