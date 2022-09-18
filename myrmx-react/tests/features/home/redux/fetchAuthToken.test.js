import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  HOME_FETCH_AUTH_TOKEN_BEGIN,
  HOME_FETCH_AUTH_TOKEN_SUCCESS,
  HOME_FETCH_AUTH_TOKEN_FAILURE,
  HOME_FETCH_AUTH_TOKEN_DISMISS_ERROR,
} from '../../../../src/features/home/redux/constants';

import {
  fetchAuthToken,
  dismissFetchAuthTokenError,
  reducer,
} from '../../../../src/features/home/redux/fetchAuthToken';

import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/fetchAuthToken', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when fetchAuthToken succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/auth/login/')
      .reply(200, {});

    return store.dispatch(fetchAuthToken())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_FETCH_AUTH_TOKEN_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_FETCH_AUTH_TOKEN_SUCCESS);
      });
  });

  it('dispatches failure action when fetchAuthToken fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/auth/login/')
      .reply(500, {});

    return store.dispatch(fetchAuthToken({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_FETCH_AUTH_TOKEN_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_FETCH_AUTH_TOKEN_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissFetchAuthTokenError', () => {
    const expectedAction = {
      type: HOME_FETCH_AUTH_TOKEN_DISMISS_ERROR,
    };
    expect(dismissFetchAuthTokenError()).toEqual(expectedAction);
  });

  it('handles action type HOME_FETCH_AUTH_TOKEN_BEGIN correctly', () => {
    const prevState = { fetchAuthTokenPending: false };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_AUTH_TOKEN_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchAuthTokenPending).toBe(true);
  });

  it('handles action type HOME_FETCH_AUTH_TOKEN_SUCCESS correctly', () => {
    const prevState = { fetchAuthTokenPending: true };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_AUTH_TOKEN_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchAuthTokenPending).toBe(false);
  });

  it('handles action type HOME_FETCH_AUTH_TOKEN_FAILURE correctly', () => {
    const prevState = { fetchAuthTokenPending: true };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_AUTH_TOKEN_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchAuthTokenPending).toBe(false);
    expect(state.fetchAuthTokenError).toEqual(expect.anything());
  });

  it('handles action type HOME_FETCH_AUTH_TOKEN_DISMISS_ERROR correctly', () => {
    const prevState = { fetchAuthTokenError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_AUTH_TOKEN_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchAuthTokenError).toBe(null);
  });
});

