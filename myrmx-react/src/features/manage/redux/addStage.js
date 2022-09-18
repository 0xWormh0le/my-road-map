import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  MANAGE_ADD_STAGE_BEGIN,
  MANAGE_ADD_STAGE_SUCCESS,
  MANAGE_ADD_STAGE_FAILURE,
  MANAGE_ADD_STAGE_DISMISS_ERROR,
} from './constants';

import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function addStage(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: MANAGE_ADD_STAGE_BEGIN,
    });

    const { roadmap } = args;

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.post(
        `${config.apiRootUrl}/roadmaps/${roadmap}/stages/`,
        args,
        createAxiosConfigWithAuth(getState())
      )

      doRequest.then(
        (res) => {
          dispatch({
            type: MANAGE_ADD_STAGE_SUCCESS,
            data: res.data,
          });
          resolve(res.data);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: MANAGE_ADD_STAGE_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissAddStageError() {
  return {
    type: MANAGE_ADD_STAGE_DISMISS_ERROR,
  };
}

export function useAddStage() {
  const dispatch = useDispatch();

  const { addStagePending, addStageError } = useSelector(
    state => ({
      addStagePending: state.manage.addStagePending,
      addStageError: state.manage.addStageError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(addStage(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissAddStageError());
  }, [dispatch]);

  return {
    addStage: boundAction,
    addStagePending,
    addStageError,
    dismissAddStageError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case MANAGE_ADD_STAGE_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        addStagePending: true,
        addStageError: null,
      };

    case MANAGE_ADD_STAGE_SUCCESS:
      // The request is success
      return {
        ...state,
        addStagePending: false,
        addStageError: null,
      };

    case MANAGE_ADD_STAGE_FAILURE:
      // The request is failed
      return {
        ...state,
        addStagePending: false,
        addStageError: action.data.error,
      };

    case MANAGE_ADD_STAGE_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        addStageError: null,
      };

    default:
      return state;
  }
}
