import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  COMMON_FETCH_UPDATES_BEGIN,
  COMMON_FETCH_UPDATES_SUCCESS,
  COMMON_FETCH_UPDATES_FAILURE,
  COMMON_FETCH_UPDATES_DISMISS_ERROR,
} from './constants';

import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function fetchUpdates(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: COMMON_FETCH_UPDATES_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.get(
        `${config.apiRootUrl}/updates/`,
        createAxiosConfigWithAuth(getState()),
      );
      doRequest.then(
        (res) => {
          dispatch({
            type: COMMON_FETCH_UPDATES_SUCCESS,
            data: res.data,
          });
          resolve(res.data);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: COMMON_FETCH_UPDATES_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissFetchUpdatesError() {
  return {
    type: COMMON_FETCH_UPDATES_DISMISS_ERROR,
  };
}

export function useFetchUpdates() {
  const dispatch = useDispatch();

  const { updates, fetchUpdatesPending, fetchUpdatesError } = useSelector(
    state => ({
      updates: state.common.updates,
      fetchUpdatesPending: state.common.fetchUpdatesPending,
      fetchUpdatesError: state.common.fetchUpdatesError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(fetchUpdates(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissFetchUpdatesError());
  }, [dispatch]);

  return {
    updates,
    fetchUpdates: boundAction,
    fetchUpdatesPending,
    fetchUpdatesError,
    dismissFetchUpdatesError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case COMMON_FETCH_UPDATES_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        fetchUpdatesPending: true,
        fetchUpdatesError: null,
      };

    case COMMON_FETCH_UPDATES_SUCCESS:
      // The request is success
      return {
        ...state,
        fetchUpdatesPending: false,
        fetchUpdatesError: null,
        updates: action.data,
      };

    case COMMON_FETCH_UPDATES_FAILURE:
      // The request is failed
      return {
        ...state,
        fetchUpdatesPending: false,
        fetchUpdatesError: action.data.error,
      };

    case COMMON_FETCH_UPDATES_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        fetchUpdatesError: null,
      };

    default:
      return state;
  }
}
