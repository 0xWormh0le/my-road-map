import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  MANAGE_UPDATE_GLOBAL_QUESTION_BEGIN,
  MANAGE_UPDATE_GLOBAL_QUESTION_SUCCESS,
  MANAGE_UPDATE_GLOBAL_QUESTION_FAILURE,
  MANAGE_UPDATE_GLOBAL_QUESTION_DISMISS_ERROR,
} from './constants';

import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function updateGlobalQuestion(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: MANAGE_UPDATE_GLOBAL_QUESTION_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const { roadmapId, stageId, competencyId, questionId } = args;

      const doRequest = axios.patch(
        `${config.apiRootUrl}/roadmaps/${roadmapId}/stages/${stageId}/competencies/${competencyId}/global-questions/${questionId}/`,
        args,
        createAxiosConfigWithAuth(getState())
      )

      doRequest.then(
        (res) => {
          dispatch({
            type: MANAGE_UPDATE_GLOBAL_QUESTION_SUCCESS,
            data: res.data,
          });
          resolve(res.data);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: MANAGE_UPDATE_GLOBAL_QUESTION_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissUpdateGlobalQuestionError() {
  return {
    type: MANAGE_UPDATE_GLOBAL_QUESTION_DISMISS_ERROR,
  };
}

export function useUpdateGlobalQuestion() {
  const dispatch = useDispatch();

  const { updateGlobalQuestionPending, updateGlobalQuestionError } = useSelector(
    state => ({
      updateGlobalQuestionPending: state.manage.updateGlobalQuestionPending,
      updateGlobalQuestionError: state.manage.updateGlobalQuestionError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(updateGlobalQuestion(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissUpdateGlobalQuestionError());
  }, [dispatch]);

  return {
    updateGlobalQuestion: boundAction,
    updateGlobalQuestionPending,
    updateGlobalQuestionError,
    dismissUpdateGlobalQuestionError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case MANAGE_UPDATE_GLOBAL_QUESTION_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        updateGlobalQuestionPending: true,
        updateGlobalQuestionError: null,
      };

    case MANAGE_UPDATE_GLOBAL_QUESTION_SUCCESS:
      // The request is success
      return {
        ...state,
        updateGlobalQuestionPending: false,
        updateGlobalQuestionError: null,
      };

    case MANAGE_UPDATE_GLOBAL_QUESTION_FAILURE:
      // The request is failed
      return {
        ...state,
        updateGlobalQuestionPending: false,
        updateGlobalQuestionError: action.data.error,
      };

    case MANAGE_UPDATE_GLOBAL_QUESTION_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        updateGlobalQuestionError: null,
      };

    default:
      return state;
  }
}
