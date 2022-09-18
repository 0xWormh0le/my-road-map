import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  MANAGE_DELETE_COMPETENCY_BEGIN,
  MANAGE_DELETE_COMPETENCY_SUCCESS,
  MANAGE_DELETE_COMPETENCY_FAILURE,
  MANAGE_DELETE_COMPETENCY_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function deleteCompetency(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: MANAGE_DELETE_COMPETENCY_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const { roadmapId, stageId, competencyId } = args
      
      const doRequest = axios.delete(
        `${config.apiRootUrl}/roadmaps/${roadmapId}/stages/${stageId}/competencies/${competencyId}/`,
        createAxiosConfigWithAuth(getState())
      );

      doRequest.then(
        (res) => {
          dispatch({
            type: MANAGE_DELETE_COMPETENCY_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: MANAGE_DELETE_COMPETENCY_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissDeleteCompetencyError() {
  return {
    type: MANAGE_DELETE_COMPETENCY_DISMISS_ERROR,
  };
}

export function useDeleteCompetency() {
  const dispatch = useDispatch();

  const { deleteCompetencyPending, deleteCompetencyError } = useSelector(
    state => ({
      deleteCompetencyPending: state.manage.deleteCompetencyPending,
      deleteCompetencyError: state.manage.deleteCompetencyError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(deleteCompetency(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissDeleteCompetencyError());
  }, [dispatch]);

  return {
    deleteCompetency: boundAction,
    deleteCompetencyPending,
    deleteCompetencyError,
    dismissDeleteCompetencyError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case MANAGE_DELETE_COMPETENCY_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        deleteCompetencyPending: true,
        deleteCompetencyError: null,
      };

    case MANAGE_DELETE_COMPETENCY_SUCCESS:
      // The request is success
      return {
        ...state,
        deleteCompetencyPending: false,
        deleteCompetencyError: null,
      };

    case MANAGE_DELETE_COMPETENCY_FAILURE:
      // The request is failed
      return {
        ...state,
        deleteCompetencyPending: false,
        deleteCompetencyError: action.data.error,
      };

    case MANAGE_DELETE_COMPETENCY_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        deleteCompetencyError: null,
      };

    default:
      return state;
  }
}
