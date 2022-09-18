import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import axios from 'axios';
import {
  MANAGE_FETCH_USER_ACCOUNTS_BEGIN,
  MANAGE_FETCH_USER_ACCOUNTS_SUCCESS,
  MANAGE_FETCH_USER_ACCOUNTS_FAILURE,
  MANAGE_FETCH_USER_ACCOUNTS_DISMISS_ERROR,
} from './constants';
import config from '../../../common/config';
import fp from 'lodash/fp';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function fetchUserAccounts(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: MANAGE_FETCH_USER_ACCOUNTS_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const { search, page, sortBy } = args;
      const doRequest = axios.get(`${config.apiRootUrl}/users/`, {
        params: {
          search,
          page: page ? page + 1 : undefined,
          ordering: sortBy
        },
        ...createAxiosConfigWithAuth(getState())
      });

      doRequest.then(
        (res) => {
          const results = { page, ...res.data }
          dispatch({
            type: MANAGE_FETCH_USER_ACCOUNTS_SUCCESS,
            data: results,
          });
          resolve(results);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: MANAGE_FETCH_USER_ACCOUNTS_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissFetchUserAccountsError() {
  return {
    type: MANAGE_FETCH_USER_ACCOUNTS_DISMISS_ERROR,
  };
}

export function useFetchUserAccounts() {
  const dispatch = useDispatch();

  const { accounts, fetchUserAccountsPending, fetchUserAccountsError } = useSelector(
    state => ({
      accounts: state.manage.accounts,
      fetchUserAccountsPending: state.manage.fetchUserAccountsPending,
      fetchUserAccountsError: state.manage.fetchUserAccountsError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(fetchUserAccounts(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissFetchUserAccountsError());
  }, [dispatch]);

  return {
    accounts,
    fetchUserAccounts: boundAction,
    fetchUserAccountsPending,
    fetchUserAccountsError,
    dismissFetchUserAccountsError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case MANAGE_FETCH_USER_ACCOUNTS_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        fetchUserAccountsPending: true,
        fetchUserAccountsError: null,
      };

    case MANAGE_FETCH_USER_ACCOUNTS_SUCCESS:
      // The request is success
      const page = (action.data && action.data.page) || 0;
      const results = page === 0 ? [] : state.accounts.results;
      return fp.compose(
        fp.set('accounts', {
          page,
          next: action.data.next,
          count: action.data.count,
          results: results.concat(action.data.results)
        }),
        fp.set('fetchUserAccountsPending', false),
        fp.set('fetchUserAccountsError', null)
      )(state);

    case MANAGE_FETCH_USER_ACCOUNTS_FAILURE:
      // The request is failed
      return {
        ...state,
        fetchUserAccountsPending: false,
        fetchUserAccountsError: action.data.error,
      };

    case MANAGE_FETCH_USER_ACCOUNTS_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        fetchUserAccountsError: null,
      };

    default:
      return state;
  }
}
