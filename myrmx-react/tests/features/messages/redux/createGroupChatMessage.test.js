import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MESSAGES_CREATE_GROUP_CHAT_MESSAGE_BEGIN,
  MESSAGES_CREATE_GROUP_CHAT_MESSAGE_SUCCESS,
  MESSAGES_CREATE_GROUP_CHAT_MESSAGE_FAILURE,
  MESSAGES_CREATE_GROUP_CHAT_MESSAGE_DISMISS_ERROR,
} from '../../../../src/features/messages/redux/constants';

import {
  createGroupChatMessage,
  dismissCreateGroupChatMessageError,
  reducer,
} from '../../../../src/features/messages/redux/createGroupChatMessage';
import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('messages/redux/createGroupChatMessage', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when createGroupChatMessage succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/messages/groups/1/messages/')
      .reply(201, {});

    return store.dispatch(createGroupChatMessage({ chatId: 1 }))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MESSAGES_CREATE_GROUP_CHAT_MESSAGE_BEGIN);
        expect(actions[1]).toHaveProperty('type', MESSAGES_CREATE_GROUP_CHAT_MESSAGE_SUCCESS);
      });
  });

  it('dispatches failure action when createGroupChatMessage fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/messages/groups/1/messages/')
      .reply(500);

    return store.dispatch(createGroupChatMessage({ chatId: 1 }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MESSAGES_CREATE_GROUP_CHAT_MESSAGE_BEGIN);
        expect(actions[1]).toHaveProperty('type', MESSAGES_CREATE_GROUP_CHAT_MESSAGE_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissCreateGroupChatMessageError', () => {
    const expectedAction = {
      type: MESSAGES_CREATE_GROUP_CHAT_MESSAGE_DISMISS_ERROR,
    };
    expect(dismissCreateGroupChatMessageError()).toEqual(expectedAction);
  });

  it('handles action type MESSAGES_CREATE_GROUP_CHAT_MESSAGE_BEGIN correctly', () => {
    const prevState = { createGroupChatMessagePending: false };
    const state = reducer(
      prevState,
      { type: MESSAGES_CREATE_GROUP_CHAT_MESSAGE_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.createGroupChatMessagePending).toBe(true);
  });

  it('handles action type MESSAGES_CREATE_GROUP_CHAT_MESSAGE_SUCCESS correctly', () => {
    const prevState = { createGroupChatMessagePending: true };
    const state = reducer(
      prevState,
      { type: MESSAGES_CREATE_GROUP_CHAT_MESSAGE_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.createGroupChatMessagePending).toBe(false);
  });

  it('handles action type MESSAGES_CREATE_GROUP_CHAT_MESSAGE_FAILURE correctly', () => {
    const prevState = { createGroupChatMessagePending: true };
    const state = reducer(
      prevState,
      { type: MESSAGES_CREATE_GROUP_CHAT_MESSAGE_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.createGroupChatMessagePending).toBe(false);
    expect(state.createGroupChatMessageError).toEqual(expect.anything());
  });

  it('handles action type MESSAGES_CREATE_GROUP_CHAT_MESSAGE_DISMISS_ERROR correctly', () => {
    const prevState = { createGroupChatMessageError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MESSAGES_CREATE_GROUP_CHAT_MESSAGE_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.createGroupChatMessageError).toBe(null);
  });
});

