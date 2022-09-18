import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MESSAGES_DELETE_PEER_TO_PEER_MESSAGE_BEGIN,
  MESSAGES_DELETE_PEER_TO_PEER_MESSAGE_SUCCESS,
  MESSAGES_DELETE_PEER_TO_PEER_MESSAGE_FAILURE,
  MESSAGES_DELETE_PEER_TO_PEER_MESSAGE_DISMISS_ERROR,
} from '../../../../src/features/messages/redux/constants';

import {
  deletePeerToPeerMessage,
  dismissDeletePeerToPeerMessageError,
  reducer,
} from '../../../../src/features/messages/redux/deletePeerToPeerMessage';
import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('messages/redux/deletePeerToPeerMessage', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when deletePeerToPeerMessage succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .delete('/messages/conversations/1/messages/1/')
      .reply(204);

    return store.dispatch(deletePeerToPeerMessage({ peerId: 1, messageId: 1 }))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MESSAGES_DELETE_PEER_TO_PEER_MESSAGE_BEGIN);
        expect(actions[1]).toHaveProperty('type', MESSAGES_DELETE_PEER_TO_PEER_MESSAGE_SUCCESS);
      });
  });

  it('dispatches failure action when deletePeerToPeerMessage fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .delete('/messages/conversations/1/messages/1/')
      .reply(500);

    return store.dispatch(deletePeerToPeerMessage({ peerId: 1, messageId: 1 }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MESSAGES_DELETE_PEER_TO_PEER_MESSAGE_BEGIN);
        expect(actions[1]).toHaveProperty('type', MESSAGES_DELETE_PEER_TO_PEER_MESSAGE_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissDeletePeerToPeerMessageError', () => {
    const expectedAction = {
      type: MESSAGES_DELETE_PEER_TO_PEER_MESSAGE_DISMISS_ERROR,
    };
    expect(dismissDeletePeerToPeerMessageError()).toEqual(expectedAction);
  });

  it('handles action type MESSAGES_DELETE_PEER_TO_PEER_MESSAGE_BEGIN correctly', () => {
    const prevState = { deletePeerToPeerMessagePending: false };
    const state = reducer(
      prevState,
      { type: MESSAGES_DELETE_PEER_TO_PEER_MESSAGE_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deletePeerToPeerMessagePending).toBe(true);
  });

  it('handles action type MESSAGES_DELETE_PEER_TO_PEER_MESSAGE_SUCCESS correctly', () => {
    const prevState = { deletePeerToPeerMessagePending: true };
    const state = reducer(
      prevState,
      { type: MESSAGES_DELETE_PEER_TO_PEER_MESSAGE_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deletePeerToPeerMessagePending).toBe(false);
  });

  it('handles action type MESSAGES_DELETE_PEER_TO_PEER_MESSAGE_FAILURE correctly', () => {
    const prevState = { deletePeerToPeerMessagePending: true };
    const state = reducer(
      prevState,
      { type: MESSAGES_DELETE_PEER_TO_PEER_MESSAGE_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deletePeerToPeerMessagePending).toBe(false);
    expect(state.deletePeerToPeerMessageError).toEqual(expect.anything());
  });

  it('handles action type MESSAGES_DELETE_PEER_TO_PEER_MESSAGE_DISMISS_ERROR correctly', () => {
    const prevState = { deletePeerToPeerMessageError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MESSAGES_DELETE_PEER_TO_PEER_MESSAGE_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deletePeerToPeerMessageError).toBe(null);
  });
});

