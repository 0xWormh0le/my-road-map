import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  ROADMAP_ADD_ACTION_ITEM_BEGIN,
  ROADMAP_ADD_ACTION_ITEM_SUCCESS,
  ROADMAP_ADD_ACTION_ITEM_FAILURE,
  ROADMAP_ADD_ACTION_ITEM_DISMISS_ERROR,
} from './constants';

import axios from 'axios';
import fp from 'lodash/fp'
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function addActionItem(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: ROADMAP_ADD_ACTION_ITEM_BEGIN,
    });

    const { roadmapId, stageId, competencyId, data } = args;

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.post(
        `${config.apiRootUrl}/roadmaps/${roadmapId}/stages/${stageId}/competencies/${competencyId}/action-item-assessments/`,
        data,
        createAxiosConfigWithAuth(getState()),
      );
      doRequest.then(
        (res) => {
          dispatch({
            type: ROADMAP_ADD_ACTION_ITEM_SUCCESS,
            data: res.data,
          });
          resolve(res.data);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: ROADMAP_ADD_ACTION_ITEM_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissAddActionItemError() {
  return {
    type: ROADMAP_ADD_ACTION_ITEM_DISMISS_ERROR,
  };
}

export function useAddActionItem() {
  const dispatch = useDispatch();

  const { addActionItemPending, addActionItemError } = useSelector(
    state => ({
      addActionItemPending: state.roadmap.addActionItemPending,
      addActionItemError: state.roadmap.addActionItemError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(addActionItem(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissAddActionItemError());
  }, [dispatch]);

  return {
    addActionItem: boundAction,
    addActionItemPending,
    addActionItemError,
    dismissAddActionItemError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case ROADMAP_ADD_ACTION_ITEM_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        addActionItemPending: true,
        addActionItemError: null,
      };

    case ROADMAP_ADD_ACTION_ITEM_SUCCESS:
      // The request is success
      const { data } = action
      const { action_item_ids } = state.competencies[data.competency]

      return fp.compose(
        fp.set('addActionItemPending', false),
        fp.set('addActionItemError', null),
        fp.set(`competencies.${data.competency}.action_item_ids`, action_item_ids.concat([data.id])),
        fp.set(`actionItems.${data.id}`, data)
      )(state)

    case ROADMAP_ADD_ACTION_ITEM_FAILURE:
      // The request is failed
      return {
        ...state,
        addActionItemPending: false,
        addActionItemError: action.data.error,
      };

    case ROADMAP_ADD_ACTION_ITEM_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        addActionItemError: null,
      };

    default:
      return state;
  }
}
