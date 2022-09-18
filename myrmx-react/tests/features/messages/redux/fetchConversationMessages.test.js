import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MESSAGES_FETCH_CONVERSATION_MESSAGES_BEGIN,
  MESSAGES_FETCH_CONVERSATION_MESSAGES_SUCCESS,
  MESSAGES_FETCH_CONVERSATION_MESSAGES_FAILURE,
  MESSAGES_FETCH_CONVERSATION_MESSAGES_DISMISS_ERROR,
} from '../../../../src/features/messages/redux/constants';

import {
  fetchConversationMessages,
  dismissFetchConversationMessagesError,
  reducer,
} from '../../../../src/features/messages/redux/fetchConversationMessages';

import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('messages/redux/fetchConversationMessages', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when fetchConversationMessages succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .get('/messages/conversations/1/messages/')
      .reply(200, {});

    return store.dispatch(fetchConversationMessages({ peerId: 1 }))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MESSAGES_FETCH_CONVERSATION_MESSAGES_BEGIN);
        expect(actions[1]).toHaveProperty('type', MESSAGES_FETCH_CONVERSATION_MESSAGES_SUCCESS);
      });
  });

  it('dispatches failure action when fetchConversationMessages fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .get('/messages/conversations/1/messages/')
      .reply(500, {});

    return store.dispatch(fetchConversationMessages({ peerId: 1, error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MESSAGES_FETCH_CONVERSATION_MESSAGES_BEGIN);
        expect(actions[1]).toHaveProperty('type', MESSAGES_FETCH_CONVERSATION_MESSAGES_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissFetchConversationMessagesError', () => {
    const expectedAction = {
      type: MESSAGES_FETCH_CONVERSATION_MESSAGES_DISMISS_ERROR,
    };
    expect(dismissFetchConversationMessagesError()).toEqual(expectedAction);
  });

  it('handles action type MESSAGES_FETCH_CONVERSATION_MESSAGES_BEGIN correctly', () => {
    const prevState = { fetchConversationMessagesPending: false };
    const state = reducer(
      prevState,
      { type: MESSAGES_FETCH_CONVERSATION_MESSAGES_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchConversationMessagesPending).toBe(true);
  });

  it('handles action type MESSAGES_FETCH_CONVERSATION_MESSAGES_SUCCESS correctly', () => {
    const prevState = { fetchConversationMessagesPending: true, conversationMessages: {} };
    const state = reducer(
      prevState,
      { type: MESSAGES_FETCH_CONVERSATION_MESSAGES_SUCCESS, data: { messages: [], firstPage: true } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchConversationMessagesPending).toBe(false);
  });

  it('handles action type MESSAGES_FETCH_CONVERSATION_MESSAGES_FAILURE correctly', () => {
    const prevState = { fetchConversationMessagesPending: true };
    const state = reducer(
      prevState,
      { type: MESSAGES_FETCH_CONVERSATION_MESSAGES_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchConversationMessagesPending).toBe(false);
    expect(state.fetchConversationMessagesError).toEqual(expect.anything());
  });

  it('handles action type MESSAGES_FETCH_CONVERSATION_MESSAGES_DISMISS_ERROR correctly', () => {
    const prevState = { fetchConversationMessagesError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MESSAGES_FETCH_CONVERSATION_MESSAGES_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchConversationMessagesError).toBe(null);
  });
});

