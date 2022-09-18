import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  USER_INVITE_COACH_BEGIN,
  USER_INVITE_COACH_SUCCESS,
  USER_INVITE_COACH_FAILURE,
  USER_INVITE_COACH_DISMISS_ERROR,
} from './constants';

import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function inviteCoach(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: USER_INVITE_COACH_BEGIN,
    });

    const { coach_email } = args

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.post(
        `${config.apiRootUrl}/invite-coach/`,
        { coach_email },
        createAxiosConfigWithAuth(getState())
      );
      doRequest.then(
        (res) => {
          dispatch({
            type: USER_INVITE_COACH_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: USER_INVITE_COACH_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissInviteCoachError() {
  return {
    type: USER_INVITE_COACH_DISMISS_ERROR,
  };
}

export function useInviteCoach() {
  const dispatch = useDispatch();

  const { inviteCoachPending, inviteCoachError } = useSelector(
    state => ({
      inviteCoachPending: state.user.inviteCoachPending,
      inviteCoachError: state.user.inviteCoachError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(inviteCoach(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissInviteCoachError());
  }, [dispatch]);

  return {
    inviteCoach: boundAction,
    inviteCoachPending,
    inviteCoachError,
    dismissInviteCoachError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case USER_INVITE_COACH_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        inviteCoachPending: true,
        inviteCoachError: null,
      };

    case USER_INVITE_COACH_SUCCESS:
      // The request is success
      return {
        ...state,
        inviteCoachPending: false,
        inviteCoachError: null,
      };

    case USER_INVITE_COACH_FAILURE:
      // The request is failed
      return {
        ...state,
        inviteCoachPending: false,
        inviteCoachError: action.data.error,
      };

    case USER_INVITE_COACH_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        inviteCoachError: null,
      };

    default:
      return state;
  }
}
