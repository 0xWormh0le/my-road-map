import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  HOME_FETCH_COACH_INVITATION_BEGIN,
  HOME_FETCH_COACH_INVITATION_SUCCESS,
  HOME_FETCH_COACH_INVITATION_FAILURE,
  HOME_FETCH_COACH_INVITATION_DISMISS_ERROR,
} from './constants';
import config from '../../../common/config';
import axios from 'axios';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function fetchCoachInvitation(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: HOME_FETCH_COACH_INVITATION_BEGIN,
    });

    const { uid, token } = args

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.get(
        `${config.apiRootUrl}/accept-coach-invitation/`,
        {
          params: { uid, token },
          ...createAxiosConfigWithAuth(getState()),
        }
      );
      doRequest.then(
        (res) => {
          dispatch({
            type: HOME_FETCH_COACH_INVITATION_SUCCESS,
            data: res.data,
          });
          resolve(res.data);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: HOME_FETCH_COACH_INVITATION_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissFetchCoachInvitationError() {
  return {
    type: HOME_FETCH_COACH_INVITATION_DISMISS_ERROR,
  };
}

export function useFetchCoachInvitation() {
  const dispatch = useDispatch();

  const { coachInvitation, fetchCoachInvitationPending, fetchCoachInvitationError } = useSelector(
    state => ({
      coachInvitation: state.home.coachInvitation,
      fetchCoachInvitationPending: state.home.fetchCoachInvitationPending,
      fetchCoachInvitationError: state.home.fetchCoachInvitationError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(fetchCoachInvitation(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissFetchCoachInvitationError());
  }, [dispatch]);

  return {
    coachInvitation,
    fetchCoachInvitation: boundAction,
    fetchCoachInvitationPending,
    fetchCoachInvitationError,
    dismissFetchCoachInvitationError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_FETCH_COACH_INVITATION_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        fetchCoachInvitationPending: true,
        fetchCoachInvitationError: null,
      };

    case HOME_FETCH_COACH_INVITATION_SUCCESS:
      // The request is success
      return {
        ...state,
        coachInvitation: action.data,
        fetchCoachInvitationPending: false,
        fetchCoachInvitationError: null,
      };

    case HOME_FETCH_COACH_INVITATION_FAILURE:
      // The request is failed
      return {
        ...state,
        fetchCoachInvitationPending: false,
        fetchCoachInvitationError: action.data.error,
      };

    case HOME_FETCH_COACH_INVITATION_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        fetchCoachInvitationError: null,
      };

    default:
      return state;
  }
}
