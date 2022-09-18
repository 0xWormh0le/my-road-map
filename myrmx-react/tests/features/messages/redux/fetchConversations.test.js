import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MESSAGES_FETCH_CONVERSATIONS_BEGIN,
  MESSAGES_FETCH_CONVERSATIONS_SUCCESS,
  MESSAGES_FETCH_CONVERSATIONS_FAILURE,
  MESSAGES_FETCH_CONVERSATIONS_DISMISS_ERROR,
} from '../../../../src/features/messages/redux/constants';

import {
  fetchConversations,
  dismissFetchConversationsError,
  reducer,
} from '../../../../src/features/messages/redux/fetchConversations';

import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('messages/redux/fetchConversations', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when fetchConversations succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .get('/messages/conversations/')
      .reply(200, {});

    return store.dispatch(fetchConversations())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MESSAGES_FETCH_CONVERSATIONS_BEGIN);
        expect(actions[1]).toHaveProperty('type', MESSAGES_FETCH_CONVERSATIONS_SUCCESS);
      });
  });

  it('dispatches failure action when fetchConversations fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .get('/messages/conversations/')
      .reply(500, {});

    return store.dispatch(fetchConversations({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MESSAGES_FETCH_CONVERSATIONS_BEGIN);
        expect(actions[1]).toHaveProperty('type', MESSAGES_FETCH_CONVERSATIONS_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissFetchConversationsError', () => {
    const expectedAction = {
      type: MESSAGES_FETCH_CONVERSATIONS_DISMISS_ERROR,
    };
    expect(dismissFetchConversationsError()).toEqual(expectedAction);
  });

  it('handles action type MESSAGES_FETCH_CONVERSATIONS_BEGIN correctly', () => {
    const prevState = { fetchConversationsPending: false };
    const state = reducer(
      prevState,
      { type: MESSAGES_FETCH_CONVERSATIONS_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchConversationsPending).toBe(true);
  });

  it('handles action type MESSAGES_FETCH_CONVERSATIONS_SUCCESS correctly', () => {
    const prevState = { fetchConversationsPending: true };
    const state = reducer(
      prevState,
      { type: MESSAGES_FETCH_CONVERSATIONS_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchConversationsPending).toBe(false);
  });

  it('handles action type MESSAGES_FETCH_CONVERSATIONS_FAILURE correctly', () => {
    const prevState = { fetchConversationsPending: true };
    const state = reducer(
      prevState,
      { type: MESSAGES_FETCH_CONVERSATIONS_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchConversationsPending).toBe(false);
    expect(state.fetchConversationsError).toEqual(expect.anything());
  });

  it('handles action type MESSAGES_FETCH_CONVERSATIONS_DISMISS_ERROR correctly', () => {
    const prevState = { fetchConversationsError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MESSAGES_FETCH_CONVERSATIONS_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchConversationsError).toBe(null);
  });
});

