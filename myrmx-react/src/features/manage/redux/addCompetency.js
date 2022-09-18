import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  MANAGE_ADD_COMPETENCY_BEGIN,
  MANAGE_ADD_COMPETENCY_SUCCESS,
  MANAGE_ADD_COMPETENCY_FAILURE,
  MANAGE_ADD_COMPETENCY_DISMISS_ERROR,
} from './constants';

import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function addCompetency(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: MANAGE_ADD_COMPETENCY_BEGIN,
    });

    const {roadmapId, stage} = args;
    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.post(
        `${config.apiRootUrl}/roadmaps/${roadmapId}/stages/${stage}/competencies/`,
        args,
        createAxiosConfigWithAuth(getState())
      )
      doRequest.then(
        (res) => {
          dispatch({
            type: MANAGE_ADD_COMPETENCY_SUCCESS,
            data: res.data,
          });
          resolve(res.data);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: MANAGE_ADD_COMPETENCY_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissAddCompetencyError() {
  return {
    type: MANAGE_ADD_COMPETENCY_DISMISS_ERROR,
  };
}

export function useAddCompetency() {
  const dispatch = useDispatch();

  const { addCompetencyPending, addCompetencyError } = useSelector(
    state => ({
      addCompetencyPending: state.manage.addCompetencyPending,
      addCompetencyError: state.manage.addCompetencyError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(addCompetency(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissAddCompetencyError());
  }, [dispatch]);

  return {
    addCompetency: boundAction,
    addCompetencyPending,
    addCompetencyError,
    dismissAddCompetencyError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case MANAGE_ADD_COMPETENCY_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        addCompetencyPending: true,
        addCompetencyError: null,
      };

    case MANAGE_ADD_COMPETENCY_SUCCESS:
      // The request is success
      return {
        ...state,
        addCompetencyPending: false,
        addCompetencyError: null,
      };

    case MANAGE_ADD_COMPETENCY_FAILURE:
      // The request is failed
      return {
        ...state,
        addCompetencyPending: false,
        addCompetencyError: action.data.error,
      };

    case MANAGE_ADD_COMPETENCY_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        addCompetencyError: null,
      };

    default:
      return state;
  }
}
