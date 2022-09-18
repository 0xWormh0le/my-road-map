import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  MANAGE_REORDER_ACTION_ITEMS_BEGIN,
  MANAGE_REORDER_ACTION_ITEMS_SUCCESS,
  MANAGE_REORDER_ACTION_ITEMS_FAILURE,
  MANAGE_REORDER_ACTION_ITEMS_DISMISS_ERROR,
} from './constants';

import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function reorderActionItems(args = {}) {
  return (dispatch, getState) => {
    dispatch({
      type: MANAGE_REORDER_ACTION_ITEMS_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const { roadmapId, stageId, competencyId } = args;
      const doRequest = axios.post(
        `${config.apiRootUrl}/roadmaps/${roadmapId}/stages/${stageId}/competencies/${competencyId}/reorder-action-items/`,
        args,
        createAxiosConfigWithAuth(getState())
      )
      doRequest.then(
        (res) => {
          dispatch({
            type: MANAGE_REORDER_ACTION_ITEMS_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: MANAGE_REORDER_ACTION_ITEMS_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissReorderActionItemsError() {
  return {
    type: MANAGE_REORDER_ACTION_ITEMS_DISMISS_ERROR,
  };
}

export function useReorderActionItems() {
  const dispatch = useDispatch();

  const { reorderActionItemsPending, reorderActionItemsError } = useSelector(
    state => ({
      reorderActionItemsPending: state.manage.reorderActionItemsPending,
      reorderActionItemsError: state.manage.reorderActionItemsError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(reorderActionItems(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissReorderActionItemsError());
  }, [dispatch]);

  return {
    reorderActionItems: boundAction,
    reorderActionItemsPending,
    reorderActionItemsError,
    dismissReorderActionItemsError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case MANAGE_REORDER_ACTION_ITEMS_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        reorderActionItemsPending: true,
        reorderActionItemsError: null,
      };

    case MANAGE_REORDER_ACTION_ITEMS_SUCCESS:
      // The request is success
      return {
        ...state,
        reorderActionItemsPending: false,
        reorderActionItemsError: null,
      };

    case MANAGE_REORDER_ACTION_ITEMS_FAILURE:
      // The request is failed
      return {
        ...state,
        reorderActionItemsPending: false,
        reorderActionItemsError: action.data.error,
      };

    case MANAGE_REORDER_ACTION_ITEMS_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        reorderActionItemsError: null,
      };

    default:
      return state;
  }
}
