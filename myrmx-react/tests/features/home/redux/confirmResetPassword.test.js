import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  HOME_CONFIRM_RESET_PASSWORD_BEGIN,
  HOME_CONFIRM_RESET_PASSWORD_SUCCESS,
  HOME_CONFIRM_RESET_PASSWORD_FAILURE,
  HOME_CONFIRM_RESET_PASSWORD_DISMISS_ERROR,
} from '../../../../src/features/home/redux/constants';

import {
  confirmResetPassword,
  dismissConfirmResetPasswordError,
  reducer,
} from '../../../../src/features/home/redux/confirmResetPassword';

import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/confirmResetPassword', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when confirmResetPassword succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/auth/password-reset/confirm/')
      .reply(200, { results: [] });

    return store.dispatch(confirmResetPassword())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_CONFIRM_RESET_PASSWORD_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_CONFIRM_RESET_PASSWORD_SUCCESS);
      });
  });

  it('dispatches failure action when confirmResetPassword fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/auth/password-reset/confirm/')
      .reply(500, {});

    return store.dispatch(confirmResetPassword({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_CONFIRM_RESET_PASSWORD_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_CONFIRM_RESET_PASSWORD_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissConfirmResetPasswordError', () => {
    const expectedAction = {
      type: HOME_CONFIRM_RESET_PASSWORD_DISMISS_ERROR,
    };
    expect(dismissConfirmResetPasswordError()).toEqual(expectedAction);
  });

  it('handles action type HOME_CONFIRM_RESET_PASSWORD_BEGIN correctly', () => {
    const prevState = { confirmResetPasswordPending: false };
    const state = reducer(
      prevState,
      { type: HOME_CONFIRM_RESET_PASSWORD_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.confirmResetPasswordPending).toBe(true);
  });

  it('handles action type HOME_CONFIRM_RESET_PASSWORD_SUCCESS correctly', () => {
    const prevState = { confirmResetPasswordPending: true };
    const state = reducer(
      prevState,
      { type: HOME_CONFIRM_RESET_PASSWORD_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.confirmResetPasswordPending).toBe(false);
  });

  it('handles action type HOME_CONFIRM_RESET_PASSWORD_FAILURE correctly', () => {
    const prevState = { confirmResetPasswordPending: true };
    const state = reducer(
      prevState,
      { type: HOME_CONFIRM_RESET_PASSWORD_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.confirmResetPasswordPending).toBe(false);
    expect(state.confirmResetPasswordError).toEqual(expect.anything());
  });

  it('handles action type HOME_CONFIRM_RESET_PASSWORD_DISMISS_ERROR correctly', () => {
    const prevState = { confirmResetPasswordError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_CONFIRM_RESET_PASSWORD_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.confirmResetPasswordError).toBe(null);
  });
});

