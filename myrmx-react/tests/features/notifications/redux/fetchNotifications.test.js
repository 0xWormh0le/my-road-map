import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  NOTIFICATIONS_FETCH_NOTIFICATIONS_BEGIN,
  NOTIFICATIONS_FETCH_NOTIFICATIONS_SUCCESS,
  NOTIFICATIONS_FETCH_NOTIFICATIONS_FAILURE,
  NOTIFICATIONS_FETCH_NOTIFICATIONS_DISMISS_ERROR,
} from '../../../../src/features/notifications/redux/constants';

import {
  fetchNotifications,
  dismissFetchNotificationsError,
  reducer,
} from '../../../../src/features/notifications/redux/fetchNotifications';

import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('notifications/redux/fetchNotifications', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when fetchNotifications succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .get('/notifications/')
      .reply(200, {});

    return store.dispatch(fetchNotifications())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', NOTIFICATIONS_FETCH_NOTIFICATIONS_BEGIN);
        expect(actions[1]).toHaveProperty('type', NOTIFICATIONS_FETCH_NOTIFICATIONS_SUCCESS);
      });
  });

  it('dispatches failure action when fetchNotifications fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .get('/notifications/')
      .reply(500, {});

    return store.dispatch(fetchNotifications({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', NOTIFICATIONS_FETCH_NOTIFICATIONS_BEGIN);
        expect(actions[1]).toHaveProperty('type', NOTIFICATIONS_FETCH_NOTIFICATIONS_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissFetchNotificationsError', () => {
    const expectedAction = {
      type: NOTIFICATIONS_FETCH_NOTIFICATIONS_DISMISS_ERROR,
    };
    expect(dismissFetchNotificationsError()).toEqual(expectedAction);
  });

  it('handles action type NOTIFICATIONS_FETCH_NOTIFICATIONS_BEGIN correctly', () => {
    const prevState = { fetchNotificationsPending: false };
    const state = reducer(
      prevState,
      { type: NOTIFICATIONS_FETCH_NOTIFICATIONS_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchNotificationsPending).toBe(true);
  });

  it('handles action type NOTIFICATIONS_FETCH_NOTIFICATIONS_SUCCESS correctly', () => {
    const prevState = { fetchNotificationsPending: true };
    const state = reducer(
      prevState,
      { type: NOTIFICATIONS_FETCH_NOTIFICATIONS_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchNotificationsPending).toBe(false);
  });

  it('handles action type NOTIFICATIONS_FETCH_NOTIFICATIONS_FAILURE correctly', () => {
    const prevState = { fetchNotificationsPending: true };
    const state = reducer(
      prevState,
      { type: NOTIFICATIONS_FETCH_NOTIFICATIONS_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchNotificationsPending).toBe(false);
    expect(state.fetchNotificationsError).toEqual(expect.anything());
  });

  it('handles action type NOTIFICATIONS_FETCH_NOTIFICATIONS_DISMISS_ERROR correctly', () => {
    const prevState = { fetchNotificationsError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: NOTIFICATIONS_FETCH_NOTIFICATIONS_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchNotificationsError).toBe(null);
  });
});

