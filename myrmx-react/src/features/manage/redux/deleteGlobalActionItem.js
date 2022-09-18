import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  MANAGE_DELETE_GLOBAL_ACTION_ITEM_BEGIN,
  MANAGE_DELETE_GLOBAL_ACTION_ITEM_SUCCESS,
  MANAGE_DELETE_GLOBAL_ACTION_ITEM_FAILURE,
  MANAGE_DELETE_GLOBAL_ACTION_ITEM_DISMISS_ERROR,
} from './constants';

import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function deleteGlobalActionItem(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: MANAGE_DELETE_GLOBAL_ACTION_ITEM_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const { roadmapId, stageId, competencyId, actionItemId } = args;

      const doRequest = axios.delete(
        `${config.apiRootUrl}/roadmaps/${roadmapId}/stages/${stageId}/competencies/${competencyId}/global-action-items/${actionItemId}/`,
        createAxiosConfigWithAuth(getState())
      )

      doRequest.then(
        (res) => {
          dispatch({
            type: MANAGE_DELETE_GLOBAL_ACTION_ITEM_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: MANAGE_DELETE_GLOBAL_ACTION_ITEM_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissDeleteGlobalActionItemError() {
  return {
    type: MANAGE_DELETE_GLOBAL_ACTION_ITEM_DISMISS_ERROR,
  };
}

export function useDeleteGlobalActionItem() {
  const dispatch = useDispatch();

  const { deleteGlobalActionItemPending, deleteGlobalActionItemError } = useSelector(
    state => ({
      deleteGlobalActionItemPending: state.manage.deleteGlobalActionItemPending,
      deleteGlobalActionItemError: state.manage.deleteGlobalActionItemError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(deleteGlobalActionItem(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissDeleteGlobalActionItemError());
  }, [dispatch]);

  return {
    deleteGlobalActionItem: boundAction,
    deleteGlobalActionItemPending,
    deleteGlobalActionItemError,
    dismissDeleteGlobalActionItemError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case MANAGE_DELETE_GLOBAL_ACTION_ITEM_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        deleteGlobalActionItemPending: true,
        deleteGlobalActionItemError: null,
      };

    case MANAGE_DELETE_GLOBAL_ACTION_ITEM_SUCCESS:
      // The request is success
      return {
        ...state,
        deleteGlobalActionItemPending: false,
        deleteGlobalActionItemError: null,
      };

    case MANAGE_DELETE_GLOBAL_ACTION_ITEM_FAILURE:
      // The request is failed
      return {
        ...state,
        deleteGlobalActionItemPending: false,
        deleteGlobalActionItemError: action.data.error,
      };

    case MANAGE_DELETE_GLOBAL_ACTION_ITEM_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        deleteGlobalActionItemError: null,
      };

    default:
      return state;
  }
}
