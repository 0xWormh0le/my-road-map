import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  ROADMAP_FETCH_QUESTION_ANSWERS_BEGIN,
  ROADMAP_FETCH_QUESTION_ANSWERS_SUCCESS,
  ROADMAP_FETCH_QUESTION_ANSWERS_FAILURE,
  ROADMAP_FETCH_QUESTION_ANSWERS_DISMISS_ERROR,
} from './constants';

import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function fetchQuestionAnswers(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: ROADMAP_FETCH_QUESTION_ANSWERS_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const { roadmapId, stageId, competencyId, studentId } = args;

      const requestConfig = createAxiosConfigWithAuth(getState());
      if (studentId) requestConfig.params = { student: studentId };
      const doRequest = axios.get(
        `${config.apiRootUrl}/roadmaps/${roadmapId}/stages/${stageId}/competencies/${competencyId}/question-answers/`,
        requestConfig,
      )

      doRequest.then(
        (res) => {
          dispatch({
            type: ROADMAP_FETCH_QUESTION_ANSWERS_SUCCESS,
            data: res.data.results,
          });
          resolve(res.data.results);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: ROADMAP_FETCH_QUESTION_ANSWERS_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissFetchQuestionAnswersError() {
  return {
    type: ROADMAP_FETCH_QUESTION_ANSWERS_DISMISS_ERROR,
  };
}

export function useFetchQuestionAnswers() {
  const dispatch = useDispatch();

  const { questionAnswers, fetchQuestionAnswersPending, fetchQuestionAnswersError } = useSelector(
    state => ({
      questionAnswers: state.roadmap.questionAnswers,
      fetchQuestionAnswersPending: state.roadmap.fetchQuestionAnswersPending,
      fetchQuestionAnswersError: state.roadmap.fetchQuestionAnswersError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(fetchQuestionAnswers(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissFetchQuestionAnswersError());
  }, [dispatch]);

  return {
    questionAnswers,
    fetchQuestionAnswers: boundAction,
    fetchQuestionAnswersPending,
    fetchQuestionAnswersError,
    dismissFetchQuestionAnswersError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case ROADMAP_FETCH_QUESTION_ANSWERS_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        fetchQuestionAnswersPending: true,
        fetchQuestionAnswersError: null,
      };

    case ROADMAP_FETCH_QUESTION_ANSWERS_SUCCESS:
      // The request is success
      return {
        ...state,
        fetchQuestionAnswersPending: false,
        fetchQuestionAnswersError: null,
        questionAnswers: action.data
      };

    case ROADMAP_FETCH_QUESTION_ANSWERS_FAILURE:
      // The request is failed
      return {
        ...state,
        fetchQuestionAnswersPending: false,
        fetchQuestionAnswersError: action.data.error,
      };

    case ROADMAP_FETCH_QUESTION_ANSWERS_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        fetchQuestionAnswersError: null,
      };

    default:
      return state;
  }
}
