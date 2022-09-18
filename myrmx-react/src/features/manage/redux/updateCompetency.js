import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  MANAGE_UPDATE_COMPETENCY_BEGIN,
  MANAGE_UPDATE_COMPETENCY_SUCCESS,
  MANAGE_UPDATE_COMPETENCY_FAILURE,
  MANAGE_UPDATE_COMPETENCY_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function updateCompetency(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: MANAGE_UPDATE_COMPETENCY_BEGIN,
    });

    const { roadmap, stage, competency } = args;

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.patch(
        `${config.apiRootUrl}/roadmaps/${roadmap}/stages/${stage}/competencies/${competency}/`,
        args,
        createAxiosConfigWithAuth(getState())
      );

      doRequest.then(
        (res) => {
          dispatch({
            type: MANAGE_UPDATE_COMPETENCY_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: MANAGE_UPDATE_COMPETENCY_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissUpdateCompetencyError() {
  return {
    type: MANAGE_UPDATE_COMPETENCY_DISMISS_ERROR,
  };
}

export function useUpdateCompetency() {
  const dispatch = useDispatch();

  const { updateCompetencyPending, updateCompetencyError } = useSelector(
    state => ({
      updateCompetencyPending: state.manage.updateCompetencyPending,
      updateCompetencyError: state.manage.updateCompetencyError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(updateCompetency(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissUpdateCompetencyError());
  }, [dispatch]);

  return {
    updateCompetency: boundAction,
    updateCompetencyPending,
    updateCompetencyError,
    dismissUpdateCompetencyError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case MANAGE_UPDATE_COMPETENCY_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        updateCompetencyPending: true,
        updateCompetencyError: null,
      };

    case MANAGE_UPDATE_COMPETENCY_SUCCESS:
      // The request is success
      return {
        ...state,
        updateCompetencyPending: false,
        updateCompetencyError: null,
      };

    case MANAGE_UPDATE_COMPETENCY_FAILURE:
      // The request is failed
      return {
        ...state,
        updateCompetencyPending: false,
        updateCompetencyError: action.data.error,
      };

    case MANAGE_UPDATE_COMPETENCY_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        updateCompetencyError: null,
      };

    default:
      return state;
  }
}
