import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MESSAGES_FETCH_GROUP_CHATS_BEGIN,
  MESSAGES_FETCH_GROUP_CHATS_SUCCESS,
  MESSAGES_FETCH_GROUP_CHATS_FAILURE,
  MESSAGES_FETCH_GROUP_CHATS_DISMISS_ERROR,
} from '../../../../src/features/messages/redux/constants';

import {
  fetchGroupChats,
  dismissFetchGroupChatsError,
  reducer,
} from '../../../../src/features/messages/redux/fetchGroupChats';
import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('messages/redux/fetchGroupChats', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when fetchGroupChats succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .get('/messages/groups/')
      .reply(200, {});

    return store.dispatch(fetchGroupChats())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MESSAGES_FETCH_GROUP_CHATS_BEGIN);
        expect(actions[1]).toHaveProperty('type', MESSAGES_FETCH_GROUP_CHATS_SUCCESS);
      });
  });

  it('dispatches failure action when fetchGroupChats fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .get('/messages/groups/')
      .reply(500, {});

    return store.dispatch(fetchGroupChats())
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MESSAGES_FETCH_GROUP_CHATS_BEGIN);
        expect(actions[1]).toHaveProperty('type', MESSAGES_FETCH_GROUP_CHATS_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissFetchGroupChatsError', () => {
    const expectedAction = {
      type: MESSAGES_FETCH_GROUP_CHATS_DISMISS_ERROR,
    };
    expect(dismissFetchGroupChatsError()).toEqual(expectedAction);
  });

  it('handles action type MESSAGES_FETCH_GROUP_CHATS_BEGIN correctly', () => {
    const prevState = { fetchGroupChatsPending: false };
    const state = reducer(
      prevState,
      { type: MESSAGES_FETCH_GROUP_CHATS_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchGroupChatsPending).toBe(true);
  });

  it('handles action type MESSAGES_FETCH_GROUP_CHATS_SUCCESS correctly', () => {
    const prevState = { fetchGroupChatsPending: true };
    const state = reducer(
      prevState,
      { type: MESSAGES_FETCH_GROUP_CHATS_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchGroupChatsPending).toBe(false);
  });

  it('handles action type MESSAGES_FETCH_GROUP_CHATS_FAILURE correctly', () => {
    const prevState = { fetchGroupChatsPending: true };
    const state = reducer(
      prevState,
      { type: MESSAGES_FETCH_GROUP_CHATS_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchGroupChatsPending).toBe(false);
    expect(state.fetchGroupChatsError).toEqual(expect.anything());
  });

  it('handles action type MESSAGES_FETCH_GROUP_CHATS_DISMISS_ERROR correctly', () => {
    const prevState = { fetchGroupChatsError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MESSAGES_FETCH_GROUP_CHATS_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchGroupChatsError).toBe(null);
  });
});

