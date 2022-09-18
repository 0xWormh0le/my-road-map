import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  HOME_REGISTER_ACCOUNT_BEGIN,
  HOME_REGISTER_ACCOUNT_SUCCESS,
  HOME_REGISTER_ACCOUNT_FAILURE,
  HOME_REGISTER_ACCOUNT_DISMISS_ERROR,
} from '../../../../src/features/home/redux/constants';

import {
  registerAccount,
  dismissRegisterAccountError,
  reducer,
} from '../../../../src/features/home/redux/registerAccount';

import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/registerAccount', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when registerAccount succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/auth/sign-up/')
      .reply(200, {});

    return store.dispatch(registerAccount())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_REGISTER_ACCOUNT_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_REGISTER_ACCOUNT_SUCCESS);
      });
  });

  it('dispatches failure action when registerAccount fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/auth/sign-up/')
      .reply(500, {});

    return store.dispatch(registerAccount({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_REGISTER_ACCOUNT_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_REGISTER_ACCOUNT_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissRegisterAccountError', () => {
    const expectedAction = {
      type: HOME_REGISTER_ACCOUNT_DISMISS_ERROR,
    };
    expect(dismissRegisterAccountError()).toEqual(expectedAction);
  });

  it('handles action type HOME_REGISTER_ACCOUNT_BEGIN correctly', () => {
    const prevState = { registerAccountPending: false };
    const state = reducer(
      prevState,
      { type: HOME_REGISTER_ACCOUNT_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.registerAccountPending).toBe(true);
  });

  it('handles action type HOME_REGISTER_ACCOUNT_SUCCESS correctly', () => {
    const prevState = { registerAccountPending: true };
    const state = reducer(
      prevState,
      { type: HOME_REGISTER_ACCOUNT_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.registerAccountPending).toBe(false);
  });

  it('handles action type HOME_REGISTER_ACCOUNT_FAILURE correctly', () => {
    const prevState = { registerAccountPending: true };
    const state = reducer(
      prevState,
      { type: HOME_REGISTER_ACCOUNT_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.registerAccountPending).toBe(false);
    expect(state.registerAccountError).toEqual(expect.anything());
  });

  it('handles action type HOME_REGISTER_ACCOUNT_DISMISS_ERROR correctly', () => {
    const prevState = { registerAccountError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_REGISTER_ACCOUNT_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.registerAccountError).toBe(null);
  });
});

