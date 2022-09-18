import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  MANAGE_HIDE_COMPETENCY_BEGIN,
  MANAGE_HIDE_COMPETENCY_SUCCESS,
  MANAGE_HIDE_COMPETENCY_FAILURE,
  MANAGE_HIDE_COMPETENCY_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function hideCompetency(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: MANAGE_HIDE_COMPETENCY_BEGIN,
    });

    const { roadmapId, stageId, competencyId, studentId, hide } = args
    const type = hide ? 'hide' : 'unhide'
    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.post(
        `${config.apiRootUrl}/roadmaps/${roadmapId}/stages/${stageId}/competencies/${competencyId}/${type}-from-student/`,
        { student: studentId },
        createAxiosConfigWithAuth(getState())
      );
      doRequest.then(
        (res) => {
          dispatch({
            type: MANAGE_HIDE_COMPETENCY_SUCCESS,
            data: {
              student: studentId,
              competency: competencyId
            }
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: MANAGE_HIDE_COMPETENCY_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissHideCompetencyError() {
  return {
    type: MANAGE_HIDE_COMPETENCY_DISMISS_ERROR,
  };
}

export function useHideCompetency() {
  const dispatch = useDispatch();

  const { hideCompetencyPending, hideCompetencyError } = useSelector(
    state => ({
      hideCompetencyPending: state.manage.hideCompetencyPending,
      hideCompetencyError: state.manage.hideCompetencyError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(hideCompetency(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissHideCompetencyError());
  }, [dispatch]);

  return {
    hideCompetency: boundAction,
    hideCompetencyPending,
    hideCompetencyError,
    dismissHideCompetencyError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case MANAGE_HIDE_COMPETENCY_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        hideCompetencyPending: true,
        hideCompetencyError: null,
      };

    case MANAGE_HIDE_COMPETENCY_SUCCESS:
      // The request is success
      return {
        ...state,
        hideCompetencyPending: false,
        hideCompetencyError: null,
      };

    case MANAGE_HIDE_COMPETENCY_FAILURE:
      // The request is failed
      return {
        ...state,
        hideCompetencyPending: false,
        hideCompetencyError: action.data.error,
      };

    case MANAGE_HIDE_COMPETENCY_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        hideCompetencyError: null,
      };

    default:
      return state;
  }
}
