import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  ROADMAP_SET_ACTION_ITEM_DETAILS_BEGIN,
  ROADMAP_SET_ACTION_ITEM_DETAILS_SUCCESS,
  ROADMAP_SET_ACTION_ITEM_DETAILS_FAILURE,
  ROADMAP_SET_ACTION_ITEM_DETAILS_DISMISS_ERROR,
} from './constants';

import fp from 'lodash/fp';
import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function setActionItemDetails(args = {}) {
  return (dispatch, getState) => {
    // optionally you can have getState as the second argument
    dispatch({
      type: ROADMAP_SET_ACTION_ITEM_DETAILS_BEGIN,
    });

    const { roadmapId, stageId, competencyId, actionItemId, data } = args;

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.patch(
        `${config.apiRootUrl}/roadmaps/${roadmapId}/stages/${stageId}/competencies/${competencyId}/action-item-assessments/${actionItemId}/`,
        data,
        createAxiosConfigWithAuth(getState()),
      );
      doRequest.then(
        res => {
          dispatch({
            type: ROADMAP_SET_ACTION_ITEM_DETAILS_SUCCESS,
            data: res.data,
          });
          resolve(res.data);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        err => {
          dispatch({
            type: ROADMAP_SET_ACTION_ITEM_DETAILS_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissSetActionItemDetailsError() {
  return {
    type: ROADMAP_SET_ACTION_ITEM_DETAILS_DISMISS_ERROR,
  };
}

export function useSetActionItemDetails() {
  const dispatch = useDispatch();

  const { setActionItemDetailsPending, setActionItemDetailsError } = useSelector(
    state => ({
      setActionItemDetailsPending: state.roadmap.setActionItemDetailsPending,
      setActionItemDetailsError: state.roadmap.setActionItemDetailsError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (...args) => {
      return dispatch(setActionItemDetails(...args));
    },
    [dispatch],
  );

  const boundDismissError = useCallback(() => {
    return dispatch(dismissSetActionItemDetailsError());
  }, [dispatch]);

  return {
    setActionItemDetails: boundAction,
    setActionItemDetailsPending,
    setActionItemDetailsError,
    dismissSetActionItemDetailsError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case ROADMAP_SET_ACTION_ITEM_DETAILS_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        setActionItemDetailsPending: true,
        setActionItemDetailsError: null,
      };

    case ROADMAP_SET_ACTION_ITEM_DETAILS_SUCCESS:
      // The request is success
      const { data } = action;

      return fp.compose(
        fp.set('setActionItemDetailsPending', false),
        fp.set('setActionItemDetailsError', null),
        fp.set(`actionItems.${data.id}`, data)
      )(state);

    case ROADMAP_SET_ACTION_ITEM_DETAILS_FAILURE:
      // The request is failed
      return {
        ...state,
        setActionItemDetailsPending: false,
        setActionItemDetailsError: action.data.error,
      };

    case ROADMAP_SET_ACTION_ITEM_DETAILS_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        setActionItemDetailsError: null,
      };

    default:
      return state;
  }
}
