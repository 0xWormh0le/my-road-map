import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  MANAGE_FETCH_GLOBAL_QUESTIONS_BEGIN,
  MANAGE_FETCH_GLOBAL_QUESTIONS_SUCCESS,
  MANAGE_FETCH_GLOBAL_QUESTIONS_FAILURE,
  MANAGE_FETCH_GLOBAL_QUESTIONS_DISMISS_ERROR,
} from './constants';

import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function fetchGlobalQuestions(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: MANAGE_FETCH_GLOBAL_QUESTIONS_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const { roadmapId, stageId, competencyId } = args;

      const doRequest = axios.get(
        `${config.apiRootUrl}/roadmaps/${roadmapId}/stages/${stageId}/competencies/${competencyId}/global-questions/`,
        createAxiosConfigWithAuth(getState())
      )

      doRequest.then(
        (res) => {
          dispatch({
            type: MANAGE_FETCH_GLOBAL_QUESTIONS_SUCCESS,
            data: res.data.results,
          });
          resolve(res.data.results);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: MANAGE_FETCH_GLOBAL_QUESTIONS_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissFetchGlobalQuestionsError() {
  return {
    type: MANAGE_FETCH_GLOBAL_QUESTIONS_DISMISS_ERROR,
  };
}

export function useFetchGlobalQuestions() {
  const dispatch = useDispatch();

  const { globalQuestions, fetchGlobalQuestionsPending, fetchGlobalQuestionsError } = useSelector(
    state => ({
      globalQuestions: state.manage.globalQuestions,
      fetchGlobalQuestionsPending: state.manage.fetchGlobalQuestionsPending,
      fetchGlobalQuestionsError: state.manage.fetchGlobalQuestionsError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(fetchGlobalQuestions(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissFetchGlobalQuestionsError());
  }, [dispatch]);

  return {
    globalQuestions,
    fetchGlobalQuestions: boundAction,
    fetchGlobalQuestionsPending,
    fetchGlobalQuestionsError,
    dismissFetchGlobalQuestionsError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case MANAGE_FETCH_GLOBAL_QUESTIONS_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        fetchGlobalQuestionsPending: true,
        fetchGlobalQuestionsError: null,
      };

    case MANAGE_FETCH_GLOBAL_QUESTIONS_SUCCESS:
      // The request is success
      return {
        ...state,
        fetchGlobalQuestionsPending: false,
        fetchGlobalQuestionsError: null,
        globalQuestions: action.data,
      };

    case MANAGE_FETCH_GLOBAL_QUESTIONS_FAILURE:
      // The request is failed
      return {
        ...state,
        fetchGlobalQuestionsPending: false,
        fetchGlobalQuestionsError: action.data.error,
      };

    case MANAGE_FETCH_GLOBAL_QUESTIONS_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        fetchGlobalQuestionsError: null,
      };

    default:
      return state;
  }
}
