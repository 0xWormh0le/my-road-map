import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  USER_INVITE_COACH_BEGIN,
  USER_INVITE_COACH_SUCCESS,
  USER_INVITE_COACH_FAILURE,
  USER_INVITE_COACH_DISMISS_ERROR,
} from '../../../../src/features/user/redux/constants';

import {
  inviteCoach,
  dismissInviteCoachError,
  reducer,
} from '../../../../src/features/user/redux/inviteCoach';
import config from '../../../../src/common/config';


const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('user/redux/inviteCoach', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when inviteCoach succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/invite-coach/')
      .reply(200);

    return store.dispatch(inviteCoach())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', USER_INVITE_COACH_BEGIN);
        expect(actions[1]).toHaveProperty('type', USER_INVITE_COACH_SUCCESS);
      });
  });

  it('dispatches failure action when inviteCoach fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/invite-coach/')
      .reply(500);

    return store.dispatch(inviteCoach({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', USER_INVITE_COACH_BEGIN);
        expect(actions[1]).toHaveProperty('type', USER_INVITE_COACH_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissInviteCoachError', () => {
    const expectedAction = {
      type: USER_INVITE_COACH_DISMISS_ERROR,
    };
    expect(dismissInviteCoachError()).toEqual(expectedAction);
  });

  it('handles action type USER_INVITE_COACH_BEGIN correctly', () => {
    const prevState = { inviteCoachPending: false };
    const state = reducer(
      prevState,
      { type: USER_INVITE_COACH_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.inviteCoachPending).toBe(true);
  });

  it('handles action type USER_INVITE_COACH_SUCCESS correctly', () => {
    const prevState = { inviteCoachPending: true };
    const state = reducer(
      prevState,
      { type: USER_INVITE_COACH_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.inviteCoachPending).toBe(false);
  });

  it('handles action type USER_INVITE_COACH_FAILURE correctly', () => {
    const prevState = { inviteCoachPending: true };
    const state = reducer(
      prevState,
      { type: USER_INVITE_COACH_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.inviteCoachPending).toBe(false);
    expect(state.inviteCoachError).toEqual(expect.anything());
  });

  it('handles action type USER_INVITE_COACH_DISMISS_ERROR correctly', () => {
    const prevState = { inviteCoachError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: USER_INVITE_COACH_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.inviteCoachError).toBe(null);
  });
});

