import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  USER_SWITCH_ACTIVE_COMPANY_BEGIN,
  USER_SWITCH_ACTIVE_COMPANY_SUCCESS,
  USER_SWITCH_ACTIVE_COMPANY_FAILURE,
  USER_SWITCH_ACTIVE_COMPANY_DISMISS_ERROR,
} from './constants';
import { HOME_FETCH_AUTH_TOKEN_SUCCESS } from '../../home/redux/constants';

import fp from 'lodash/fp';
import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';
import { cleanupConversations, cleanupGroupChats } from '../../messages/redux/actions';

export function switchActiveCompany(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: USER_SWITCH_ACTIVE_COMPANY_BEGIN,
    });

    const { companyId } = args;

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.post(
        `${config.apiRootUrl}/choose-active-company/`,
        { company_id : companyId },
        createAxiosConfigWithAuth(getState()),
      );
      doRequest.then(
        (res) => {
          dispatch({
            type: USER_SWITCH_ACTIVE_COMPANY_SUCCESS,
            data: companyId
          });
          dispatch(cleanupConversations());
          dispatch(cleanupGroupChats());
          dispatch({
            type: HOME_FETCH_AUTH_TOKEN_SUCCESS,
            data: {
              token: res.data.key,
              userApproved: res.data.user_is_approved
            },
          })
          resolve(res.data);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: USER_SWITCH_ACTIVE_COMPANY_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissSwitchActiveCompanyError() {
  return {
    type: USER_SWITCH_ACTIVE_COMPANY_DISMISS_ERROR,
  };
}

export function useSwitchActiveCompany() {
  const dispatch = useDispatch();

  const { switchActiveCompanyPending, switchActiveCompanyError } = useSelector(
    state => ({
      switchActiveCompanyPending: state.user.switchActiveCompanyPending,
      switchActiveCompanyError: state.user.switchActiveCompanyError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(switchActiveCompany(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissSwitchActiveCompanyError());
  }, [dispatch]);

  return {
    switchActiveCompany: boundAction,
    switchActiveCompanyPending,
    switchActiveCompanyError,
    dismissSwitchActiveCompanyError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case USER_SWITCH_ACTIVE_COMPANY_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        switchActiveCompanyPending: true,
        switchActiveCompanyError: null,
      };

    case USER_SWITCH_ACTIVE_COMPANY_SUCCESS:
      // The request is success
      const company = state.user.all_companies.filter(c => c.id === action.data);
      if (company.length) {
        return fp.compose(
          fp.set('switchActiveCompanyPending', false),
          fp.set('switchActiveCompanyError', null),
          fp.set('user.company_name', company[0].name),
          fp.set('user.company_id', company[0].id)
        )(state);
      } else {
        return state;
      }

    case USER_SWITCH_ACTIVE_COMPANY_FAILURE:
      // The request is failed
      return {
        ...state,
        switchActiveCompanyPending: false,
        switchActiveCompanyError: action.data.error,
      };

    case USER_SWITCH_ACTIVE_COMPANY_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        switchActiveCompanyError: null,
      };

    default:
      return state;
  }
}
