import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  ROADMAP_ADD_QUESTION_ANSWER_BEGIN,
  ROADMAP_ADD_QUESTION_ANSWER_SUCCESS,
  ROADMAP_ADD_QUESTION_ANSWER_FAILURE,
  ROADMAP_ADD_QUESTION_ANSWER_DISMISS_ERROR,
} from './constants';

import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function addQuestionAnswer(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: ROADMAP_ADD_QUESTION_ANSWER_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const { roadmapId, stageId, competencyId } = args;

      const doRequest = axios.post(
        `${config.apiRootUrl}/roadmaps/${roadmapId}/stages/${stageId}/competencies/${competencyId}/question-answers/`,
        args,
        createAxiosConfigWithAuth(getState())
      )

      doRequest.then(
        (res) => {
          dispatch({
            type: ROADMAP_ADD_QUESTION_ANSWER_SUCCESS,
            data: res.data,
          });
          resolve(res.data);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: ROADMAP_ADD_QUESTION_ANSWER_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissAddQuestionAnswerError() {
  return {
    type: ROADMAP_ADD_QUESTION_ANSWER_DISMISS_ERROR,
  };
}

export function useAddQuestionAnswer() {
  const dispatch = useDispatch();

  const { addQuestionAnswerPending, addQuestionAnswerError } = useSelector(
    state => ({
      addQuestionAnswerPending: state.roadmap.addQuestionAnswerPending,
      addQuestionAnswerError: state.roadmap.addQuestionAnswerError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(addQuestionAnswer(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissAddQuestionAnswerError());
  }, [dispatch]);

  return {
    addQuestionAnswer: boundAction,
    addQuestionAnswerPending,
    addQuestionAnswerError,
    dismissAddQuestionAnswerError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case ROADMAP_ADD_QUESTION_ANSWER_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        addQuestionAnswerPending: true,
        addQuestionAnswerError: null,
      };

    case ROADMAP_ADD_QUESTION_ANSWER_SUCCESS:
      // The request is success
      return {
        ...state,
        addQuestionAnswerPending: false,
        addQuestionAnswerError: null,
      };

    case ROADMAP_ADD_QUESTION_ANSWER_FAILURE:
      // The request is failed
      return {
        ...state,
        addQuestionAnswerPending: false,
        addQuestionAnswerError: action.data.error,
      };

    case ROADMAP_ADD_QUESTION_ANSWER_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        addQuestionAnswerError: null,
      };

    default:
      return state;
  }
}
