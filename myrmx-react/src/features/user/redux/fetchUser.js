import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import axios from 'axios';
import {
  USER_FETCH_USER_BEGIN,
  USER_FETCH_USER_SUCCESS,
  USER_FETCH_USER_FAILURE,
  USER_FETCH_USER_DISMISS_ERROR,
  USER_DELETE_COACH_SUCCESS
} from './constants';
import upperFirst from 'lodash/upperFirst';
import lowerFirst from 'lodash/lowerFirst';
import fp from 'lodash/fp';
import toUpper from 'lodash/toUpper';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';
import { updateUserApprovedStatus } from '../../home/redux/fetchAuthToken';
import pluralize from 'pluralize';

export function fetchUser(args = {}) {
  return (dispatch, getState) => {
    dispatch({
      type: USER_FETCH_USER_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.get(`${config.apiRootUrl}/profile/`, createAxiosConfigWithAuth(getState()));
      doRequest.then(
        (res) => {
          dispatch({
            type: USER_FETCH_USER_SUCCESS,
            data: res.data,
          });
          dispatch(updateUserApprovedStatus(res.data.user_is_approved));
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: USER_FETCH_USER_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissFetchUserError() {
  return {
    type: USER_FETCH_USER_DISMISS_ERROR,
  };
}

export function useFetchUser(params) {
  const dispatch = useDispatch();

  const { user, fetchUserPending, fetchUserError } = useSelector(
    state => ({
      user: state.user.user,
      fetchUserPending: state.user.fetchUserPending,
      fetchUserError: state.user.fetchUserError,
    }),
    shallowEqual,
  );

  const replaceStringWithSynonyms = useCallback(str => {
    if (user && user.synonyms) {
      return Object.keys(user.synonyms).reduce((res, ow) => {
        const nw = user.synonyms[ow]
        const replacements = [
          { ow: pluralize(ow), nw: lowerFirst(pluralize(nw)) },
          { ow, nw: lowerFirst(nw) },
        ]
        let result = res
        for (const { ow, nw } of replacements) {
          result = result
            .replaceAll(ow, nw)
            .replaceAll(upperFirst(ow), upperFirst(nw))
            .replaceAll(toUpper(ow), toUpper(nw))
        }
        return result
      }, str)
    } else {
      return str
    }
  }, [user])

  const boundAction = useCallback((...args) => {
    return dispatch(fetchUser(...args));
  }, [dispatch]);

  useEffect(() => {
    if (params) boundAction(...(params || []));
  }, [...(params || []), boundAction]); // eslint-disable-line

  const boundDismissError = useCallback(() => {
    return dispatch(dismissFetchUserError());
  }, [dispatch]);

  return {
    user,
    replaceStringWithSynonyms,
    fetchUser: boundAction,
    fetchUserPending,
    fetchUserError,
    dismissFetchUserError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case USER_FETCH_USER_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        fetchUserPending: true,
        fetchUserError: null,
      };

    case USER_FETCH_USER_SUCCESS:
      // The request is success
      return {
        ...state,
        fetchUserPending: false,
        fetchUserError: null,
        user: action.data,
      };

    case USER_DELETE_COACH_SUCCESS:
      return fp.compose(
        fp.set('user.coaches', state.user.coaches.filter(user => action.data !== user.id))
      )(state)

    case USER_FETCH_USER_FAILURE:
      // The request is failed
      return {
        ...state,
        fetchUserPending: false,
        fetchUserError: action.data.error,
      };

    case USER_FETCH_USER_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        fetchUserError: null,
      };

    default:
      return state;
  }
}
