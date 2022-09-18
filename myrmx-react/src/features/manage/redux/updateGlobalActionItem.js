import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  MANAGE_UPDATE_GLOBAL_ACTION_ITEM_BEGIN,
  MANAGE_UPDATE_GLOBAL_ACTION_ITEM_SUCCESS,
  MANAGE_UPDATE_GLOBAL_ACTION_ITEM_FAILURE,
  MANAGE_UPDATE_GLOBAL_ACTION_ITEM_DISMISS_ERROR,
} from './constants';

import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function updateGlobalActionItem(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: MANAGE_UPDATE_GLOBAL_ACTION_ITEM_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const { roadmapId, stageId, competencyId, actionItemId } = args;

      const doRequest = axios.patch(
        `${config.apiRootUrl}/roadmaps/${roadmapId}/stages/${stageId}/competencies/${competencyId}/global-action-items/${actionItemId}/`,
        args,
        createAxiosConfigWithAuth(getState())
      )

      doRequest.then(
        (res) => {
          dispatch({
            type: MANAGE_UPDATE_GLOBAL_ACTION_ITEM_SUCCESS,
            data: res.data,
          });
          resolve(res.data);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: MANAGE_UPDATE_GLOBAL_ACTION_ITEM_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissUpdateGlobalActionItemError() {
  return {
    type: MANAGE_UPDATE_GLOBAL_ACTION_ITEM_DISMISS_ERROR,
  };
}

export function useUpdateGlobalActionItem() {
  const dispatch = useDispatch();

  const { updateGlobalActionItemPending, updateGlobalActionItemError } = useSelector(
    state => ({
      updateGlobalActionItemPending: state.manage.updateGlobalActionItemPending,
      updateGlobalActionItemError: state.manage.updateGlobalActionItemError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(updateGlobalActionItem(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissUpdateGlobalActionItemError());
  }, [dispatch]);

  return {
    updateGlobalActionItem: boundAction,
    updateGlobalActionItemPending,
    updateGlobalActionItemError,
    dismissUpdateGlobalActionItemError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case MANAGE_UPDATE_GLOBAL_ACTION_ITEM_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        updateGlobalActionItemPending: true,
        updateGlobalActionItemError: null,
      };

    case MANAGE_UPDATE_GLOBAL_ACTION_ITEM_SUCCESS:
      // The request is success
      return {
        ...state,
        updateGlobalActionItemPending: false,
        updateGlobalActionItemError: null,
      };

    case MANAGE_UPDATE_GLOBAL_ACTION_ITEM_FAILURE:
      // The request is failed
      return {
        ...state,
        updateGlobalActionItemPending: false,
        updateGlobalActionItemError: action.data.error,
      };

    case MANAGE_UPDATE_GLOBAL_ACTION_ITEM_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        updateGlobalActionItemError: null,
      };

    default:
      return state;
  }
}
