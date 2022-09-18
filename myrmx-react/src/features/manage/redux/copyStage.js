import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  MANAGE_COPY_STAGE_BEGIN,
  MANAGE_COPY_STAGE_SUCCESS,
  MANAGE_COPY_STAGE_FAILURE,
  MANAGE_COPY_STAGE_DISMISS_ERROR,
} from './constants';

import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function copyStage(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: MANAGE_COPY_STAGE_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const { roadmapId, stageId } = args;

      const doRequest = axios.post(
        `${config.apiRootUrl}/roadmaps/${roadmapId}/stages/${stageId}/copy-stage/`,
        args,
        createAxiosConfigWithAuth(getState())
      )

      doRequest.then(
        (res) => {
          dispatch({
            type: MANAGE_COPY_STAGE_SUCCESS,
            data: res.data,
          });
          resolve(res.data);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: MANAGE_COPY_STAGE_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissCopyStageError() {
  return {
    type: MANAGE_COPY_STAGE_DISMISS_ERROR,
  };
}

export function useCopyStage() {
  const dispatch = useDispatch();

  const { copyStagePending, copyStageError } = useSelector(
    state => ({
      copyStagePending: state.manage.copyStagePending,
      copyStageError: state.manage.copyStageError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(copyStage(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissCopyStageError());
  }, [dispatch]);

  return {
    copyStage: boundAction,
    copyStagePending,
    copyStageError,
    dismissCopyStageError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case MANAGE_COPY_STAGE_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        copyStagePending: true,
        copyStageError: null,
      };

    case MANAGE_COPY_STAGE_SUCCESS:
      // The request is success
      return {
        ...state,
        copyStagePending: false,
        copyStageError: null,
      };

    case MANAGE_COPY_STAGE_FAILURE:
      // The request is failed
      return {
        ...state,
        copyStagePending: false,
        copyStageError: action.data.error,
      };

    case MANAGE_COPY_STAGE_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        copyStageError: null,
      };

    default:
      return state;
  }
}
