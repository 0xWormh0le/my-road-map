import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  MANAGE_FETCH_USER_ROADMAPS_BEGIN,
  MANAGE_FETCH_USER_ROADMAPS_SUCCESS,
  MANAGE_FETCH_USER_ROADMAPS_FAILURE,
  MANAGE_FETCH_USER_ROADMAPS_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import fp from 'lodash/fp'
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';


export function fetchUserRoadmaps(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: MANAGE_FETCH_USER_ROADMAPS_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const { userId, type } = args
      // type can be any of 'assigned', 'archived' and 'available'
      const doRequest = axios.get(`${config.apiRootUrl}/users/${userId}/${type}-roadmaps/`, createAxiosConfigWithAuth(getState()));
      doRequest.then(
        (res) => {
          const result = { type, data: res.data.results }
          dispatch({
            type: MANAGE_FETCH_USER_ROADMAPS_SUCCESS,
            data: result,
          });
          resolve(result);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: MANAGE_FETCH_USER_ROADMAPS_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissFetchUserRoadmapsError() {
  return {
    type: MANAGE_FETCH_USER_ROADMAPS_DISMISS_ERROR,
  };
}

export function useFetchUserRoadmaps() {
  const dispatch = useDispatch();

  const { userRoadmaps, fetchUserRoadmapsPending, fetchUserRoadmapsError } = useSelector(
    state => ({
      userRoadmaps: state.manage.userRoadmaps,
      fetchUserRoadmapsPending: state.manage.fetchUserRoadmapsPending,
      fetchUserRoadmapsError: state.manage.fetchUserRoadmapsError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(fetchUserRoadmaps(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissFetchUserRoadmapsError());
  }, [dispatch]);

  return {
    userRoadmaps,
    fetchUserRoadmaps: boundAction,
    fetchUserRoadmapsPending,
    fetchUserRoadmapsError,
    dismissFetchUserRoadmapsError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case MANAGE_FETCH_USER_ROADMAPS_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        fetchUserRoadmapsPending: true,
        fetchUserRoadmapsError: null,
      };

    case MANAGE_FETCH_USER_ROADMAPS_SUCCESS:
      // The request is success
      return fp.compose(
        fp.set(`userRoadmaps.${action.data.type}`, action.data.data),
        fp.set('fetchUserRoadmapsPending', false),
        fp.set('fetchUserRoadmapsError', null),
      )(state)

    case MANAGE_FETCH_USER_ROADMAPS_FAILURE:
      // The request is failed
      return {
        ...state,
        fetchUserRoadmapsPending: false,
        fetchUserRoadmapsError: action.data.error,
      };

    case MANAGE_FETCH_USER_ROADMAPS_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        fetchUserRoadmapsError: null,
      };

    default:
      return state;
  }
}
