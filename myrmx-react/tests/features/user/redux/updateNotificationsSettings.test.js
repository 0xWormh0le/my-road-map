import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  USER_UPDATE_NOTIFICATIONS_SETTINGS_BEGIN,
  USER_UPDATE_NOTIFICATIONS_SETTINGS_SUCCESS,
  USER_UPDATE_NOTIFICATIONS_SETTINGS_FAILURE,
  USER_UPDATE_NOTIFICATIONS_SETTINGS_DISMISS_ERROR,
} from '../../../../src/features/user/redux/constants';

import {
  updateNotificationsSettings,
  dismissUpdateNotificationsSettingsError,
  reducer,
} from '../../../../src/features/user/redux/updateNotificationsSettings';
import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('user/redux/updateNotificationsSettings', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when updateNotificationsSettings succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/notifications-settings/')
      .reply(201, {});

    return store.dispatch(updateNotificationsSettings())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', USER_UPDATE_NOTIFICATIONS_SETTINGS_BEGIN);
        expect(actions[1]).toHaveProperty('type', USER_UPDATE_NOTIFICATIONS_SETTINGS_SUCCESS);
      });
  });

  it('dispatches failure action when updateNotificationsSettings fails', () => {
    const store = mockStore({});

    return store.dispatch(updateNotificationsSettings({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', USER_UPDATE_NOTIFICATIONS_SETTINGS_BEGIN);
        expect(actions[1]).toHaveProperty('type', USER_UPDATE_NOTIFICATIONS_SETTINGS_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissUpdateNotificationsSettingsError', () => {
    const expectedAction = {
      type: USER_UPDATE_NOTIFICATIONS_SETTINGS_DISMISS_ERROR,
    };
    expect(dismissUpdateNotificationsSettingsError()).toEqual(expectedAction);
  });

  it('handles action type USER_UPDATE_NOTIFICATIONS_SETTINGS_BEGIN correctly', () => {
    const prevState = { updateNotificationsSettingsPending: false };
    const state = reducer(
      prevState,
      { type: USER_UPDATE_NOTIFICATIONS_SETTINGS_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateNotificationsSettingsPending).toBe(true);
  });

  it('handles action type USER_UPDATE_NOTIFICATIONS_SETTINGS_SUCCESS correctly', () => {
    const prevState = { updateNotificationsSettingsPending: true };
    const state = reducer(
      prevState,
      { type: USER_UPDATE_NOTIFICATIONS_SETTINGS_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateNotificationsSettingsPending).toBe(false);
  });

  it('handles action type USER_UPDATE_NOTIFICATIONS_SETTINGS_FAILURE correctly', () => {
    const prevState = { updateNotificationsSettingsPending: true };
    const state = reducer(
      prevState,
      { type: USER_UPDATE_NOTIFICATIONS_SETTINGS_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateNotificationsSettingsPending).toBe(false);
    expect(state.updateNotificationsSettingsError).toEqual(expect.anything());
  });

  it('handles action type USER_UPDATE_NOTIFICATIONS_SETTINGS_DISMISS_ERROR correctly', () => {
    const prevState = { updateNotificationsSettingsError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: USER_UPDATE_NOTIFICATIONS_SETTINGS_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateNotificationsSettingsError).toBe(null);
  });
});

