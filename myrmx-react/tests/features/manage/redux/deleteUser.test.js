import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MANAGE_DELETE_USER_BEGIN,
  MANAGE_DELETE_USER_SUCCESS,
  MANAGE_DELETE_USER_FAILURE,
  MANAGE_DELETE_USER_DISMISS_ERROR,
} from '../../../../src/features/manage/redux/constants';

import {
  deleteUser,
  dismissDeleteUserError,
  reducer,
} from '../../../../src/features/manage/redux/deleteUser';
import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('manage/redux/deleteUser', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when deleteUser succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .delete('/users/1/')
      .reply(200);

    return store.dispatch(deleteUser({ userId: 1 }))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_DELETE_USER_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_DELETE_USER_SUCCESS);
      });
  });

  it('dispatches failure action when deleteUser fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .delete('/users/1/')
      .reply(500, {});

    return store.dispatch(deleteUser({ userId: 1 }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_DELETE_USER_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_DELETE_USER_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissDeleteUserError', () => {
    const expectedAction = {
      type: MANAGE_DELETE_USER_DISMISS_ERROR,
    };
    expect(dismissDeleteUserError()).toEqual(expectedAction);
  });

  it('handles action type MANAGE_DELETE_USER_BEGIN correctly', () => {
    const prevState = { deleteUserPending: false };
    const state = reducer(
      prevState,
      { type: MANAGE_DELETE_USER_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteUserPending).toBe(true);
  });

  it('handles action type MANAGE_DELETE_USER_SUCCESS correctly', () => {
    const prevState = { deleteUserPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_DELETE_USER_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteUserPending).toBe(false);
  });

  it('handles action type MANAGE_DELETE_USER_FAILURE correctly', () => {
    const prevState = { deleteUserPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_DELETE_USER_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteUserPending).toBe(false);
    expect(state.deleteUserError).toEqual(expect.anything());
  });

  it('handles action type MANAGE_DELETE_USER_DISMISS_ERROR correctly', () => {
    const prevState = { deleteUserError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MANAGE_DELETE_USER_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteUserError).toBe(null);
  });
});

