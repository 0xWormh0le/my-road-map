import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MESSAGES_FETCH_GROUP_CHAT_MESSAGES_BEGIN,
  MESSAGES_FETCH_GROUP_CHAT_MESSAGES_SUCCESS,
  MESSAGES_FETCH_GROUP_CHAT_MESSAGES_FAILURE,
  MESSAGES_FETCH_GROUP_CHAT_MESSAGES_DISMISS_ERROR,
} from '../../../../src/features/messages/redux/constants';

import {
  fetchGroupChatMessages,
  dismissFetchGroupChatMessagesError,
  reducer,
} from '../../../../src/features/messages/redux/fetchGroupChatMessages';
import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('messages/redux/fetchGroupChatMessages', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when fetchGroupChatMessages succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .get('/messages/groups/1/messages/')
      .reply(200, {});

    return store.dispatch(fetchGroupChatMessages({ chatId: 1 }))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MESSAGES_FETCH_GROUP_CHAT_MESSAGES_BEGIN);
        expect(actions[1]).toHaveProperty('type', MESSAGES_FETCH_GROUP_CHAT_MESSAGES_SUCCESS);
      });
  });

  it('dispatches failure action when fetchGroupChatMessages fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .get('/messages/groups/1/messages/')
      .reply(500);

    return store.dispatch(fetchGroupChatMessages({ chatId: 1 }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MESSAGES_FETCH_GROUP_CHAT_MESSAGES_BEGIN);
        expect(actions[1]).toHaveProperty('type', MESSAGES_FETCH_GROUP_CHAT_MESSAGES_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissFetchGroupChatMessagesError', () => {
    const expectedAction = {
      type: MESSAGES_FETCH_GROUP_CHAT_MESSAGES_DISMISS_ERROR,
    };
    expect(dismissFetchGroupChatMessagesError()).toEqual(expectedAction);
  });

  it('handles action type MESSAGES_FETCH_GROUP_CHAT_MESSAGES_BEGIN correctly', () => {
    const prevState = { fetchGroupChatMessagesPending: false };
    const state = reducer(
      prevState,
      { type: MESSAGES_FETCH_GROUP_CHAT_MESSAGES_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchGroupChatMessagesPending).toBe(true);
  });

  it('handles action type MESSAGES_FETCH_GROUP_CHAT_MESSAGES_SUCCESS correctly', () => {
    const prevState = { fetchGroupChatMessagesPending: true, groupChatMessages: {} };
    const state = reducer(
      prevState,
      { type: MESSAGES_FETCH_GROUP_CHAT_MESSAGES_SUCCESS, data: { messages: [] } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchGroupChatMessagesPending).toBe(false);
  });

  it('handles action type MESSAGES_FETCH_GROUP_CHAT_MESSAGES_FAILURE correctly', () => {
    const prevState = { fetchGroupChatMessagesPending: true };
    const state = reducer(
      prevState,
      { type: MESSAGES_FETCH_GROUP_CHAT_MESSAGES_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchGroupChatMessagesPending).toBe(false);
    expect(state.fetchGroupChatMessagesError).toEqual(expect.anything());
  });

  it('handles action type MESSAGES_FETCH_GROUP_CHAT_MESSAGES_DISMISS_ERROR correctly', () => {
    const prevState = { fetchGroupChatMessagesError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MESSAGES_FETCH_GROUP_CHAT_MESSAGES_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchGroupChatMessagesError).toBe(null);
  });
});

