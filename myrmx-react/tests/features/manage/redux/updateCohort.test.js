import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MANAGE_UPDATE_COHORT_BEGIN,
  MANAGE_UPDATE_COHORT_SUCCESS,
  MANAGE_UPDATE_COHORT_FAILURE,
  MANAGE_UPDATE_COHORT_DISMISS_ERROR,
} from '../../../../src/features/manage/redux/constants';

import {
  updateCohort,
  dismissUpdateCohortError,
  reducer,
} from '../../../../src/features/manage/redux/updateCohort';
import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('manage/redux/updateCohort', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when updateCohort succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .patch('/cohorts/1/')
      .reply(200);

    return store.dispatch(updateCohort({ groupId: 1 }))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_UPDATE_COHORT_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_UPDATE_COHORT_SUCCESS);
      });
  });

  it('dispatches failure action when updateCohort fails', () => {
    const store = mockStore({});

    return store.dispatch(updateCohort({ groupId: 1 }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_UPDATE_COHORT_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_UPDATE_COHORT_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissUpdateCohortError', () => {
    const expectedAction = {
      type: MANAGE_UPDATE_COHORT_DISMISS_ERROR,
    };
    expect(dismissUpdateCohortError()).toEqual(expectedAction);
  });

  it('handles action type MANAGE_UPDATE_COHORT_BEGIN correctly', () => {
    const prevState = { updateCohortPending: false };
    const state = reducer(
      prevState,
      { type: MANAGE_UPDATE_COHORT_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateCohortPending).toBe(true);
  });

  it('handles action type MANAGE_UPDATE_COHORT_SUCCESS correctly', () => {
    const prevState = { updateCohortPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_UPDATE_COHORT_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateCohortPending).toBe(false);
  });

  it('handles action type MANAGE_UPDATE_COHORT_FAILURE correctly', () => {
    const prevState = { updateCohortPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_UPDATE_COHORT_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateCohortPending).toBe(false);
    expect(state.updateCohortError).toEqual(expect.anything());
  });

  it('handles action type MANAGE_UPDATE_COHORT_DISMISS_ERROR correctly', () => {
    const prevState = { updateCohortError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MANAGE_UPDATE_COHORT_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateCohortError).toBe(null);
  });
});

