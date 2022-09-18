import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  DASHBOARD_FETCH_ASSIGNED_USERS_BEGIN,
  DASHBOARD_FETCH_ASSIGNED_USERS_SUCCESS,
  DASHBOARD_FETCH_ASSIGNED_USERS_FAILURE,
  DASHBOARD_FETCH_ASSIGNED_USERS_DISMISS_ERROR,
} from './constants';
import { MANAGE_UPDATE_USER_AVATAR_SUCCESS } from '../../manage/redux/constants';
import axios from 'axios';
import config from '../../../common/config';
import fp from 'lodash/fp';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function fetchAssignedUsers(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: DASHBOARD_FETCH_ASSIGNED_USERS_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const { role, userId, search, ordering, type, page } = args
      const fetchSingle = !!userId
      let url = `${config.apiRootUrl}/users/`

      if (fetchSingle) {
        url += `${userId}/`
      }
      const doRequest = axios.get(url, {
        params: {
          forRole: role,
          groups__name: type,
          search,
          ordering,
          page: page ? page + 1 : undefined
        },
        ...createAxiosConfigWithAuth(getState())
      })

      doRequest.then(
        (res) => {
          const results = fetchSingle ? { results: [ res.data ] } : { page, type, ...res.data }
          dispatch({
            type: DASHBOARD_FETCH_ASSIGNED_USERS_SUCCESS,
            data: results,
          });
          resolve(results);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: DASHBOARD_FETCH_ASSIGNED_USERS_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissFetchAssignedUsersError() {
  return {
    type: DASHBOARD_FETCH_ASSIGNED_USERS_DISMISS_ERROR,
  };
}

export function useFetchAssignedUsers() {
  const dispatch = useDispatch();

  const { assignedUsers, assignedCoaches, fetchAssignedUsersPending, fetchAssignedUsersError } = useSelector(
    state => ({
      assignedUsers: state.dashboard.assignedUsers,
      assignedCoaches: state.dashboard.coach,
      fetchAssignedUsersPending: state.dashboard.fetchAssignedUsersPending,
      fetchAssignedUsersError: state.dashboard.fetchAssignedUsersError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(fetchAssignedUsers(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissFetchAssignedUsersError());
  }, [dispatch]);

  return {
    assignedUsers,
    assignedCoaches,
    fetchAssignedUsers: boundAction,
    fetchAssignedUsersPending,
    fetchAssignedUsersError,
    dismissFetchAssignedUsersError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case DASHBOARD_FETCH_ASSIGNED_USERS_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        fetchAssignedUsersPending: true,
        fetchAssignedUsersError: null,
      };

    case DASHBOARD_FETCH_ASSIGNED_USERS_SUCCESS:
      // The request is success
      const userKey = action.data.type ? action.data.type.toLowerCase() : 'assignedUsers'
      const page = action.data.page || 0
      const results = page === 0 ? [] : state.assignedUsers.results

      return fp.compose(
        fp.set(userKey, {
          page,
          next: action.data.next,
          count: action.data.count,
          results: results.concat(action.data.results)
        }),
        fp.set('fetchAssignedUsersPending', false),
        fp.set('fetchAssignedUsersError', null)
      )(state)

    case MANAGE_UPDATE_USER_AVATAR_SUCCESS:
      const i = state.assignedUsers.results.findIndex(u => u.id === action.data.id)
      if (i >= 0) {
        return fp.set(`assignedUsers.results[${i}].photo`, action.data.photo)(state)
      } else {
        return state
      }

    case DASHBOARD_FETCH_ASSIGNED_USERS_FAILURE:
      // The request is failed
      return {
        ...state,
        fetchAssignedUsersPending: false,
        fetchAssignedUsersError: action.data.error,
      };

    case DASHBOARD_FETCH_ASSIGNED_USERS_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        fetchAssignedUsersError: null,
      };

    default:
      return state;
  }
}
