import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MANAGE_SEND_WELCOME_EMAIL_BEGIN,
  MANAGE_SEND_WELCOME_EMAIL_SUCCESS,
  MANAGE_SEND_WELCOME_EMAIL_FAILURE,
  MANAGE_SEND_WELCOME_EMAIL_DISMISS_ERROR,
} from '../../../../src/features/manage/redux/constants';

import {
  sendWelcomeEmail,
  dismissSendWelcomeEmailError,
  reducer,
} from '../../../../src/features/manage/redux/sendWelcomeEmail';
import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('manage/redux/sendWelcomeEmail', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when sendWelcomeEmail succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/users/1/resend-welcome-email/')
      .reply(200);

    return store.dispatch(sendWelcomeEmail({ userId: 1 }))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_SEND_WELCOME_EMAIL_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_SEND_WELCOME_EMAIL_SUCCESS);
      });
  });

  it('dispatches failure action when sendWelcomeEmail fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/users/1/resend-welcome-email/')
      .reply(500, {});

    return store.dispatch(sendWelcomeEmail({ userId: 1 }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_SEND_WELCOME_EMAIL_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_SEND_WELCOME_EMAIL_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissSendWelcomeEmailError', () => {
    const expectedAction = {
      type: MANAGE_SEND_WELCOME_EMAIL_DISMISS_ERROR,
    };
    expect(dismissSendWelcomeEmailError()).toEqual(expectedAction);
  });

  it('handles action type MANAGE_SEND_WELCOME_EMAIL_BEGIN correctly', () => {
    const prevState = { sendWelcomeEmailPending: false };
    const state = reducer(
      prevState,
      { type: MANAGE_SEND_WELCOME_EMAIL_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.sendWelcomeEmailPending).toBe(true);
  });

  it('handles action type MANAGE_SEND_WELCOME_EMAIL_SUCCESS correctly', () => {
    const prevState = { sendWelcomeEmailPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_SEND_WELCOME_EMAIL_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.sendWelcomeEmailPending).toBe(false);
  });

  it('handles action type MANAGE_SEND_WELCOME_EMAIL_FAILURE correctly', () => {
    const prevState = { sendWelcomeEmailPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_SEND_WELCOME_EMAIL_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.sendWelcomeEmailPending).toBe(false);
    expect(state.sendWelcomeEmailError).toEqual(expect.anything());
  });

  it('handles action type MANAGE_SEND_WELCOME_EMAIL_DISMISS_ERROR correctly', () => {
    const prevState = { sendWelcomeEmailError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MANAGE_SEND_WELCOME_EMAIL_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.sendWelcomeEmailError).toBe(null);
  });
});

