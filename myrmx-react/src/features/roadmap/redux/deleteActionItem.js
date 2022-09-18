import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  ROADMAP_DELETE_ACTION_ITEM_BEGIN,
  ROADMAP_DELETE_ACTION_ITEM_SUCCESS,
  ROADMAP_DELETE_ACTION_ITEM_FAILURE,
  ROADMAP_DELETE_ACTION_ITEM_DISMISS_ERROR,
} from './constants';

import axios from 'axios';
import fp from 'lodash/fp';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';


export function deleteActionItem(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: ROADMAP_DELETE_ACTION_ITEM_BEGIN,
    });

    const { roadmapId, stageId, competencyId, actionItemId } = args;

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.delete(
        `${config.apiRootUrl}/roadmaps/${roadmapId}/stages/${stageId}/competencies/${competencyId}/action-item-assessments/${actionItemId}/`,
        createAxiosConfigWithAuth(getState())
      );
      doRequest.then(
        (res) => {
          const data = { competency: competencyId, id: actionItemId }
          dispatch({
            type: ROADMAP_DELETE_ACTION_ITEM_SUCCESS,
            data,
          });
          resolve(data);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: ROADMAP_DELETE_ACTION_ITEM_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissDeleteActionItemError() {
  return {
    type: ROADMAP_DELETE_ACTION_ITEM_DISMISS_ERROR,
  };
}

export function useDeleteActionItem() {
  const dispatch = useDispatch();

  const { deleteActionItemPending, deleteActionItemError } = useSelector(
    state => ({
      deleteActionItemPending: state.roadmap.deleteActionItemPending,
      deleteActionItemError: state.roadmap.deleteActionItemError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(deleteActionItem(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissDeleteActionItemError());
  }, [dispatch]);

  return {
    deleteActionItem: boundAction,
    deleteActionItemPending,
    deleteActionItemError,
    dismissDeleteActionItemError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case ROADMAP_DELETE_ACTION_ITEM_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        deleteActionItemPending: true,
        deleteActionItemError: null,
      };

    case ROADMAP_DELETE_ACTION_ITEM_SUCCESS:
      // The request is success
      const { data } = action;
      const { action_item_ids } = state.competencies[data.competency];

      return fp.compose(
        fp.set('deleteActionItemPending', false),
        fp.set('deleteActionItemError', null),
        fp.set(`competencies.${data.competency}.action_item_ids`, action_item_ids.filter(v => v !== data.id)),
        fp.unset(`actionItems.${data.id}`)
      )(state);

    case ROADMAP_DELETE_ACTION_ITEM_FAILURE:
      // The request is failed
      return {
        ...state,
        deleteActionItemPending: false,
        deleteActionItemError: action.data.error,
      };

    case ROADMAP_DELETE_ACTION_ITEM_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        deleteActionItemError: null,
      };

    default:
      return state;
  }
}
