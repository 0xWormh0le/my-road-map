import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MANAGE_ADD_COHORT_BEGIN,
  MANAGE_ADD_COHORT_SUCCESS,
  MANAGE_ADD_COHORT_FAILURE,
  MANAGE_ADD_COHORT_DISMISS_ERROR,
} from '../../../../src/features/manage/redux/constants';

import {
  addCohort,
  dismissAddCohortError,
  reducer,
} from '../../../../src/features/manage/redux/addCohort';
import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('manage/redux/addCohort', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when addCohort succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/cohorts/')
      .reply(201);

    return store.dispatch(addCohort())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_ADD_COHORT_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_ADD_COHORT_SUCCESS);
      });
  });

  it('dispatches failure action when addCohort fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/cohorts/')
      .reply(500);
    return store.dispatch(addCohort({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_ADD_COHORT_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_ADD_COHORT_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissAddCohortError', () => {
    const expectedAction = {
      type: MANAGE_ADD_COHORT_DISMISS_ERROR,
    };
    expect(dismissAddCohortError()).toEqual(expectedAction);
  });

  it('handles action type MANAGE_ADD_COHORT_BEGIN correctly', () => {
    const prevState = { addCohortPending: false };
    const state = reducer(
      prevState,
      { type: MANAGE_ADD_COHORT_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addCohortPending).toBe(true);
  });

  it('handles action type MANAGE_ADD_COHORT_SUCCESS correctly', () => {
    const prevState = { addCohortPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_ADD_COHORT_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addCohortPending).toBe(false);
  });

  it('handles action type MANAGE_ADD_COHORT_FAILURE correctly', () => {
    const prevState = { addCohortPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_ADD_COHORT_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addCohortPending).toBe(false);
    expect(state.addCohortError).toEqual(expect.anything());
  });

  it('handles action type MANAGE_ADD_COHORT_DISMISS_ERROR correctly', () => {
    const prevState = { addCohortError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MANAGE_ADD_COHORT_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addCohortError).toBe(null);
  });
});

