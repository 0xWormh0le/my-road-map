import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  USER_UPDATE_PROFILE_PHOTO_BEGIN,
  USER_UPDATE_PROFILE_PHOTO_SUCCESS,
  USER_UPDATE_PROFILE_PHOTO_FAILURE,
  USER_UPDATE_PROFILE_PHOTO_DISMISS_ERROR,
} from '../../../../src/features/user/redux/constants';

import {
  updateProfilePhoto,
  dismissUpdateProfilePhotoError,
  reducer,
} from '../../../../src/features/user/redux/updateProfilePhoto';

import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('user/redux/updateProfilePhoto', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when updateProfilePhoto succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .patch('/profile/')
      .reply(200);

    return store.dispatch(updateProfilePhoto())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', USER_UPDATE_PROFILE_PHOTO_BEGIN);
        expect(actions[1]).toHaveProperty('type', USER_UPDATE_PROFILE_PHOTO_SUCCESS);
      });
  });

  it('dispatches failure action when updateProfilePhoto fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .patch('/profile/')
      .reply(500, {});

    return store.dispatch(updateProfilePhoto({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', USER_UPDATE_PROFILE_PHOTO_BEGIN);
        expect(actions[1]).toHaveProperty('type', USER_UPDATE_PROFILE_PHOTO_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissUpdateProfilePhotoError', () => {
    const expectedAction = {
      type: USER_UPDATE_PROFILE_PHOTO_DISMISS_ERROR,
    };
    expect(dismissUpdateProfilePhotoError()).toEqual(expectedAction);
  });

  it('handles action type USER_UPDATE_PROFILE_PHOTO_BEGIN correctly', () => {
    const prevState = { updateProfilePhotoPending: false };
    const state = reducer(
      prevState,
      { type: USER_UPDATE_PROFILE_PHOTO_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateProfilePhotoPending).toBe(true);
  });

  it('handles action type USER_UPDATE_PROFILE_PHOTO_SUCCESS correctly', () => {
    const prevState = { updateProfilePhotoPending: true };
    const state = reducer(
      prevState,
      { type: USER_UPDATE_PROFILE_PHOTO_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateProfilePhotoPending).toBe(false);
  });

  it('handles action type USER_UPDATE_PROFILE_PHOTO_FAILURE correctly', () => {
    const prevState = { updateProfilePhotoPending: true };
    const state = reducer(
      prevState,
      { type: USER_UPDATE_PROFILE_PHOTO_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateProfilePhotoPending).toBe(false);
    expect(state.updateProfilePhotoError).toEqual(expect.anything());
  });

  it('handles action type USER_UPDATE_PROFILE_PHOTO_DISMISS_ERROR correctly', () => {
    const prevState = { updateProfilePhotoError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: USER_UPDATE_PROFILE_PHOTO_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateProfilePhotoError).toBe(null);
  });
});

