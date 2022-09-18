import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MANAGE_FETCH_COHORT_USERS_BEGIN,
  MANAGE_FETCH_COHORT_USERS_SUCCESS,
  MANAGE_FETCH_COHORT_USERS_FAILURE,
  MANAGE_FETCH_COHORT_USERS_DISMISS_ERROR,
} from '../../../../src/features/manage/redux/constants';

import {
  fetchCohortUsers,
  dismissFetchCohortUsersError,
  reducer,
} from '../../../../src/features/manage/redux/fetchCohortUsers';
import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('manage/redux/fetchCohortUsers', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when fetchCohortUsers succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .get('/cohorts/1/users/')
      .reply(200);

    return store.dispatch(fetchCohortUsers({ cohortId: 1 }))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_FETCH_COHORT_USERS_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_FETCH_COHORT_USERS_SUCCESS);
      });
  });

  it('dispatches failure action when fetchCohortUsers fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .get('/cohorts/1/users/')
      .reply(500);

    return store.dispatch(fetchCohortUsers({ cohortId: 1 }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_FETCH_COHORT_USERS_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_FETCH_COHORT_USERS_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissFetchCohortUsersError', () => {
    const expectedAction = {
      type: MANAGE_FETCH_COHORT_USERS_DISMISS_ERROR,
    };
    expect(dismissFetchCohortUsersError()).toEqual(expectedAction);
  });

  it('handles action type MANAGE_FETCH_COHORT_USERS_BEGIN correctly', () => {
    const prevState = { fetchCohortUsersPending: false };
    const state = reducer(
      prevState,
      { type: MANAGE_FETCH_COHORT_USERS_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchCohortUsersPending).toBe(true);
  });

  it('handles action type MANAGE_FETCH_COHORT_USERS_SUCCESS correctly', () => {
    const prevState = { fetchCohortUsersPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_FETCH_COHORT_USERS_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchCohortUsersPending).toBe(false);
  });

  it('handles action type MANAGE_FETCH_COHORT_USERS_FAILURE correctly', () => {
    const prevState = { fetchCohortUsersPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_FETCH_COHORT_USERS_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchCohortUsersPending).toBe(false);
    expect(state.fetchCohortUsersError).toEqual(expect.anything());
  });

  it('handles action type MANAGE_FETCH_COHORT_USERS_DISMISS_ERROR correctly', () => {
    const prevState = { fetchCohortUsersError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MANAGE_FETCH_COHORT_USERS_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchCohortUsersError).toBe(null);
  });
});

