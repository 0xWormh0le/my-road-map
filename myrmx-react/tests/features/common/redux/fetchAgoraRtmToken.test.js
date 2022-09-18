import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  COMMON_FETCH_AGORA_RTM_TOKEN_BEGIN,
  COMMON_FETCH_AGORA_RTM_TOKEN_SUCCESS,
  COMMON_FETCH_AGORA_RTM_TOKEN_FAILURE,
  COMMON_FETCH_AGORA_RTM_TOKEN_DISMISS_ERROR,
} from '../../../../src/features/common/redux/constants';

import {
  fetchAgoraRtmToken,
  dismissFetchAgoraRtmTokenError,
  reducer,
} from '../../../../src/features/common/redux/fetchAgoraRtmToken';

import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('common/redux/fetchAgoraRtmToken', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when fetchAgoraRtmToken succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .get('/messages/get-rtm-token/')
      .reply(200);

    return store.dispatch(fetchAgoraRtmToken())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', COMMON_FETCH_AGORA_RTM_TOKEN_BEGIN);
        expect(actions[1]).toHaveProperty('type', COMMON_FETCH_AGORA_RTM_TOKEN_SUCCESS);
      });
  });

  it('dispatches failure action when fetchAgoraRtmToken fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .get('/messages/get-rtm-token/')
      .reply(500, {});
      
    return store.dispatch(fetchAgoraRtmToken({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', COMMON_FETCH_AGORA_RTM_TOKEN_BEGIN);
        expect(actions[1]).toHaveProperty('type', COMMON_FETCH_AGORA_RTM_TOKEN_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissFetchAgoraRtmTokenError', () => {
    const expectedAction = {
      type: COMMON_FETCH_AGORA_RTM_TOKEN_DISMISS_ERROR,
    };
    expect(dismissFetchAgoraRtmTokenError()).toEqual(expectedAction);
  });

  it('handles action type COMMON_FETCH_AGORA_RTM_TOKEN_BEGIN correctly', () => {
    const prevState = { fetchAgoraRtmTokenPending: false };
    const state = reducer(
      prevState,
      { type: COMMON_FETCH_AGORA_RTM_TOKEN_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchAgoraRtmTokenPending).toBe(true);
  });

  it('handles action type COMMON_FETCH_AGORA_RTM_TOKEN_SUCCESS correctly', () => {
    const prevState = { fetchAgoraRtmTokenPending: true };
    const state = reducer(
      prevState,
      { type: COMMON_FETCH_AGORA_RTM_TOKEN_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchAgoraRtmTokenPending).toBe(false);
  });

  it('handles action type COMMON_FETCH_AGORA_RTM_TOKEN_FAILURE correctly', () => {
    const prevState = { fetchAgoraRtmTokenPending: true };
    const state = reducer(
      prevState,
      { type: COMMON_FETCH_AGORA_RTM_TOKEN_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchAgoraRtmTokenPending).toBe(false);
    expect(state.fetchAgoraRtmTokenError).toEqual(expect.anything());
  });

  it('handles action type COMMON_FETCH_AGORA_RTM_TOKEN_DISMISS_ERROR correctly', () => {
    const prevState = { fetchAgoraRtmTokenError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: COMMON_FETCH_AGORA_RTM_TOKEN_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchAgoraRtmTokenError).toBe(null);
  });
});

