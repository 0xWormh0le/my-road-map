import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  MANAGE_DELETE_STAGE_BEGIN,
  MANAGE_DELETE_STAGE_SUCCESS,
  MANAGE_DELETE_STAGE_FAILURE,
  MANAGE_DELETE_STAGE_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function deleteStage(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: MANAGE_DELETE_STAGE_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const { roadmapId, stageId } = args
      const doRequest = axios.delete(
        `${config.apiRootUrl}/roadmaps/${roadmapId}/stages/${stageId}`,
        createAxiosConfigWithAuth(getState())
      );

      doRequest.then(
        (res) => {
          dispatch({
            type: MANAGE_DELETE_STAGE_SUCCESS,
            data: stageId,
          });
          resolve(stageId);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: MANAGE_DELETE_STAGE_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissDeleteStageError() {
  return {
    type: MANAGE_DELETE_STAGE_DISMISS_ERROR,
  };
}

export function useDeleteStage() {
  const dispatch = useDispatch();

  const { deleteStagePending, deleteStageError } = useSelector(
    state => ({
      deleteStagePending: state.manage.deleteStagePending,
      deleteStageError: state.manage.deleteStageError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(deleteStage(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissDeleteStageError());
  }, [dispatch]);

  return {
    deleteStage: boundAction,
    deleteStagePending,
    deleteStageError,
    dismissDeleteStageError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case MANAGE_DELETE_STAGE_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        deleteStagePending: true,
        deleteStageError: null,
      };

    case MANAGE_DELETE_STAGE_SUCCESS:
      // The request is success
      return {
        ...state,
        deleteStagePending: false,
        deleteStageError: null,
      };

    case MANAGE_DELETE_STAGE_FAILURE:
      // The request is failed
      return {
        ...state,
        deleteStagePending: false,
        deleteStageError: action.data.error,
      };

    case MANAGE_DELETE_STAGE_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        deleteStageError: null,
      };

    default:
      return state;
  }
}
