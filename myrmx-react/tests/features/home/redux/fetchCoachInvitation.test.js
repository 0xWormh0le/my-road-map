import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  HOME_FETCH_COACH_INVITATION_BEGIN,
  HOME_FETCH_COACH_INVITATION_SUCCESS,
  HOME_FETCH_COACH_INVITATION_FAILURE,
  HOME_FETCH_COACH_INVITATION_DISMISS_ERROR,
} from '../../../../src/features/home/redux/constants';

import {
  fetchCoachInvitation,
  dismissFetchCoachInvitationError,
  reducer,
} from '../../../../src/features/home/redux/fetchCoachInvitation';
import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/fetchCoachInvitation', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when fetchCoachInvitation succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .get('/accept-coach-invitation/?uid=1&token=1')
      .reply(200);

    return store.dispatch(fetchCoachInvitation({ uid: 1, token: 1}))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_FETCH_COACH_INVITATION_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_FETCH_COACH_INVITATION_SUCCESS);
      });
  });

  it('dispatches failure action when fetchCoachInvitation fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .get('/accept-coach-invitation/?uid=1&token=1')
      .reply(500);

    return store.dispatch(fetchCoachInvitation({ uid: 1, token: 1}))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_FETCH_COACH_INVITATION_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_FETCH_COACH_INVITATION_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissFetchCoachInvitationError', () => {
    const expectedAction = {
      type: HOME_FETCH_COACH_INVITATION_DISMISS_ERROR,
    };
    expect(dismissFetchCoachInvitationError()).toEqual(expectedAction);
  });

  it('handles action type HOME_FETCH_COACH_INVITATION_BEGIN correctly', () => {
    const prevState = { fetchCoachInvitationPending: false };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_COACH_INVITATION_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchCoachInvitationPending).toBe(true);
  });

  it('handles action type HOME_FETCH_COACH_INVITATION_SUCCESS correctly', () => {
    const prevState = { fetchCoachInvitationPending: true };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_COACH_INVITATION_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchCoachInvitationPending).toBe(false);
  });

  it('handles action type HOME_FETCH_COACH_INVITATION_FAILURE correctly', () => {
    const prevState = { fetchCoachInvitationPending: true };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_COACH_INVITATION_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchCoachInvitationPending).toBe(false);
    expect(state.fetchCoachInvitationError).toEqual(expect.anything());
  });

  it('handles action type HOME_FETCH_COACH_INVITATION_DISMISS_ERROR correctly', () => {
    const prevState = { fetchCoachInvitationError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_COACH_INVITATION_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchCoachInvitationError).toBe(null);
  });
});

