import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  USER_FETCH_NOTIFICATIONS_SETTINGS_BEGIN,
  USER_FETCH_NOTIFICATIONS_SETTINGS_SUCCESS,
  USER_FETCH_NOTIFICATIONS_SETTINGS_FAILURE,
  USER_FETCH_NOTIFICATIONS_SETTINGS_DISMISS_ERROR,
} from '../../../../src/features/user/redux/constants';

import {
  fetchNotificationsSettings,
  dismissFetchNotificationsSettingsError,
  reducer,
} from '../../../../src/features/user/redux/fetchNotificationsSettings';
import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('user/redux/fetchNotificationsSettings', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when fetchNotificationsSettings succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .get('/notifications-settings/?delivery_type=1')
      .reply(200, []);

    return store.dispatch(fetchNotificationsSettings({deliveryType: 1}))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', USER_FETCH_NOTIFICATIONS_SETTINGS_BEGIN);
        expect(actions[1]).toHaveProperty('type', USER_FETCH_NOTIFICATIONS_SETTINGS_SUCCESS);
      });
  });

  it('dispatches failure action when fetchNotificationsSettings fails', () => {
    const store = mockStore({});

    return store.dispatch(fetchNotificationsSettings({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', USER_FETCH_NOTIFICATIONS_SETTINGS_BEGIN);
        expect(actions[1]).toHaveProperty('type', USER_FETCH_NOTIFICATIONS_SETTINGS_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissFetchNotificationsSettingsError', () => {
    const expectedAction = {
      type: USER_FETCH_NOTIFICATIONS_SETTINGS_DISMISS_ERROR,
    };
    expect(dismissFetchNotificationsSettingsError()).toEqual(expectedAction);
  });

  it('handles action type USER_FETCH_NOTIFICATIONS_SETTINGS_BEGIN correctly', () => {
    const prevState = { fetchNotificationsSettingsPending: false };
    const state = reducer(
      prevState,
      { type: USER_FETCH_NOTIFICATIONS_SETTINGS_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchNotificationsSettingsPending).toBe(true);
  });

  it('handles action type USER_FETCH_NOTIFICATIONS_SETTINGS_SUCCESS correctly', () => {
    const prevState = { fetchNotificationsSettingsPending: true };
    const state = reducer(
      prevState,
      { type: USER_FETCH_NOTIFICATIONS_SETTINGS_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchNotificationsSettingsPending).toBe(false);
  });

  it('handles action type USER_FETCH_NOTIFICATIONS_SETTINGS_FAILURE correctly', () => {
    const prevState = { fetchNotificationsSettingsPending: true };
    const state = reducer(
      prevState,
      { type: USER_FETCH_NOTIFICATIONS_SETTINGS_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchNotificationsSettingsPending).toBe(false);
    expect(state.fetchNotificationsSettingsError).toEqual(expect.anything());
  });

  it('handles action type USER_FETCH_NOTIFICATIONS_SETTINGS_DISMISS_ERROR correctly', () => {
    const prevState = { fetchNotificationsSettingsError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: USER_FETCH_NOTIFICATIONS_SETTINGS_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchNotificationsSettingsError).toBe(null);
  });
});

