import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  MANAGE_ADD_GLOBAL_ACTION_ITEM_BEGIN,
  MANAGE_ADD_GLOBAL_ACTION_ITEM_SUCCESS,
  MANAGE_ADD_GLOBAL_ACTION_ITEM_FAILURE,
  MANAGE_ADD_GLOBAL_ACTION_ITEM_DISMISS_ERROR,
} from './constants';

import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function addGlobalActionItem(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: MANAGE_ADD_GLOBAL_ACTION_ITEM_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const { roadmapId, stageId, competencyId } = args;

      const doRequest = axios.post(
        `${config.apiRootUrl}/roadmaps/${roadmapId}/stages/${stageId}/competencies/${competencyId}/global-action-items/`,
        args,
        createAxiosConfigWithAuth(getState())
      )

      doRequest.then(
        (res) => {
          dispatch({
            type: MANAGE_ADD_GLOBAL_ACTION_ITEM_SUCCESS,
            data: res.data,
          });
          resolve(res.data);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: MANAGE_ADD_GLOBAL_ACTION_ITEM_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissAddGlobalActionItemError() {
  return {
    type: MANAGE_ADD_GLOBAL_ACTION_ITEM_DISMISS_ERROR,
  };
}

export function useAddGlobalActionItem() {
  const dispatch = useDispatch();

  const { addGlobalActionItemPending, addGlobalActionItemError } = useSelector(
    state => ({
      addGlobalActionItemPending: state.manage.addGlobalActionItemPending,
      addGlobalActionItemError: state.manage.addGlobalActionItemError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(addGlobalActionItem(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissAddGlobalActionItemError());
  }, [dispatch]);

  return {
    addGlobalActionItem: boundAction,
    addGlobalActionItemPending,
    addGlobalActionItemError,
    dismissAddGlobalActionItemError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case MANAGE_ADD_GLOBAL_ACTION_ITEM_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        addGlobalActionItemPending: true,
        addGlobalActionItemError: null,
      };

    case MANAGE_ADD_GLOBAL_ACTION_ITEM_SUCCESS:
      // The request is success
      return {
        ...state,
        addGlobalActionItemPending: false,
        addGlobalActionItemError: null,
      };

    case MANAGE_ADD_GLOBAL_ACTION_ITEM_FAILURE:
      // The request is failed
      return {
        ...state,
        addGlobalActionItemPending: false,
        addGlobalActionItemError: action.data.error,
      };

    case MANAGE_ADD_GLOBAL_ACTION_ITEM_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        addGlobalActionItemError: null,
      };

    default:
      return state;
  }
}
