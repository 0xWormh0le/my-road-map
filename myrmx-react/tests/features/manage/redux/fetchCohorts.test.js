import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MANAGE_FETCH_COHORTS_BEGIN,
  MANAGE_FETCH_COHORTS_SUCCESS,
  MANAGE_FETCH_COHORTS_FAILURE,
  MANAGE_FETCH_COHORTS_DISMISS_ERROR,
} from '../../../../src/features/manage/redux/constants';

import {
  fetchCohorts,
  dismissFetchCohortsError,
  reducer,
} from '../../../../src/features/manage/redux/fetchCohorts';
import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('manage/redux/fetchCohorts', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when fetchCohorts succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .get('/cohorts/')
      .reply(200);

    return store.dispatch(fetchCohorts())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_FETCH_COHORTS_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_FETCH_COHORTS_SUCCESS);
      });
  });

  it('dispatches failure action when fetchCohorts fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .get('/cohorts/')
      .reply(500, {});
      
    return store.dispatch(fetchCohorts({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_FETCH_COHORTS_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_FETCH_COHORTS_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissFetchCohortsError', () => {
    const expectedAction = {
      type: MANAGE_FETCH_COHORTS_DISMISS_ERROR,
    };
    expect(dismissFetchCohortsError()).toEqual(expectedAction);
  });

  it('handles action type MANAGE_FETCH_COHORTS_BEGIN correctly', () => {
    const prevState = { fetchCohortsPending: false };
    const state = reducer(
      prevState,
      { type: MANAGE_FETCH_COHORTS_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchCohortsPending).toBe(true);
  });

  it('handles action type MANAGE_FETCH_COHORTS_SUCCESS correctly', () => {
    const prevState = { fetchCohortsPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_FETCH_COHORTS_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchCohortsPending).toBe(false);
  });

  it('handles action type MANAGE_FETCH_COHORTS_FAILURE correctly', () => {
    const prevState = { fetchCohortsPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_FETCH_COHORTS_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchCohortsPending).toBe(false);
    expect(state.fetchCohortsError).toEqual(expect.anything());
  });

  it('handles action type MANAGE_FETCH_COHORTS_DISMISS_ERROR correctly', () => {
    const prevState = { fetchCohortsError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MANAGE_FETCH_COHORTS_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchCohortsError).toBe(null);
  });
});

