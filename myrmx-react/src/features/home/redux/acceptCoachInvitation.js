import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  HOME_ACCEPT_COACH_INVITATION_BEGIN,
  HOME_ACCEPT_COACH_INVITATION_SUCCESS,
  HOME_ACCEPT_COACH_INVITATION_FAILURE,
  HOME_ACCEPT_COACH_INVITATION_DISMISS_ERROR,
} from './constants';
import config from '../../../common/config';
import axios from 'axios';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';


export function acceptCoachInvitation(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: HOME_ACCEPT_COACH_INVITATION_BEGIN,
    });

    const { uid, token } = args
    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.post(
        `${config.apiRootUrl}/accept-coach-invitation/?uid=${uid}&token=${token}`,
        null,
        createAxiosConfigWithAuth(getState()),
      );

      doRequest.then(
        (res) => {
          dispatch({
            type: HOME_ACCEPT_COACH_INVITATION_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: HOME_ACCEPT_COACH_INVITATION_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissAcceptCoachInvitationError() {
  return {
    type: HOME_ACCEPT_COACH_INVITATION_DISMISS_ERROR,
  };
}

export function useAcceptCoachInvitation() {
  const dispatch = useDispatch();

  const { acceptCoachInvitationPending, acceptCoachInvitationError } = useSelector(
    state => ({
      acceptCoachInvitationPending: state.home.acceptCoachInvitationPending,
      acceptCoachInvitationError: state.home.acceptCoachInvitationError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(acceptCoachInvitation(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissAcceptCoachInvitationError());
  }, [dispatch]);

  return {
    acceptCoachInvitation: boundAction,
    acceptCoachInvitationPending,
    acceptCoachInvitationError,
    dismissAcceptCoachInvitationError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_ACCEPT_COACH_INVITATION_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        acceptCoachInvitationPending: true,
        acceptCoachInvitationError: null,
      };

    case HOME_ACCEPT_COACH_INVITATION_SUCCESS:
      // The request is success
      return {
        ...state,
        acceptCoachInvitationPending: false,
        acceptCoachInvitationError: null,
      };

    case HOME_ACCEPT_COACH_INVITATION_FAILURE:
      // The request is failed
      return {
        ...state,
        acceptCoachInvitationPending: false,
        acceptCoachInvitationError: action.data.error,
      };

    case HOME_ACCEPT_COACH_INVITATION_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        acceptCoachInvitationError: null,
      };

    default:
      return state;
  }
}
