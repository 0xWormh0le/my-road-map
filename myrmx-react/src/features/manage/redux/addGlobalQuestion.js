import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  MANAGE_ADD_GLOBAL_QUESTION_BEGIN,
  MANAGE_ADD_GLOBAL_QUESTION_SUCCESS,
  MANAGE_ADD_GLOBAL_QUESTION_FAILURE,
  MANAGE_ADD_GLOBAL_QUESTION_DISMISS_ERROR,
} from './constants';

import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function addGlobalQuestion(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: MANAGE_ADD_GLOBAL_QUESTION_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const { roadmapId, stageId, competencyId } = args;
      
      const doRequest = axios.post(
        `${config.apiRootUrl}/roadmaps/${roadmapId}/stages/${stageId}/competencies/${competencyId}/global-questions/`,
        args,
        createAxiosConfigWithAuth(getState())
      )

      doRequest.then(
        (res) => {
          dispatch({
            type: MANAGE_ADD_GLOBAL_QUESTION_SUCCESS,
            data: res.data,
          });
          resolve(res.data);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: MANAGE_ADD_GLOBAL_QUESTION_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissAddGlobalQuestionError() {
  return {
    type: MANAGE_ADD_GLOBAL_QUESTION_DISMISS_ERROR,
  };
}

export function useAddGlobalQuestion() {
  const dispatch = useDispatch();

  const { addGlobalQuestionPending, addGlobalQuestionError } = useSelector(
    state => ({
      addGlobalQuestionPending: state.manage.addGlobalQuestionPending,
      addGlobalQuestionError: state.manage.addGlobalQuestionError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(addGlobalQuestion(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissAddGlobalQuestionError());
  }, [dispatch]);

  return {
    addGlobalQuestion: boundAction,
    addGlobalQuestionPending,
    addGlobalQuestionError,
    dismissAddGlobalQuestionError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case MANAGE_ADD_GLOBAL_QUESTION_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        addGlobalQuestionPending: true,
        addGlobalQuestionError: null,
      };

    case MANAGE_ADD_GLOBAL_QUESTION_SUCCESS:
      // The request is success
      return {
        ...state,
        addGlobalQuestionPending: false,
        addGlobalQuestionError: null,
      };

    case MANAGE_ADD_GLOBAL_QUESTION_FAILURE:
      // The request is failed
      return {
        ...state,
        addGlobalQuestionPending: false,
        addGlobalQuestionError: action.data.error,
      };

    case MANAGE_ADD_GLOBAL_QUESTION_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        addGlobalQuestionError: null,
      };

    default:
      return state;
  }
}
