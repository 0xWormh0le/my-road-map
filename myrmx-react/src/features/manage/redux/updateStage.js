import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  MANAGE_UPDATE_STAGE_BEGIN,
  MANAGE_UPDATE_STAGE_SUCCESS,
  MANAGE_UPDATE_STAGE_FAILURE,
  MANAGE_UPDATE_STAGE_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function updateStage(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: MANAGE_UPDATE_STAGE_BEGIN,
    });

    const { roadmap, stage } = args;

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.patch(
        `${config.apiRootUrl}/roadmaps/${roadmap}/stages/${stage}/`,
        args,
        createAxiosConfigWithAuth(getState())
      );

      doRequest.then(
        (res) => {
          dispatch({
            type: MANAGE_UPDATE_STAGE_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: MANAGE_UPDATE_STAGE_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissUpdateStageError() {
  return {
    type: MANAGE_UPDATE_STAGE_DISMISS_ERROR,
  };
}

export function useUpdateStage() {
  const dispatch = useDispatch();

  const { updateStagePending, updateStageError } = useSelector(
    state => ({
      updateStagePending: state.manage.updateStagePending,
      updateStageError: state.manage.updateStageError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(updateStage(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissUpdateStageError());
  }, [dispatch]);

  return {
    updateStage: boundAction,
    updateStagePending,
    updateStageError,
    dismissUpdateStageError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case MANAGE_UPDATE_STAGE_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        updateStagePending: true,
        updateStageError: null,
      };

    case MANAGE_UPDATE_STAGE_SUCCESS:
      // The request is success
      return {
        ...state,
        updateStagePending: false,
        updateStageError: null,
      };

    case MANAGE_UPDATE_STAGE_FAILURE:
      // The request is failed
      return {
        ...state,
        updateStagePending: false,
        updateStageError: action.data.error,
      };

    case MANAGE_UPDATE_STAGE_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        updateStageError: null,
      };

    default:
      return state;
  }
}
