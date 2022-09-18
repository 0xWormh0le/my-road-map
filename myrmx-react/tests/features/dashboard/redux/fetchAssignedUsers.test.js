import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  DASHBOARD_FETCH_ASSIGNED_USERS_BEGIN,
  DASHBOARD_FETCH_ASSIGNED_USERS_SUCCESS,
  DASHBOARD_FETCH_ASSIGNED_USERS_FAILURE,
  DASHBOARD_FETCH_ASSIGNED_USERS_DISMISS_ERROR,
} from '../../../../src/features/dashboard/redux/constants';

import {
  fetchAssignedUsers,
  dismissFetchAssignedUsersError,
  reducer,
} from '../../../../src/features/dashboard/redux/fetchAssignedUsers';

import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('dashboard/redux/fetchAssignedUsers', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when fetchAssignedUsers succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .get('/users/?forRole=coach')
      .reply(200);

    return store.dispatch(fetchAssignedUsers({ role: 'coach' }))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', DASHBOARD_FETCH_ASSIGNED_USERS_BEGIN);
        expect(actions[1]).toHaveProperty('type', DASHBOARD_FETCH_ASSIGNED_USERS_SUCCESS);
      });
  });

  it('dispatches failure action when fetchAssignedUsers fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .get('/users/?forRole=coach')
      .reply(500, {});

    return store.dispatch(fetchAssignedUsers({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', DASHBOARD_FETCH_ASSIGNED_USERS_BEGIN);
        expect(actions[1]).toHaveProperty('type', DASHBOARD_FETCH_ASSIGNED_USERS_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissFetchAssignedUsersError', () => {
    const expectedAction = {
      type: DASHBOARD_FETCH_ASSIGNED_USERS_DISMISS_ERROR,
    };
    expect(dismissFetchAssignedUsersError()).toEqual(expectedAction);
  });

  it('handles action type DASHBOARD_FETCH_ASSIGNED_USERS_BEGIN correctly', () => {
    const prevState = { fetchAssignedUsersPending: false };
    const state = reducer(
      prevState,
      { type: DASHBOARD_FETCH_ASSIGNED_USERS_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchAssignedUsersPending).toBe(true);
  });

  it('handles action type DASHBOARD_FETCH_ASSIGNED_USERS_SUCCESS correctly', () => {
    const prevState = { fetchAssignedUsersPending: true };
    const state = reducer(
      prevState,
      { type: DASHBOARD_FETCH_ASSIGNED_USERS_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchAssignedUsersPending).toBe(false);
  });

  it('handles action type DASHBOARD_FETCH_ASSIGNED_USERS_FAILURE correctly', () => {
    const prevState = { fetchAssignedUsersPending: true };
    const state = reducer(
      prevState,
      { type: DASHBOARD_FETCH_ASSIGNED_USERS_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchAssignedUsersPending).toBe(false);
    expect(state.fetchAssignedUsersError).toEqual(expect.anything());
  });

  it('handles action type DASHBOARD_FETCH_ASSIGNED_USERS_DISMISS_ERROR correctly', () => {
    const prevState = { fetchAssignedUsersError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: DASHBOARD_FETCH_ASSIGNED_USERS_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchAssignedUsersError).toBe(null);
  });
});

