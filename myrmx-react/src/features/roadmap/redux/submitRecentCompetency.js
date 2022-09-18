import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  ROADMAP_SUBMIT_RECENT_COMPETENCY_BEGIN,
  ROADMAP_SUBMIT_RECENT_COMPETENCY_SUCCESS,
  ROADMAP_SUBMIT_RECENT_COMPETENCY_FAILURE,
  ROADMAP_SUBMIT_RECENT_COMPETENCY_DISMISS_ERROR,
} from './constants';

import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function submitRecentCompetency(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: ROADMAP_SUBMIT_RECENT_COMPETENCY_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.post(
        `${config.apiRootUrl}/recent-competencies/`,
        args,
        createAxiosConfigWithAuth(getState()),
      );
      doRequest.then(
        (res) => {
          dispatch({
            type: ROADMAP_SUBMIT_RECENT_COMPETENCY_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: ROADMAP_SUBMIT_RECENT_COMPETENCY_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissSubmitRecentCompetencyError() {
  return {
    type: ROADMAP_SUBMIT_RECENT_COMPETENCY_DISMISS_ERROR,
  };
}

export function useSubmitRecentCompetency() {
  const dispatch = useDispatch();

  const { submitRecentCompetencyPending, submitRecentCompetencyError } = useSelector(
    state => ({
      submitRecentCompetencyPending: state.roadmap.submitRecentCompetencyPending,
      submitRecentCompetencyError: state.roadmap.submitRecentCompetencyError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(submitRecentCompetency(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissSubmitRecentCompetencyError());
  }, [dispatch]);

  return {
    submitRecentCompetency: boundAction,
    submitRecentCompetencyPending,
    submitRecentCompetencyError,
    dismissSubmitRecentCompetencyError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case ROADMAP_SUBMIT_RECENT_COMPETENCY_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        submitRecentCompetencyPending: true,
        submitRecentCompetencyError: null,
      };

    case ROADMAP_SUBMIT_RECENT_COMPETENCY_SUCCESS:
      // The request is success
      return {
        ...state,
        submitRecentCompetencyPending: false,
        submitRecentCompetencyError: null,
      };

    case ROADMAP_SUBMIT_RECENT_COMPETENCY_FAILURE:
      // The request is failed
      return {
        ...state,
        submitRecentCompetencyPending: false,
        submitRecentCompetencyError: action.data.error,
      };

    case ROADMAP_SUBMIT_RECENT_COMPETENCY_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        submitRecentCompetencyError: null,
      };

    default:
      return state;
  }
}
