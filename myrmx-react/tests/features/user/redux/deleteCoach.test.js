import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  USER_DELETE_COACH_BEGIN,
  USER_DELETE_COACH_SUCCESS,
  USER_DELETE_COACH_FAILURE,
  USER_DELETE_COACH_DISMISS_ERROR,
} from '../../../../src/features/user/redux/constants';

import {
  deleteCoach,
  dismissDeleteCoachError,
  reducer,
} from '../../../../src/features/user/redux/deleteCoach';
import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('user/redux/deleteCoach', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when deleteCoach succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/remove-coach/')
      .reply(200);


    return store.dispatch(deleteCoach())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', USER_DELETE_COACH_BEGIN);
        expect(actions[1]).toHaveProperty('type', USER_DELETE_COACH_SUCCESS);
      });
  });

  it('dispatches failure action when deleteCoach fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/remove-coach/')
      .reply(500);
    return store.dispatch(deleteCoach({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', USER_DELETE_COACH_BEGIN);
        expect(actions[1]).toHaveProperty('type', USER_DELETE_COACH_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissDeleteCoachError', () => {
    const expectedAction = {
      type: USER_DELETE_COACH_DISMISS_ERROR,
    };
    expect(dismissDeleteCoachError()).toEqual(expectedAction);
  });

  it('handles action type USER_DELETE_COACH_BEGIN correctly', () => {
    const prevState = { deleteCoachPending: false };
    const state = reducer(
      prevState,
      { type: USER_DELETE_COACH_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteCoachPending).toBe(true);
  });

  it('handles action type USER_DELETE_COACH_SUCCESS correctly', () => {
    const prevState = { deleteCoachPending: true };
    const state = reducer(
      prevState,
      { type: USER_DELETE_COACH_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteCoachPending).toBe(false);
  });

  it('handles action type USER_DELETE_COACH_FAILURE correctly', () => {
    const prevState = { deleteCoachPending: true };
    const state = reducer(
      prevState,
      { type: USER_DELETE_COACH_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteCoachPending).toBe(false);
    expect(state.deleteCoachError).toEqual(expect.anything());
  });

  it('handles action type USER_DELETE_COACH_DISMISS_ERROR correctly', () => {
    const prevState = { deleteCoachError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: USER_DELETE_COACH_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteCoachError).toBe(null);
  });
});

