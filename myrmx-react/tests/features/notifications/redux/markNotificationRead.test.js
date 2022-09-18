import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  NOTIFICATIONS_MARK_NOTIFICATION_READ_BEGIN,
  NOTIFICATIONS_MARK_NOTIFICATION_READ_SUCCESS,
  NOTIFICATIONS_MARK_NOTIFICATION_READ_FAILURE,
  NOTIFICATIONS_MARK_NOTIFICATION_READ_DISMISS_ERROR,
} from '../../../../src/features/notifications/redux/constants';

import {
  markNotificationRead,
  dismissMarkNotificationReadError,
  reducer,
} from '../../../../src/features/notifications/redux/markNotificationRead';

import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('notifications/redux/markNotificationRead', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when markNotificationRead succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .patch('/notifications/1/')
      .reply(200);

    return store.dispatch(markNotificationRead({ notificationId: 1 }))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', NOTIFICATIONS_MARK_NOTIFICATION_READ_BEGIN);
        expect(actions[1]).toHaveProperty('type', NOTIFICATIONS_MARK_NOTIFICATION_READ_SUCCESS);
      });
  });

  it('dispatches failure action when markNotificationRead fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .patch('/notifications/1/')
      .reply(500, {});

    return store.dispatch(markNotificationRead({ notificationId: 1, error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', NOTIFICATIONS_MARK_NOTIFICATION_READ_BEGIN);
        expect(actions[1]).toHaveProperty('type', NOTIFICATIONS_MARK_NOTIFICATION_READ_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissMarkNotificationReadError', () => {
    const expectedAction = {
      type: NOTIFICATIONS_MARK_NOTIFICATION_READ_DISMISS_ERROR,
    };
    expect(dismissMarkNotificationReadError()).toEqual(expectedAction);
  });

  it('handles action type NOTIFICATIONS_MARK_NOTIFICATION_READ_BEGIN correctly', () => {
    const prevState = { markNotificationReadPending: false };
    const state = reducer(
      prevState,
      { type: NOTIFICATIONS_MARK_NOTIFICATION_READ_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.markNotificationReadPending).toBe(true);
  });

  it('handles action type NOTIFICATIONS_MARK_NOTIFICATION_READ_SUCCESS correctly', () => {
    const prevState = { markNotificationReadPending: true };
    const state = reducer(
      prevState,
      { type: NOTIFICATIONS_MARK_NOTIFICATION_READ_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.markNotificationReadPending).toBe(false);
  });

  it('handles action type NOTIFICATIONS_MARK_NOTIFICATION_READ_FAILURE correctly', () => {
    const prevState = { markNotificationReadPending: true };
    const state = reducer(
      prevState,
      { type: NOTIFICATIONS_MARK_NOTIFICATION_READ_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.markNotificationReadPending).toBe(false);
    expect(state.markNotificationReadError).toEqual(expect.anything());
  });

  it('handles action type NOTIFICATIONS_MARK_NOTIFICATION_READ_DISMISS_ERROR correctly', () => {
    const prevState = { markNotificationReadError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: NOTIFICATIONS_MARK_NOTIFICATION_READ_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.markNotificationReadError).toBe(null);
  });
});

