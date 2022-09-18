import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  HOME_ACCEPT_COACH_INVITATION_BEGIN,
  HOME_ACCEPT_COACH_INVITATION_SUCCESS,
  HOME_ACCEPT_COACH_INVITATION_FAILURE,
  HOME_ACCEPT_COACH_INVITATION_DISMISS_ERROR,
} from '../../../../src/features/home/redux/constants';

import {
  acceptCoachInvitation,
  dismissAcceptCoachInvitationError,
  reducer,
} from '../../../../src/features/home/redux/acceptCoachInvitation';
import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/acceptCoachInvitation', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when acceptCoachInvitation succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/accept-coach-invitation/?uid=1&token=1')
      .reply(200);

    return store.dispatch(acceptCoachInvitation({ uid: 1, token: 1}))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_ACCEPT_COACH_INVITATION_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_ACCEPT_COACH_INVITATION_SUCCESS);
      });
  });

  it('dispatches failure action when acceptCoachInvitation fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/accept-coach-invitation/?uid=1&token=1')
      .reply(500);
    return store.dispatch(acceptCoachInvitation({ uid: 1, token: 1}))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_ACCEPT_COACH_INVITATION_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_ACCEPT_COACH_INVITATION_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissAcceptCoachInvitationError', () => {
    const expectedAction = {
      type: HOME_ACCEPT_COACH_INVITATION_DISMISS_ERROR,
    };
    expect(dismissAcceptCoachInvitationError()).toEqual(expectedAction);
  });

  it('handles action type HOME_ACCEPT_COACH_INVITATION_BEGIN correctly', () => {
    const prevState = { acceptCoachInvitationPending: false };
    const state = reducer(
      prevState,
      { type: HOME_ACCEPT_COACH_INVITATION_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.acceptCoachInvitationPending).toBe(true);
  });

  it('handles action type HOME_ACCEPT_COACH_INVITATION_SUCCESS correctly', () => {
    const prevState = { acceptCoachInvitationPending: true };
    const state = reducer(
      prevState,
      { type: HOME_ACCEPT_COACH_INVITATION_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.acceptCoachInvitationPending).toBe(false);
  });

  it('handles action type HOME_ACCEPT_COACH_INVITATION_FAILURE correctly', () => {
    const prevState = { acceptCoachInvitationPending: true };
    const state = reducer(
      prevState,
      { type: HOME_ACCEPT_COACH_INVITATION_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.acceptCoachInvitationPending).toBe(false);
    expect(state.acceptCoachInvitationError).toEqual(expect.anything());
  });

  it('handles action type HOME_ACCEPT_COACH_INVITATION_DISMISS_ERROR correctly', () => {
    const prevState = { acceptCoachInvitationError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_ACCEPT_COACH_INVITATION_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.acceptCoachInvitationError).toBe(null);
  });
});

