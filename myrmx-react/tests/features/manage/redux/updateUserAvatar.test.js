import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MANAGE_UPDATE_USER_AVATAR_BEGIN,
  MANAGE_UPDATE_USER_AVATAR_SUCCESS,
  MANAGE_UPDATE_USER_AVATAR_FAILURE,
  MANAGE_UPDATE_USER_AVATAR_DISMISS_ERROR,
} from '../../../../src/features/manage/redux/constants';

import {
  updateUserAvatar,
  dismissUpdateUserAvatarError,
  reducer,
} from '../../../../src/features/manage/redux/updateUserAvatar';
import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('manage/redux/updateUserAvatar', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when updateUserAvatar succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .patch('/users/1/')
      .reply(200);

    return store.dispatch(updateUserAvatar({ userId: 1}))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_UPDATE_USER_AVATAR_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_UPDATE_USER_AVATAR_SUCCESS);
      });
  });

  it('dispatches failure action when updateUserAvatar fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .patch('/users/1/')
      .reply(500, {});

    return store.dispatch(updateUserAvatar({ userId: 1 }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_UPDATE_USER_AVATAR_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_UPDATE_USER_AVATAR_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissUpdateUserAvatarError', () => {
    const expectedAction = {
      type: MANAGE_UPDATE_USER_AVATAR_DISMISS_ERROR,
    };
    expect(dismissUpdateUserAvatarError()).toEqual(expectedAction);
  });

  it('handles action type MANAGE_UPDATE_USER_AVATAR_BEGIN correctly', () => {
    const prevState = { updateUserAvatarPending: false };
    const state = reducer(
      prevState,
      { type: MANAGE_UPDATE_USER_AVATAR_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateUserAvatarPending).toBe(true);
  });

  it('handles action type MANAGE_UPDATE_USER_AVATAR_SUCCESS correctly', () => {
    const prevState = { updateUserAvatarPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_UPDATE_USER_AVATAR_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateUserAvatarPending).toBe(false);
  });

  it('handles action type MANAGE_UPDATE_USER_AVATAR_FAILURE correctly', () => {
    const prevState = { updateUserAvatarPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_UPDATE_USER_AVATAR_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateUserAvatarPending).toBe(false);
    expect(state.updateUserAvatarError).toEqual(expect.anything());
  });

  it('handles action type MANAGE_UPDATE_USER_AVATAR_DISMISS_ERROR correctly', () => {
    const prevState = { updateUserAvatarError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MANAGE_UPDATE_USER_AVATAR_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateUserAvatarError).toBe(null);
  });
});

