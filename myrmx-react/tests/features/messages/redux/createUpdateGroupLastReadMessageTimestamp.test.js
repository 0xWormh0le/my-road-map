import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MESSAGES_CREATE_UPDATE_GROUP_LAST_READ_MESSAGE_TIMESTAMP_BEGIN,
  MESSAGES_CREATE_UPDATE_GROUP_LAST_READ_MESSAGE_TIMESTAMP_SUCCESS,
  MESSAGES_CREATE_UPDATE_GROUP_LAST_READ_MESSAGE_TIMESTAMP_FAILURE,
  MESSAGES_CREATE_UPDATE_GROUP_LAST_READ_MESSAGE_TIMESTAMP_DISMISS_ERROR,
} from '../../../../src/features/messages/redux/constants';

import {
  createUpdateGroupLastReadMessageTimestamp,
  dismissCreateUpdateGroupLastReadMessageTimestampError,
  reducer,
} from '../../../../src/features/messages/redux/createUpdateGroupLastReadMessageTimestamp';
import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('messages/redux/createUpdateGroupLastReadMessageTimestamp', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when createUpdateGroupLastReadMessageTimestamp succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/messages/group-last-read-message-timestamps/')
      .reply(200);

    return store.dispatch(createUpdateGroupLastReadMessageTimestamp())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MESSAGES_CREATE_UPDATE_GROUP_LAST_READ_MESSAGE_TIMESTAMP_BEGIN);
        expect(actions[1]).toHaveProperty('type', MESSAGES_CREATE_UPDATE_GROUP_LAST_READ_MESSAGE_TIMESTAMP_SUCCESS);
      });
  });

  it('dispatches failure action when createUpdateGroupLastReadMessageTimestamp fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/messages/group-last-read-message-timestamps/')
      .reply(500);

    return store.dispatch(createUpdateGroupLastReadMessageTimestamp())
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MESSAGES_CREATE_UPDATE_GROUP_LAST_READ_MESSAGE_TIMESTAMP_BEGIN);
        expect(actions[1]).toHaveProperty('type', MESSAGES_CREATE_UPDATE_GROUP_LAST_READ_MESSAGE_TIMESTAMP_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissCreateUpdateGroupLastReadMessageTimestampError', () => {
    const expectedAction = {
      type: MESSAGES_CREATE_UPDATE_GROUP_LAST_READ_MESSAGE_TIMESTAMP_DISMISS_ERROR,
    };
    expect(dismissCreateUpdateGroupLastReadMessageTimestampError()).toEqual(expectedAction);
  });

  it('handles action type MESSAGES_CREATE_UPDATE_GROUP_LAST_READ_MESSAGE_TIMESTAMP_BEGIN correctly', () => {
    const prevState = { createUpdateGroupLastReadMessageTimestampPending: false };
    const state = reducer(
      prevState,
      { type: MESSAGES_CREATE_UPDATE_GROUP_LAST_READ_MESSAGE_TIMESTAMP_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.createUpdateGroupLastReadMessageTimestampPending).toBe(true);
  });

  it('handles action type MESSAGES_CREATE_UPDATE_GROUP_LAST_READ_MESSAGE_TIMESTAMP_SUCCESS correctly', () => {
    const prevState = { createUpdateGroupLastReadMessageTimestampPending: true };
    const state = reducer(
      prevState,
      { type: MESSAGES_CREATE_UPDATE_GROUP_LAST_READ_MESSAGE_TIMESTAMP_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.createUpdateGroupLastReadMessageTimestampPending).toBe(false);
  });

  it('handles action type MESSAGES_CREATE_UPDATE_GROUP_LAST_READ_MESSAGE_TIMESTAMP_FAILURE correctly', () => {
    const prevState = { createUpdateGroupLastReadMessageTimestampPending: true };
    const state = reducer(
      prevState,
      { type: MESSAGES_CREATE_UPDATE_GROUP_LAST_READ_MESSAGE_TIMESTAMP_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.createUpdateGroupLastReadMessageTimestampPending).toBe(false);
    expect(state.createUpdateGroupLastReadMessageTimestampError).toEqual(expect.anything());
  });

  it('handles action type MESSAGES_CREATE_UPDATE_GROUP_LAST_READ_MESSAGE_TIMESTAMP_DISMISS_ERROR correctly', () => {
    const prevState = { createUpdateGroupLastReadMessageTimestampError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MESSAGES_CREATE_UPDATE_GROUP_LAST_READ_MESSAGE_TIMESTAMP_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.createUpdateGroupLastReadMessageTimestampError).toBe(null);
  });
});

