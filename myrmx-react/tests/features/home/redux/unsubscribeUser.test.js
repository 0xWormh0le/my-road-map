import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  HOME_UNSUBSCRIBE_USER_BEGIN,
  HOME_UNSUBSCRIBE_USER_SUCCESS,
  HOME_UNSUBSCRIBE_USER_FAILURE,
  HOME_UNSUBSCRIBE_USER_DISMISS_ERROR,
} from '../../../../src/features/home/redux/constants';

import {
  unsubscribeUser,
  dismissUnsubscribeUserError,
  reducer,
} from '../../../../src/features/home/redux/unsubscribeUser';

import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/unsubscribeUser', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when unsubscribeUser succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/unsubscribe/')
      .reply(200);

    return store.dispatch(unsubscribeUser())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_UNSUBSCRIBE_USER_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_UNSUBSCRIBE_USER_SUCCESS);
      });
  });

  it('dispatches failure action when unsubscribeUser fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/unsubscribe/')
      .reply(500, {});

    return store.dispatch(unsubscribeUser({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_UNSUBSCRIBE_USER_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_UNSUBSCRIBE_USER_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissUnsubscribeUserError', () => {
    const expectedAction = {
      type: HOME_UNSUBSCRIBE_USER_DISMISS_ERROR,
    };
    expect(dismissUnsubscribeUserError()).toEqual(expectedAction);
  });

  it('handles action type HOME_UNSUBSCRIBE_USER_BEGIN correctly', () => {
    const prevState = { unsubscribeUserPending: false };
    const state = reducer(
      prevState,
      { type: HOME_UNSUBSCRIBE_USER_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.unsubscribeUserPending).toBe(true);
  });

  it('handles action type HOME_UNSUBSCRIBE_USER_SUCCESS correctly', () => {
    const prevState = { unsubscribeUserPending: true };
    const state = reducer(
      prevState,
      { type: HOME_UNSUBSCRIBE_USER_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.unsubscribeUserPending).toBe(false);
  });

  it('handles action type HOME_UNSUBSCRIBE_USER_FAILURE correctly', () => {
    const prevState = { unsubscribeUserPending: true };
    const state = reducer(
      prevState,
      { type: HOME_UNSUBSCRIBE_USER_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.unsubscribeUserPending).toBe(false);
    expect(state.unsubscribeUserError).toEqual(expect.anything());
  });

  it('handles action type HOME_UNSUBSCRIBE_USER_DISMISS_ERROR correctly', () => {
    const prevState = { unsubscribeUserError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_UNSUBSCRIBE_USER_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.unsubscribeUserError).toBe(null);
  });
});

