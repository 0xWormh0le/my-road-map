import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  USER_BULK_SWITCH_NOTIFICATIONS_SETTINGS_BEGIN,
  USER_BULK_SWITCH_NOTIFICATIONS_SETTINGS_SUCCESS,
  USER_BULK_SWITCH_NOTIFICATIONS_SETTINGS_FAILURE,
  USER_BULK_SWITCH_NOTIFICATIONS_SETTINGS_DISMISS_ERROR,
} from '../../../../src/features/user/redux/constants';

import {
  bulkSwitchNotificationsSettings,
  dismissBulkSwitchNotificationsSettingsError,
  reducer,
} from '../../../../src/features/user/redux/bulkSwitchNotificationsSettings';
import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('user/redux/bulkSwitchNotificationsSettings', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when bulkSwitchNotificationsSettings succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/notifications-settings/bulk-switch/')
      .reply(200);

    return store.dispatch(bulkSwitchNotificationsSettings())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', USER_BULK_SWITCH_NOTIFICATIONS_SETTINGS_BEGIN);
        expect(actions[1]).toHaveProperty('type', USER_BULK_SWITCH_NOTIFICATIONS_SETTINGS_SUCCESS);
      });
  });

  it('dispatches failure action when bulkSwitchNotificationsSettings fails', () => {
    const store = mockStore({});

    return store.dispatch(bulkSwitchNotificationsSettings({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', USER_BULK_SWITCH_NOTIFICATIONS_SETTINGS_BEGIN);
        expect(actions[1]).toHaveProperty('type', USER_BULK_SWITCH_NOTIFICATIONS_SETTINGS_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissBulkSwitchNotificationsSettingsError', () => {
    const expectedAction = {
      type: USER_BULK_SWITCH_NOTIFICATIONS_SETTINGS_DISMISS_ERROR,
    };
    expect(dismissBulkSwitchNotificationsSettingsError()).toEqual(expectedAction);
  });

  it('handles action type USER_BULK_SWITCH_NOTIFICATIONS_SETTINGS_BEGIN correctly', () => {
    const prevState = { bulkSwitchNotificationsSettingsPending: false };
    const state = reducer(
      prevState,
      { type: USER_BULK_SWITCH_NOTIFICATIONS_SETTINGS_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.bulkSwitchNotificationsSettingsPending).toBe(true);
  });

  it('handles action type USER_BULK_SWITCH_NOTIFICATIONS_SETTINGS_SUCCESS correctly', () => {
    const prevState = { bulkSwitchNotificationsSettingsPending: true };
    const state = reducer(
      prevState,
      { type: USER_BULK_SWITCH_NOTIFICATIONS_SETTINGS_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.bulkSwitchNotificationsSettingsPending).toBe(false);
  });

  it('handles action type USER_BULK_SWITCH_NOTIFICATIONS_SETTINGS_FAILURE correctly', () => {
    const prevState = { bulkSwitchNotificationsSettingsPending: true };
    const state = reducer(
      prevState,
      { type: USER_BULK_SWITCH_NOTIFICATIONS_SETTINGS_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.bulkSwitchNotificationsSettingsPending).toBe(false);
    expect(state.bulkSwitchNotificationsSettingsError).toEqual(expect.anything());
  });

  it('handles action type USER_BULK_SWITCH_NOTIFICATIONS_SETTINGS_DISMISS_ERROR correctly', () => {
    const prevState = { bulkSwitchNotificationsSettingsError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: USER_BULK_SWITCH_NOTIFICATIONS_SETTINGS_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.bulkSwitchNotificationsSettingsError).toBe(null);
  });
});

