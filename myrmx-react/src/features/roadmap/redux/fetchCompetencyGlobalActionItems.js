import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  ROADMAP_FETCH_COMPETENCY_GLOBAL_ACTION_ITEMS_BEGIN,
  ROADMAP_FETCH_COMPETENCY_GLOBAL_ACTION_ITEMS_SUCCESS,
  ROADMAP_FETCH_COMPETENCY_GLOBAL_ACTION_ITEMS_FAILURE,
  ROADMAP_FETCH_COMPETENCY_GLOBAL_ACTION_ITEMS_DISMISS_ERROR,
} from './constants';

import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function fetchCompetencyGlobalActionItems(args = {}) {
  return (dispatch, getState) => {
    // optionally you can have getState as the second argument
    dispatch({
      type: ROADMAP_FETCH_COMPETENCY_GLOBAL_ACTION_ITEMS_BEGIN,
    });

    const { roadmapId, stageId, competencyId } = args;
    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.get(
        `${config.apiRootUrl}/roadmaps/${roadmapId}/stages/${stageId}/competencies/${competencyId}/global-action-items/`,
        createAxiosConfigWithAuth(getState()),
      );
      doRequest.then(
        res => {
          dispatch({
            type: ROADMAP_FETCH_COMPETENCY_GLOBAL_ACTION_ITEMS_SUCCESS,
            data: res.data.results,
          });
          resolve(res.data.results);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        err => {
          dispatch({
            type: ROADMAP_FETCH_COMPETENCY_GLOBAL_ACTION_ITEMS_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissFetchCompetencyGlobalActionItemsError() {
  return {
    type: ROADMAP_FETCH_COMPETENCY_GLOBAL_ACTION_ITEMS_DISMISS_ERROR,
  };
}

export function useFetchCompetencyGlobalActionItems() {
  const dispatch = useDispatch();

  const {
    actionItems,
    fetchCompetencyGlobalActionItemsPending,
    fetchCompetencyGlobalActionItemsError,
  } = useSelector(
    state => ({
      actionItems: state.roadmap.actionItems,
      fetchCompetencyGlobalActionItemsPending:
        state.roadmap.fetchCompetencyGlobalActionItemsPending,
      fetchCompetencyGlobalActionItemsError: state.roadmap.fetchCompetencyGlobalActionItemsError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (...args) => {
      return dispatch(fetchCompetencyGlobalActionItems(...args));
    },
    [dispatch],
  );

  const boundDismissError = useCallback(() => {
    return dispatch(dismissFetchCompetencyGlobalActionItemsError());
  }, [dispatch]);

  return {
    actionItems,
    fetchCompetencyGlobalActionItems: boundAction,
    fetchCompetencyGlobalActionItemsPending,
    fetchCompetencyGlobalActionItemsError,
    dismissFetchCompetencyGlobalActionItemsError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case ROADMAP_FETCH_COMPETENCY_GLOBAL_ACTION_ITEMS_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        fetchCompetencyGlobalActionItemsPending: true,
        fetchCompetencyGlobalActionItemsError: null,
      };

    case ROADMAP_FETCH_COMPETENCY_GLOBAL_ACTION_ITEMS_SUCCESS:
      // The request is success
      return {
        ...state,
        fetchCompetencyGlobalActionItemsPending: false,
        fetchCompetencyGlobalActionItemsError: null,
        actionItems: Object.assign({}, ...action.data.map(ai => ({ [ai.id]: ai }))),
      };

    case ROADMAP_FETCH_COMPETENCY_GLOBAL_ACTION_ITEMS_FAILURE:
      // The request is failed
      return {
        ...state,
        fetchCompetencyGlobalActionItemsPending: false,
        fetchCompetencyGlobalActionItemsError: action.data.error,
      };

    case ROADMAP_FETCH_COMPETENCY_GLOBAL_ACTION_ITEMS_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        fetchCompetencyGlobalActionItemsError: null,
      };

    default:
      return state;
  }
}
