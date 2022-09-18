import axios from 'axios';
import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  NOTIFICATIONS_MARK_COMMENTS_READ_BEGIN,
  NOTIFICATIONS_MARK_COMMENTS_READ_SUCCESS,
  NOTIFICATIONS_MARK_COMMENTS_READ_FAILURE,
  NOTIFICATIONS_MARK_COMMENTS_READ_DISMISS_ERROR,
} from './constants';

import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function markCommentsRead(args = {}) {
  return (dispatch, getState) => {
    dispatch({
      type: NOTIFICATIONS_MARK_COMMENTS_READ_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.post(
        `${config.apiRootUrl}/notifications/mark-comments-read/`,
        { comments: args },
        createAxiosConfigWithAuth(getState()),
      );
      doRequest.then(
        (res) => {
          dispatch({
            type: NOTIFICATIONS_MARK_COMMENTS_READ_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: NOTIFICATIONS_MARK_COMMENTS_READ_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissMarkCommentsReadError() {
  return {
    type: NOTIFICATIONS_MARK_COMMENTS_READ_DISMISS_ERROR,
  };
}

export function useMarkCommentsRead() {
  const dispatch = useDispatch();

  const { markCommentsReadPending, markCommentsReadError } = useSelector(
    state => ({
      markCommentsReadPending: state.notifications.markCommentsReadPending,
      markCommentsReadError: state.notifications.markCommentsReadError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(markCommentsRead(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissMarkCommentsReadError());
  }, [dispatch]);

  return {
    markCommentsRead: boundAction,
    markCommentsReadPending,
    markCommentsReadError,
    dismissMarkCommentsReadError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case NOTIFICATIONS_MARK_COMMENTS_READ_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        markCommentsReadPending: true,
        markCommentsReadError: null,
      };

    case NOTIFICATIONS_MARK_COMMENTS_READ_SUCCESS:
      // The request is success
      return {
        ...state,
        markCommentsReadPending: false,
        markCommentsReadError: null,
      };

    case NOTIFICATIONS_MARK_COMMENTS_READ_FAILURE:
      // The request is failed
      return {
        ...state,
        markCommentsReadPending: false,
        markCommentsReadError: action.data.error,
      };

    case NOTIFICATIONS_MARK_COMMENTS_READ_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        markCommentsReadError: null,
      };

    default:
      return state;
  }
}
