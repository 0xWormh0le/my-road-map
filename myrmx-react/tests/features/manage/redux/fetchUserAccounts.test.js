import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MANAGE_FETCH_USER_ACCOUNTS_BEGIN,
  MANAGE_FETCH_USER_ACCOUNTS_SUCCESS,
  MANAGE_FETCH_USER_ACCOUNTS_FAILURE,
  MANAGE_FETCH_USER_ACCOUNTS_DISMISS_ERROR,
} from '../../../../src/features/manage/redux/constants';

import {
  fetchUserAccounts,
  dismissFetchUserAccountsError,
  reducer,
} from '../../../../src/features/manage/redux/fetchUserAccounts';

import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('manage/redux/fetchUserAccounts', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when fetchUserAccounts succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .get('/users/')
      .reply(200);

    return store.dispatch(fetchUserAccounts())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_FETCH_USER_ACCOUNTS_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_FETCH_USER_ACCOUNTS_SUCCESS);
      });
  });

  it('dispatches failure action when fetchUserAccounts fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .get('/users/')
      .reply(500, {});
      
    return store.dispatch(fetchUserAccounts({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_FETCH_USER_ACCOUNTS_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_FETCH_USER_ACCOUNTS_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissFetchUserAccountsError', () => {
    const expectedAction = {
      type: MANAGE_FETCH_USER_ACCOUNTS_DISMISS_ERROR,
    };
    expect(dismissFetchUserAccountsError()).toEqual(expectedAction);
  });

  it('handles action type MANAGE_FETCH_USER_ACCOUNTS_BEGIN correctly', () => {
    const prevState = { fetchUserAccountsPending: false };
    const state = reducer(
      prevState,
      { type: MANAGE_FETCH_USER_ACCOUNTS_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchUserAccountsPending).toBe(true);
  });

  it('handles action type MANAGE_FETCH_USER_ACCOUNTS_SUCCESS correctly', () => {
    const prevState = { fetchUserAccountsPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_FETCH_USER_ACCOUNTS_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchUserAccountsPending).toBe(false);
  });

  it('handles action type MANAGE_FETCH_USER_ACCOUNTS_FAILURE correctly', () => {
    const prevState = { fetchUserAccountsPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_FETCH_USER_ACCOUNTS_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchUserAccountsPending).toBe(false);
    expect(state.fetchUserAccountsError).toEqual(expect.anything());
  });

  it('handles action type MANAGE_FETCH_USER_ACCOUNTS_DISMISS_ERROR correctly', () => {
    const prevState = { fetchUserAccountsError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MANAGE_FETCH_USER_ACCOUNTS_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchUserAccountsError).toBe(null);
  });
});

