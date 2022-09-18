import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  NOTIFICATIONS_MARK_ALL_READ_BEGIN,
  NOTIFICATIONS_MARK_ALL_READ_SUCCESS,
  NOTIFICATIONS_MARK_ALL_READ_FAILURE,
  NOTIFICATIONS_MARK_ALL_READ_DISMISS_ERROR,
} from '../../../../src/features/notifications/redux/constants';

import {
  markAllRead,
  dismissMarkAllReadError,
  reducer,
} from '../../../../src/features/notifications/redux/markAllRead';

import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('notifications/redux/markAllRead', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when markAllRead succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/notifications/mark-all-read/')
      .reply(200);

    return store.dispatch(markAllRead())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', NOTIFICATIONS_MARK_ALL_READ_BEGIN);
        expect(actions[1]).toHaveProperty('type', NOTIFICATIONS_MARK_ALL_READ_SUCCESS);
      });
  });

  it('dispatches failure action when markAllRead fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/notifications/mark-all-read/')
      .reply(500, {});

    return store.dispatch(markAllRead({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', NOTIFICATIONS_MARK_ALL_READ_BEGIN);
        expect(actions[1]).toHaveProperty('type', NOTIFICATIONS_MARK_ALL_READ_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissMarkAllReadError', () => {
    const expectedAction = {
      type: NOTIFICATIONS_MARK_ALL_READ_DISMISS_ERROR,
    };
    expect(dismissMarkAllReadError()).toEqual(expectedAction);
  });

  it('handles action type NOTIFICATIONS_MARK_ALL_READ_BEGIN correctly', () => {
    const prevState = { markAllReadPending: false };
    const state = reducer(
      prevState,
      { type: NOTIFICATIONS_MARK_ALL_READ_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.markAllReadPending).toBe(true);
  });

  it('handles action type NOTIFICATIONS_MARK_ALL_READ_SUCCESS correctly', () => {
    const prevState = { markAllReadPending: true };
    const state = reducer(
      prevState,
      { type: NOTIFICATIONS_MARK_ALL_READ_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.markAllReadPending).toBe(false);
  });

  it('handles action type NOTIFICATIONS_MARK_ALL_READ_FAILURE correctly', () => {
    const prevState = { markAllReadPending: true };
    const state = reducer(
      prevState,
      { type: NOTIFICATIONS_MARK_ALL_READ_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.markAllReadPending).toBe(false);
    expect(state.markAllReadError).toEqual(expect.anything());
  });

  it('handles action type NOTIFICATIONS_MARK_ALL_READ_DISMISS_ERROR correctly', () => {
    const prevState = { markAllReadError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: NOTIFICATIONS_MARK_ALL_READ_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.markAllReadError).toBe(null);
  });
});

