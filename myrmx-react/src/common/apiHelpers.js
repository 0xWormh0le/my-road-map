import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { clearAuthToken, clearUserApprovedStatus } from '../features/home/redux/fetchAuthToken';

function createAxiosConfigWithAuth(state) {
  return {
    headers: {
      'Authorization': `Token ${state.home ? state.home.authToken : ''}`,
    }
  };
}

function createAxiosFormDataConfigWithAuth(state) {
  return {
    headers: {
      'Authorization': `Token ${state.home ? state.home.authToken : ''}`,
      'Content-Type': 'multipart/form-data'
    }
  };
}

function useUnauthorizedErrorHandler() {
  const history = useHistory();
  const dispatch = useDispatch();

  return useCallback((err) => {
    if (err.response) {
      if (err.response.status === 401) {
        dispatch(clearAuthToken(() => history.push('/log-in')));
      } else if (err.response.status === 403) {
        dispatch(clearUserApprovedStatus(() => history.push({
          pathname: '/user-not-approved',
          state: {
            pathname: history.location.pathname
          }
        })));
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }, [history, dispatch]);
}

export { createAxiosConfigWithAuth, useUnauthorizedErrorHandler, createAxiosFormDataConfigWithAuth };
