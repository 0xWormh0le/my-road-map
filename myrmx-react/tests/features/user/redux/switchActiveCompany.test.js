import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  USER_SWITCH_ACTIVE_COMPANY_BEGIN,
  USER_SWITCH_ACTIVE_COMPANY_SUCCESS,
  USER_SWITCH_ACTIVE_COMPANY_FAILURE,
  USER_SWITCH_ACTIVE_COMPANY_DISMISS_ERROR,
} from '../../../../src/features/user/redux/constants';

import {
  switchActiveCompany,
  dismissSwitchActiveCompanyError,
  reducer,
} from '../../../../src/features/user/redux/switchActiveCompany';
import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('user/redux/switchActiveCompany', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when switchActiveCompany succeeds', () => {
    const store = mockStore({});
    
    nock(config.apiRootUrl)
      .post('/choose-active-company/')
      .reply(200);

    return store.dispatch(switchActiveCompany({companyId: 1}))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', USER_SWITCH_ACTIVE_COMPANY_BEGIN);
        expect(actions[1]).toHaveProperty('type', USER_SWITCH_ACTIVE_COMPANY_SUCCESS);
      });
  });

  it('dispatches failure action when switchActiveCompany fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/choose-active-company/')
      .reply(500, {});
      
    return store.dispatch(switchActiveCompany({ error: true, companyId: 1 }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', USER_SWITCH_ACTIVE_COMPANY_BEGIN);
        expect(actions[1]).toHaveProperty('type', USER_SWITCH_ACTIVE_COMPANY_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissSwitchActiveCompanyError', () => {
    const expectedAction = {
      type: USER_SWITCH_ACTIVE_COMPANY_DISMISS_ERROR,
    };
    expect(dismissSwitchActiveCompanyError()).toEqual(expectedAction);
  });

  it('handles action type USER_SWITCH_ACTIVE_COMPANY_BEGIN correctly', () => {
    const prevState = { switchActiveCompanyPending: false };
    const state = reducer(
      prevState,
      { type: USER_SWITCH_ACTIVE_COMPANY_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.switchActiveCompanyPending).toBe(true);
  });

  it('handles action type USER_SWITCH_ACTIVE_COMPANY_SUCCESS correctly', () => {
    const prevState = {
      switchActiveCompanyPending: true,
      user: {
        company_id: 1,
        company_name: 'Test Company1',
        all_companies: [
          {
            id: 1,
            name: 'Test Company1'
          },
          {
            id: 2,
            name: 'Test Company2'
          }
        ]
      }
    };
    const state = reducer(
      prevState,
      { type: USER_SWITCH_ACTIVE_COMPANY_SUCCESS, data: 1 }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.switchActiveCompanyPending).toBe(false);
  });

  it('handles action type USER_SWITCH_ACTIVE_COMPANY_FAILURE correctly', () => {
    const prevState = { switchActiveCompanyPending: true };
    const state = reducer(
      prevState,
      { type: USER_SWITCH_ACTIVE_COMPANY_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.switchActiveCompanyPending).toBe(false);
    expect(state.switchActiveCompanyError).toEqual(expect.anything());
  });

  it('handles action type USER_SWITCH_ACTIVE_COMPANY_DISMISS_ERROR correctly', () => {
    const prevState = { switchActiveCompanyError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: USER_SWITCH_ACTIVE_COMPANY_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.switchActiveCompanyError).toBe(null);
  });
});

