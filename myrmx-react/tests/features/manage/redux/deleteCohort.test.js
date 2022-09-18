import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MANAGE_DELETE_COHORT_BEGIN,
  MANAGE_DELETE_COHORT_SUCCESS,
  MANAGE_DELETE_COHORT_FAILURE,
  MANAGE_DELETE_COHORT_DISMISS_ERROR,
} from '../../../../src/features/manage/redux/constants';

import {
  deleteCohort,
  dismissDeleteCohortError,
  reducer,
} from '../../../../src/features/manage/redux/deleteCohort';
import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('manage/redux/deleteCohort', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when deleteCohort succeeds', () => {
    const store = mockStore({
      cohorts: []
    });

    nock(config.apiRootUrl)
      .delete('/cohorts/1/')
      .reply(200);
    return store.dispatch(deleteCohort({ cohortId: 1 }))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_DELETE_COHORT_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_DELETE_COHORT_SUCCESS);
      });
  });

  it('dispatches failure action when deleteCohort fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .delete('/cohorts/1')
      .reply(500);

    return store.dispatch(deleteCohort({ cohortId: 1 }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_DELETE_COHORT_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_DELETE_COHORT_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissDeleteCohortError', () => {
    const expectedAction = {
      type: MANAGE_DELETE_COHORT_DISMISS_ERROR,
    };
    expect(dismissDeleteCohortError()).toEqual(expectedAction);
  });

  it('handles action type MANAGE_DELETE_COHORT_BEGIN correctly', () => {
    const prevState = { deleteCohortPending: false };
    const state = reducer(
      prevState,
      { type: MANAGE_DELETE_COHORT_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteCohortPending).toBe(true);
  });

  it('handles action type MANAGE_DELETE_COHORT_SUCCESS correctly', () => {
    const prevState = { deleteCohortPending: true, cohorts: [] };
    const state = reducer(
      prevState,
      { type: MANAGE_DELETE_COHORT_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteCohortPending).toBe(false);
  });

  it('handles action type MANAGE_DELETE_COHORT_FAILURE correctly', () => {
    const prevState = { deleteCohortPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_DELETE_COHORT_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteCohortPending).toBe(false);
    expect(state.deleteCohortError).toEqual(expect.anything());
  });

  it('handles action type MANAGE_DELETE_COHORT_DISMISS_ERROR correctly', () => {
    const prevState = { deleteCohortError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MANAGE_DELETE_COHORT_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteCohortError).toBe(null);
  });
});

