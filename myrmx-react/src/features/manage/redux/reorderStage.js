import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  MANAGE_REORDER_STAGE_BEGIN,
  MANAGE_REORDER_STAGE_SUCCESS,
  MANAGE_REORDER_STAGE_FAILURE,
  MANAGE_REORDER_STAGE_DISMISS_ERROR,
} from './constants';

import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function reorderStage(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: MANAGE_REORDER_STAGE_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const { roadmapId } = args;
      const doRequest = axios.post(
        `${config.apiRootUrl}/roadmaps/${roadmapId}/reorder-stages/`,
        args,
        createAxiosConfigWithAuth(getState())
      )
      doRequest.then(
        (res) => {
          dispatch({
            type: MANAGE_REORDER_STAGE_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: MANAGE_REORDER_STAGE_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissReorderStageError() {
  return {
    type: MANAGE_REORDER_STAGE_DISMISS_ERROR,
  };
}

export function useReorderStage() {
  const dispatch = useDispatch();

  const { reorderStagePending, reorderStageError } = useSelector(
    state => ({
      reorderStagePending: state.manage.reorderStagePending,
      reorderStageError: state.manage.reorderStageError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(reorderStage(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissReorderStageError());
  }, [dispatch]);

  return {
    reorderStage: boundAction,
    reorderStagePending,
    reorderStageError,
    dismissReorderStageError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case MANAGE_REORDER_STAGE_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        reorderStagePending: true,
        reorderStageError: null,
      };

    case MANAGE_REORDER_STAGE_SUCCESS:
      // The request is success
      return {
        ...state,
        reorderStagePending: false,
        reorderStageError: null,
      };

    case MANAGE_REORDER_STAGE_FAILURE:
      // The request is failed
      return {
        ...state,
        reorderStagePending: false,
        reorderStageError: action.data.error,
      };

    case MANAGE_REORDER_STAGE_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        reorderStageError: null,
      };

    default:
      return state;
  }
}
