import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MESSAGES_CREATE_GROUP_CHAT_BEGIN,
  MESSAGES_CREATE_GROUP_CHAT_SUCCESS,
  MESSAGES_CREATE_GROUP_CHAT_FAILURE,
  MESSAGES_CREATE_GROUP_CHAT_DISMISS_ERROR,
} from '../../../../src/features/messages/redux/constants';

import {
  createGroupChat,
  dismissCreateGroupChatError,
  reducer,
} from '../../../../src/features/messages/redux/createGroupChat';
import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('messages/redux/createGroupChat', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when createGroupChat succeeds', () => {
    const store = mockStore({ user: {} });

    nock(config.apiRootUrl)
      .post('/messages/groups/')
      .reply(201, {});

    return store.dispatch(createGroupChat({}))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MESSAGES_CREATE_GROUP_CHAT_BEGIN);
        expect(actions[1]).toHaveProperty('type', MESSAGES_CREATE_GROUP_CHAT_SUCCESS);
      });
  });

  it('dispatches failure action when createGroupChat fails', () => {
    const store = mockStore({ user: {} });

    nock(config.apiRootUrl)
      .post('/messages/groups/')
      .reply(500);

    return store.dispatch(createGroupChat({}))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MESSAGES_CREATE_GROUP_CHAT_BEGIN);
        expect(actions[1]).toHaveProperty('type', MESSAGES_CREATE_GROUP_CHAT_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissCreateGroupChatError', () => {
    const expectedAction = {
      type: MESSAGES_CREATE_GROUP_CHAT_DISMISS_ERROR,
    };
    expect(dismissCreateGroupChatError()).toEqual(expectedAction);
  });

  it('handles action type MESSAGES_CREATE_GROUP_CHAT_BEGIN correctly', () => {
    const prevState = { createGroupChatPending: false };
    const state = reducer(
      prevState,
      { type: MESSAGES_CREATE_GROUP_CHAT_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.createGroupChatPending).toBe(true);
  });

  it('handles action type MESSAGES_CREATE_GROUP_CHAT_SUCCESS correctly', () => {
    const prevState = { createGroupChatPending: true };
    const state = reducer(
      prevState,
      { type: MESSAGES_CREATE_GROUP_CHAT_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.createGroupChatPending).toBe(false);
  });

  it('handles action type MESSAGES_CREATE_GROUP_CHAT_FAILURE correctly', () => {
    const prevState = { createGroupChatPending: true };
    const state = reducer(
      prevState,
      { type: MESSAGES_CREATE_GROUP_CHAT_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.createGroupChatPending).toBe(false);
    expect(state.createGroupChatError).toEqual(expect.anything());
  });

  it('handles action type MESSAGES_CREATE_GROUP_CHAT_DISMISS_ERROR correctly', () => {
    const prevState = { createGroupChatError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MESSAGES_CREATE_GROUP_CHAT_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.createGroupChatError).toBe(null);
  });
});

