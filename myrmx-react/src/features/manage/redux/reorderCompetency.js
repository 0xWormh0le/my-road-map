import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  MANAGE_REORDER_COMPETENCY_BEGIN,
  MANAGE_REORDER_COMPETENCY_SUCCESS,
  MANAGE_REORDER_COMPETENCY_FAILURE,
  MANAGE_REORDER_COMPETENCY_DISMISS_ERROR,
} from './constants';

import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function reorderCompetency(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: MANAGE_REORDER_COMPETENCY_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const { roadmapId, stageId } = args;
      const doRequest = axios.post(
        `${config.apiRootUrl}/roadmaps/${roadmapId}/stages/${stageId}/reorder-competencies/`,
        args,
        createAxiosConfigWithAuth(getState())
      )
      doRequest.then(
        (res) => {
          dispatch({
            type: MANAGE_REORDER_COMPETENCY_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: MANAGE_REORDER_COMPETENCY_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissReorderCompetencyError() {
  return {
    type: MANAGE_REORDER_COMPETENCY_DISMISS_ERROR,
  };
}

export function useReorderCompetency() {
  const dispatch = useDispatch();

  const { reorderCompetencyPending, reorderCompetencyError } = useSelector(
    state => ({
      reorderCompetencyPending: state.manage.reorderCompetencyPending,
      reorderCompetencyError: state.manage.reorderCompetencyError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(reorderCompetency(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissReorderCompetencyError());
  }, [dispatch]);

  return {
    reorderCompetency: boundAction,
    reorderCompetencyPending,
    reorderCompetencyError,
    dismissReorderCompetencyError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case MANAGE_REORDER_COMPETENCY_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        reorderCompetencyPending: true,
        reorderCompetencyError: null,
      };

    case MANAGE_REORDER_COMPETENCY_SUCCESS:
      // The request is success
      return {
        ...state,
        reorderCompetencyPending: false,
        reorderCompetencyError: null,
      };

    case MANAGE_REORDER_COMPETENCY_FAILURE:
      // The request is failed
      return {
        ...state,
        reorderCompetencyPending: false,
        reorderCompetencyError: action.data.error,
      };

    case MANAGE_REORDER_COMPETENCY_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        reorderCompetencyError: null,
      };

    default:
      return state;
  }
}
