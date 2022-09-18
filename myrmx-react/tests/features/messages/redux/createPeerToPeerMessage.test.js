import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MESSAGES_CREATE_PEER_TO_PEER_MESSAGE_BEGIN,
  MESSAGES_CREATE_PEER_TO_PEER_MESSAGE_SUCCESS,
  MESSAGES_CREATE_PEER_TO_PEER_MESSAGE_FAILURE,
  MESSAGES_CREATE_PEER_TO_PEER_MESSAGE_DISMISS_ERROR,
} from '../../../../src/features/messages/redux/constants';

import {
  createPeerToPeerMessage,
  dismissCreatePeerToPeerMessageError,
  reducer,
} from '../../../../src/features/messages/redux/createPeerToPeerMessage';

import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('messages/redux/createPeerToPeerMessage', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when createPeerToPeerMessage succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/messages/conversations/')
      .reply(200);

    return store.dispatch(createPeerToPeerMessage())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MESSAGES_CREATE_PEER_TO_PEER_MESSAGE_BEGIN);
        expect(actions[1]).toHaveProperty('type', MESSAGES_CREATE_PEER_TO_PEER_MESSAGE_SUCCESS);
      });
  });

  it('dispatches failure action when createPeerToPeerMessage fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/messages/conversations/')
      .reply(500, {});

    return store.dispatch(createPeerToPeerMessage({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MESSAGES_CREATE_PEER_TO_PEER_MESSAGE_BEGIN);
        expect(actions[1]).toHaveProperty('type', MESSAGES_CREATE_PEER_TO_PEER_MESSAGE_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissCreatePeerToPeerMessageError', () => {
    const expectedAction = {
      type: MESSAGES_CREATE_PEER_TO_PEER_MESSAGE_DISMISS_ERROR,
    };
    expect(dismissCreatePeerToPeerMessageError()).toEqual(expectedAction);
  });

  it('handles action type MESSAGES_CREATE_PEER_TO_PEER_MESSAGE_BEGIN correctly', () => {
    const prevState = { createPeerToPeerMessagePending: false };
    const state = reducer(
      prevState,
      { type: MESSAGES_CREATE_PEER_TO_PEER_MESSAGE_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.createPeerToPeerMessagePending).toBe(true);
  });

  it('handles action type MESSAGES_CREATE_PEER_TO_PEER_MESSAGE_SUCCESS correctly', () => {
    const prevState = { createPeerToPeerMessagePending: true };
    const state = reducer(
      prevState,
      { type: MESSAGES_CREATE_PEER_TO_PEER_MESSAGE_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.createPeerToPeerMessagePending).toBe(false);
  });

  it('handles action type MESSAGES_CREATE_PEER_TO_PEER_MESSAGE_FAILURE correctly', () => {
    const prevState = { createPeerToPeerMessagePending: true };
    const state = reducer(
      prevState,
      { type: MESSAGES_CREATE_PEER_TO_PEER_MESSAGE_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.createPeerToPeerMessagePending).toBe(false);
    expect(state.createPeerToPeerMessageError).toEqual(expect.anything());
  });

  it('handles action type MESSAGES_CREATE_PEER_TO_PEER_MESSAGE_DISMISS_ERROR correctly', () => {
    const prevState = { createPeerToPeerMessageError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MESSAGES_CREATE_PEER_TO_PEER_MESSAGE_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.createPeerToPeerMessageError).toBe(null);
  });
});

