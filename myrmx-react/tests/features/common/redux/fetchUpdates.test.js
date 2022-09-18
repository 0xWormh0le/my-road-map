import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  COMMON_FETCH_UPDATES_BEGIN,
  COMMON_FETCH_UPDATES_SUCCESS,
  COMMON_FETCH_UPDATES_FAILURE,
  COMMON_FETCH_UPDATES_DISMISS_ERROR,
} from '../../../../src/features/common/redux/constants';

import {
  fetchUpdates,
  dismissFetchUpdatesError,
  reducer,
} from '../../../../src/features/common/redux/fetchUpdates';

import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('common/redux/fetchUpdates', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when fetchUpdates succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .get('/updates/')
      .reply(200, {});

    return store.dispatch(fetchUpdates())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', COMMON_FETCH_UPDATES_BEGIN);
        expect(actions[1]).toHaveProperty('type', COMMON_FETCH_UPDATES_SUCCESS);
      });
  });

  it('dispatches failure action when fetchUpdates fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .get('/updates/')
      .reply(500, {});

    return store.dispatch(fetchUpdates({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', COMMON_FETCH_UPDATES_BEGIN);
        expect(actions[1]).toHaveProperty('type', COMMON_FETCH_UPDATES_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissFetchUpdatesError', () => {
    const expectedAction = {
      type: COMMON_FETCH_UPDATES_DISMISS_ERROR,
    };
    expect(dismissFetchUpdatesError()).toEqual(expectedAction);
  });

  it('handles action type COMMON_FETCH_UPDATES_BEGIN correctly', () => {
    const prevState = { fetchUpdatesPending: false };
    const state = reducer(
      prevState,
      { type: COMMON_FETCH_UPDATES_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchUpdatesPending).toBe(true);
  });

  it('handles action type COMMON_FETCH_UPDATES_SUCCESS correctly', () => {
    const prevState = { fetchUpdatesPending: true };
    const state = reducer(
      prevState,
      { type: COMMON_FETCH_UPDATES_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchUpdatesPending).toBe(false);
  });

  it('handles action type COMMON_FETCH_UPDATES_FAILURE correctly', () => {
    const prevState = { fetchUpdatesPending: true };
    const state = reducer(
      prevState,
      { type: COMMON_FETCH_UPDATES_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchUpdatesPending).toBe(false);
    expect(state.fetchUpdatesError).toEqual(expect.anything());
  });

  it('handles action type COMMON_FETCH_UPDATES_DISMISS_ERROR correctly', () => {
    const prevState = { fetchUpdatesError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: COMMON_FETCH_UPDATES_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchUpdatesError).toBe(null);
  });
});

