import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  MANAGE_COPY_COMPETENCY_BEGIN,
  MANAGE_COPY_COMPETENCY_SUCCESS,
  MANAGE_COPY_COMPETENCY_FAILURE,
  MANAGE_COPY_COMPETENCY_DISMISS_ERROR,
} from './constants';

import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function copyCompetency(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: MANAGE_COPY_COMPETENCY_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {

      const { roadmapId, stageId, competencyId } = args;

      const doRequest = axios.post(
        `${config.apiRootUrl}/roadmaps/${roadmapId}/stages/${stageId}/competencies/${competencyId}/copy-competency/`,
        args,
        createAxiosConfigWithAuth(getState())
      )

      doRequest.then(
        (res) => {
          dispatch({
            type: MANAGE_COPY_COMPETENCY_SUCCESS,
            data: res.data,
          });
          resolve(res.data);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: MANAGE_COPY_COMPETENCY_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissCopyCompetencyError() {
  return {
    type: MANAGE_COPY_COMPETENCY_DISMISS_ERROR,
  };
}

export function useCopyCompetency() {
  const dispatch = useDispatch();

  const { copyCompetencyPending, copyCompetencyError } = useSelector(
    state => ({
      copyCompetencyPending: state.manage.copyCompetencyPending,
      copyCompetencyError: state.manage.copyCompetencyError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(copyCompetency(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissCopyCompetencyError());
  }, [dispatch]);

  return {
    copyCompetency: boundAction,
    copyCompetencyPending,
    copyCompetencyError,
    dismissCopyCompetencyError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case MANAGE_COPY_COMPETENCY_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        copyCompetencyPending: true,
        copyCompetencyError: null,
      };

    case MANAGE_COPY_COMPETENCY_SUCCESS:
      // The request is success
      return {
        ...state,
        copyCompetencyPending: false,
        copyCompetencyError: null,
      };

    case MANAGE_COPY_COMPETENCY_FAILURE:
      // The request is failed
      return {
        ...state,
        copyCompetencyPending: false,
        copyCompetencyError: action.data.error,
      };

    case MANAGE_COPY_COMPETENCY_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        copyCompetencyError: null,
      };

    default:
      return state;
  }
}
