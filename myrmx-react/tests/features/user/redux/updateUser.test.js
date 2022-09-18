import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  USER_UPDATE_USER_BEGIN,
  USER_UPDATE_USER_SUCCESS,
  USER_UPDATE_USER_FAILURE,
  USER_UPDATE_USER_DISMISS_ERROR,
} from '../../../../src/features/user/redux/constants';

import {
  updateUser,
  dismissUpdateUserError,
  reducer,
} from '../../../../src/features/user/redux/updateUser';

import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('user/redux/updateUser', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when updateUser succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .put('/profile/')
      .reply(200);

    return store.dispatch(updateUser())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', USER_UPDATE_USER_BEGIN);
        expect(actions[1]).toHaveProperty('type', USER_UPDATE_USER_SUCCESS);
      });
  });

  it('dispatches failure action when updateUser fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .put('/profile/')
      .reply(500, {});
      
    return store.dispatch(updateUser({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', USER_UPDATE_USER_BEGIN);
        expect(actions[1]).toHaveProperty('type', USER_UPDATE_USER_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissUpdateUserError', () => {
    const expectedAction = {
      type: USER_UPDATE_USER_DISMISS_ERROR,
    };
    expect(dismissUpdateUserError()).toEqual(expectedAction);
  });

  it('handles action type USER_UPDATE_USER_BEGIN correctly', () => {
    const prevState = { updateUserPending: false };
    const state = reducer(
      prevState,
      { type: USER_UPDATE_USER_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateUserPending).toBe(true);
  });

  it('handles action type USER_UPDATE_USER_SUCCESS correctly', () => {
    const prevState = { updateUserPending: true };
    const state = reducer(
      prevState,
      { type: USER_UPDATE_USER_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateUserPending).toBe(false);
  });

  it('handles action type USER_UPDATE_USER_FAILURE correctly', () => {
    const prevState = { updateUserPending: true };
    const state = reducer(
      prevState,
      { type: USER_UPDATE_USER_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateUserPending).toBe(false);
    expect(state.updateUserError).toEqual(expect.anything());
  });

  it('handles action type USER_UPDATE_USER_DISMISS_ERROR correctly', () => {
    const prevState = { updateUserError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: USER_UPDATE_USER_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateUserError).toBe(null);
  });
});

