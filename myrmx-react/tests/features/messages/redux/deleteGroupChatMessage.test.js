import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MESSAGES_DELETE_GROUP_CHAT_MESSAGE_BEGIN,
  MESSAGES_DELETE_GROUP_CHAT_MESSAGE_SUCCESS,
  MESSAGES_DELETE_GROUP_CHAT_MESSAGE_FAILURE,
  MESSAGES_DELETE_GROUP_CHAT_MESSAGE_DISMISS_ERROR,
} from '../../../../src/features/messages/redux/constants';

import {
  deleteGroupChatMessage,
  dismissDeleteGroupChatMessageError,
  reducer,
} from '../../../../src/features/messages/redux/deleteGroupChatMessage';
import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('messages/redux/deleteGroupChatMessage', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when deleteGroupChatMessage succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .delete('/messages/groups/1/messages/1/')
      .reply(204);

    return store.dispatch(deleteGroupChatMessage({ chatId: 1, messageId: 1 }))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MESSAGES_DELETE_GROUP_CHAT_MESSAGE_BEGIN);
        expect(actions[1]).toHaveProperty('type', MESSAGES_DELETE_GROUP_CHAT_MESSAGE_SUCCESS);
      });
  });

  it('dispatches failure action when deleteGroupChatMessage fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .delete('/messages/groups/1/messages/1/')
      .reply(500);

    return store.dispatch(deleteGroupChatMessage({ chatId: 1, messageId: 1 }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MESSAGES_DELETE_GROUP_CHAT_MESSAGE_BEGIN);
        expect(actions[1]).toHaveProperty('type', MESSAGES_DELETE_GROUP_CHAT_MESSAGE_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissDeleteGroupChatMessageError', () => {
    const expectedAction = {
      type: MESSAGES_DELETE_GROUP_CHAT_MESSAGE_DISMISS_ERROR,
    };
    expect(dismissDeleteGroupChatMessageError()).toEqual(expectedAction);
  });

  it('handles action type MESSAGES_DELETE_GROUP_CHAT_MESSAGE_BEGIN correctly', () => {
    const prevState = { deleteGroupChatMessagePending: false };
    const state = reducer(
      prevState,
      { type: MESSAGES_DELETE_GROUP_CHAT_MESSAGE_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteGroupChatMessagePending).toBe(true);
  });

  it('handles action type MESSAGES_DELETE_GROUP_CHAT_MESSAGE_SUCCESS correctly', () => {
    const prevState = { deleteGroupChatMessagePending: true };
    const state = reducer(
      prevState,
      { type: MESSAGES_DELETE_GROUP_CHAT_MESSAGE_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteGroupChatMessagePending).toBe(false);
  });

  it('handles action type MESSAGES_DELETE_GROUP_CHAT_MESSAGE_FAILURE correctly', () => {
    const prevState = { deleteGroupChatMessagePending: true };
    const state = reducer(
      prevState,
      { type: MESSAGES_DELETE_GROUP_CHAT_MESSAGE_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteGroupChatMessagePending).toBe(false);
    expect(state.deleteGroupChatMessageError).toEqual(expect.anything());
  });

  it('handles action type MESSAGES_DELETE_GROUP_CHAT_MESSAGE_DISMISS_ERROR correctly', () => {
    const prevState = { deleteGroupChatMessageError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MESSAGES_DELETE_GROUP_CHAT_MESSAGE_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteGroupChatMessageError).toBe(null);
  });
});

