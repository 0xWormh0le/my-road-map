import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import axios from 'axios';
import {
  MESSAGES_FETCH_RECIPIENTS_BEGIN,
  MESSAGES_FETCH_RECIPIENTS_SUCCESS,
  MESSAGES_FETCH_RECIPIENTS_FAILURE,
  MESSAGES_FETCH_RECIPIENTS_DISMISS_ERROR,
} from './constants';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function fetchRecipients(args = {}) {
  return (dispatch, getState) => {
    dispatch({
      type: MESSAGES_FETCH_RECIPIENTS_BEGIN,
    });

    const { search } = args;
    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.get(`${config.apiRootUrl}/messages/recipients/`, {
        params: {
          search,
        },
        ...createAxiosConfigWithAuth(getState())
      });
      doRequest.then(
        (res) => {
          dispatch({
            type: MESSAGES_FETCH_RECIPIENTS_SUCCESS,
            data: res.data.results,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: MESSAGES_FETCH_RECIPIENTS_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissFetchRecipientsError() {
  return {
    type: MESSAGES_FETCH_RECIPIENTS_DISMISS_ERROR,
  };
}

export function useFetchRecipients() {
  const dispatch = useDispatch();

  const { recipients, fetchRecipientsPending, fetchRecipientsError } = useSelector(
    state => ({
      recipients: state.messages.recipients,
      fetchRecipientsPending: state.messages.fetchRecipientsPending,
      fetchRecipientsError: state.messages.fetchRecipientsError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(fetchRecipients(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissFetchRecipientsError());
  }, [dispatch]);

  return {
    recipients,
    fetchRecipients: boundAction,
    fetchRecipientsPending,
    fetchRecipientsError,
    dismissFetchRecipientsError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case MESSAGES_FETCH_RECIPIENTS_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        fetchRecipientsPending: true,
        fetchRecipientsError: null,
      };

    case MESSAGES_FETCH_RECIPIENTS_SUCCESS:
      // The request is success
      return {
        ...state,
        fetchRecipientsPending: false,
        fetchRecipientsError: null,
        recipients: action.data,
      };

    case MESSAGES_FETCH_RECIPIENTS_FAILURE:
      // The request is failed
      return {
        ...state,
        fetchRecipientsPending: false,
        fetchRecipientsError: action.data.error,
      };

    case MESSAGES_FETCH_RECIPIENTS_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        fetchRecipientsError: null,
      };

    default:
      return state;
  }
}
