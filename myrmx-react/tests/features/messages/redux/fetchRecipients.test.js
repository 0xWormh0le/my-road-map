import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MESSAGES_FETCH_RECIPIENTS_BEGIN,
  MESSAGES_FETCH_RECIPIENTS_SUCCESS,
  MESSAGES_FETCH_RECIPIENTS_FAILURE,
  MESSAGES_FETCH_RECIPIENTS_DISMISS_ERROR,
} from '../../../../src/features/messages/redux/constants';

import {
  fetchRecipients,
  dismissFetchRecipientsError,
  reducer,
} from '../../../../src/features/messages/redux/fetchRecipients';

import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('messages/redux/fetchRecipients', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when fetchRecipients succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .get('/messages/recipients/')
      .reply(200, {});

    return store.dispatch(fetchRecipients())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MESSAGES_FETCH_RECIPIENTS_BEGIN);
        expect(actions[1]).toHaveProperty('type', MESSAGES_FETCH_RECIPIENTS_SUCCESS);
      });
  });

  it('dispatches failure action when fetchRecipients fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .get('/messages/recipients/')
      .reply(500, {});

    return store.dispatch(fetchRecipients({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MESSAGES_FETCH_RECIPIENTS_BEGIN);
        expect(actions[1]).toHaveProperty('type', MESSAGES_FETCH_RECIPIENTS_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissFetchRecipientsError', () => {
    const expectedAction = {
      type: MESSAGES_FETCH_RECIPIENTS_DISMISS_ERROR,
    };
    expect(dismissFetchRecipientsError()).toEqual(expectedAction);
  });

  it('handles action type MESSAGES_FETCH_RECIPIENTS_BEGIN correctly', () => {
    const prevState = { fetchRecipientsPending: false };
    const state = reducer(
      prevState,
      { type: MESSAGES_FETCH_RECIPIENTS_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchRecipientsPending).toBe(true);
  });

  it('handles action type MESSAGES_FETCH_RECIPIENTS_SUCCESS correctly', () => {
    const prevState = { fetchRecipientsPending: true };
    const state = reducer(
      prevState,
      { type: MESSAGES_FETCH_RECIPIENTS_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchRecipientsPending).toBe(false);
  });

  it('handles action type MESSAGES_FETCH_RECIPIENTS_FAILURE correctly', () => {
    const prevState = { fetchRecipientsPending: true };
    const state = reducer(
      prevState,
      { type: MESSAGES_FETCH_RECIPIENTS_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchRecipientsPending).toBe(false);
    expect(state.fetchRecipientsError).toEqual(expect.anything());
  });

  it('handles action type MESSAGES_FETCH_RECIPIENTS_DISMISS_ERROR correctly', () => {
    const prevState = { fetchRecipientsError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MESSAGES_FETCH_RECIPIENTS_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchRecipientsError).toBe(null);
  });
});

