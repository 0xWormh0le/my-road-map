import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  NOTIFICATIONS_MARK_COMMENTS_READ_BEGIN,
  NOTIFICATIONS_MARK_COMMENTS_READ_SUCCESS,
  NOTIFICATIONS_MARK_COMMENTS_READ_FAILURE,
  NOTIFICATIONS_MARK_COMMENTS_READ_DISMISS_ERROR,
} from '../../../../src/features/notifications/redux/constants';

import {
  markCommentsRead,
  dismissMarkCommentsReadError,
  reducer,
} from '../../../../src/features/notifications/redux/markCommentsRead';

import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('notifications/redux/markCommentsRead', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when markCommentsRead succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/notifications/mark-comments-read/')
      .reply(200);

    return store.dispatch(markCommentsRead())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', NOTIFICATIONS_MARK_COMMENTS_READ_BEGIN);
        expect(actions[1]).toHaveProperty('type', NOTIFICATIONS_MARK_COMMENTS_READ_SUCCESS);
      });
  });

  it('dispatches failure action when markCommentsRead fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/notifications/mark-comments-read/')
      .reply(500, {});

    return store.dispatch(markCommentsRead({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', NOTIFICATIONS_MARK_COMMENTS_READ_BEGIN);
        expect(actions[1]).toHaveProperty('type', NOTIFICATIONS_MARK_COMMENTS_READ_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissMarkCommentsReadError', () => {
    const expectedAction = {
      type: NOTIFICATIONS_MARK_COMMENTS_READ_DISMISS_ERROR,
    };
    expect(dismissMarkCommentsReadError()).toEqual(expectedAction);
  });

  it('handles action type NOTIFICATIONS_MARK_COMMENTS_READ_BEGIN correctly', () => {
    const prevState = { markCommentsReadPending: false };
    const state = reducer(
      prevState,
      { type: NOTIFICATIONS_MARK_COMMENTS_READ_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.markCommentsReadPending).toBe(true);
  });

  it('handles action type NOTIFICATIONS_MARK_COMMENTS_READ_SUCCESS correctly', () => {
    const prevState = { markCommentsReadPending: true };
    const state = reducer(
      prevState,
      { type: NOTIFICATIONS_MARK_COMMENTS_READ_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.markCommentsReadPending).toBe(false);
  });

  it('handles action type NOTIFICATIONS_MARK_COMMENTS_READ_FAILURE correctly', () => {
    const prevState = { markCommentsReadPending: true };
    const state = reducer(
      prevState,
      { type: NOTIFICATIONS_MARK_COMMENTS_READ_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.markCommentsReadPending).toBe(false);
    expect(state.markCommentsReadError).toEqual(expect.anything());
  });

  it('handles action type NOTIFICATIONS_MARK_COMMENTS_READ_DISMISS_ERROR correctly', () => {
    const prevState = { markCommentsReadError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: NOTIFICATIONS_MARK_COMMENTS_READ_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.markCommentsReadError).toBe(null);
  });
});

