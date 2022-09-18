import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  USER_FETCH_USER_BEGIN,
  USER_FETCH_USER_SUCCESS,
  USER_FETCH_USER_FAILURE,
  USER_FETCH_USER_DISMISS_ERROR,
} from '../../../../src/features/user/redux/constants';

import {
  fetchUser,
  dismissFetchUserError,
  reducer,
} from '../../../../src/features/user/redux/fetchUser';

import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('user/redux/fetchUser', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when fetchUser succeeds', () => {
    const store = mockStore({ home: {} });

    nock(config.apiRootUrl)
      .get('/profile/')
      .reply(200, {});

    return store.dispatch(fetchUser())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', USER_FETCH_USER_BEGIN);
        expect(actions[1]).toHaveProperty('type', USER_FETCH_USER_SUCCESS);
      });
  });

  it('dispatches failure action when fetchUser fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .get('/profile/')
      .reply(500, {});

    return store.dispatch(fetchUser({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', USER_FETCH_USER_BEGIN);
        expect(actions[1]).toHaveProperty('type', USER_FETCH_USER_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissFetchUserError', () => {
    const expectedAction = {
      type: USER_FETCH_USER_DISMISS_ERROR,
    };
    expect(dismissFetchUserError()).toEqual(expectedAction);
  });

  it('handles action type USER_FETCH_USER_BEGIN correctly', () => {
    const prevState = { fetchUserPending: false };
    const state = reducer(
      prevState,
      { type: USER_FETCH_USER_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchUserPending).toBe(true);
  });

  it('handles action type USER_FETCH_USER_SUCCESS correctly', () => {
    const prevState = { fetchUserPending: true };
    const state = reducer(
      prevState,
      { type: USER_FETCH_USER_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchUserPending).toBe(false);
  });

  it('handles action type USER_FETCH_USER_FAILURE correctly', () => {
    const prevState = { fetchUserPending: true };
    const state = reducer(
      prevState,
      { type: USER_FETCH_USER_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchUserPending).toBe(false);
    expect(state.fetchUserError).toEqual(expect.anything());
  });

  it('handles action type USER_FETCH_USER_DISMISS_ERROR correctly', () => {
    const prevState = { fetchUserError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: USER_FETCH_USER_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchUserError).toBe(null);
  });
});

