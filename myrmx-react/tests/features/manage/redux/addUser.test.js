import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MANAGE_ADD_USER_BEGIN,
  MANAGE_ADD_USER_SUCCESS,
  MANAGE_ADD_USER_FAILURE,
  MANAGE_ADD_USER_DISMISS_ERROR,
} from '../../../../src/features/manage/redux/constants';

import {
  addUser,
  dismissAddUserError,
  reducer,
} from '../../../../src/features/manage/redux/addUser';
import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('manage/redux/addUser', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when addUser succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/users/')
      .reply(201);

    return store.dispatch(addUser())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_ADD_USER_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_ADD_USER_SUCCESS);
      });
  });

  it('dispatches failure action when addUser fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/users/')
      .reply(500, {});
      
    return store.dispatch(addUser({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_ADD_USER_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_ADD_USER_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissAddUserError', () => {
    const expectedAction = {
      type: MANAGE_ADD_USER_DISMISS_ERROR,
    };
    expect(dismissAddUserError()).toEqual(expectedAction);
  });

  it('handles action type MANAGE_ADD_USER_BEGIN correctly', () => {
    const prevState = { addUserPending: false };
    const state = reducer(
      prevState,
      { type: MANAGE_ADD_USER_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addUserPending).toBe(true);
  });

  it('handles action type MANAGE_ADD_USER_SUCCESS correctly', () => {
    const prevState = { addUserPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_ADD_USER_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addUserPending).toBe(false);
  });

  it('handles action type MANAGE_ADD_USER_FAILURE correctly', () => {
    const prevState = { addUserPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_ADD_USER_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addUserPending).toBe(false);
    expect(state.addUserError).toEqual(expect.anything());
  });

  it('handles action type MANAGE_ADD_USER_DISMISS_ERROR correctly', () => {
    const prevState = { addUserError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MANAGE_ADD_USER_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addUserError).toBe(null);
  });
});

