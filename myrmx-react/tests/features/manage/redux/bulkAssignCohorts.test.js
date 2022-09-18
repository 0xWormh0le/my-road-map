import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MANAGE_BULK_ASSIGN_COHORTS_BEGIN,
  MANAGE_BULK_ASSIGN_COHORTS_SUCCESS,
  MANAGE_BULK_ASSIGN_COHORTS_FAILURE,
  MANAGE_BULK_ASSIGN_COHORTS_DISMISS_ERROR,
} from '../../../../src/features/manage/redux/constants';

import {
  bulkAssignCohorts,
  dismissBulkAssignCohortsError,
  reducer,
} from '../../../../src/features/manage/redux/bulkAssignCohorts';

import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('manage/redux/bulkAssignCohorts', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when bulkAssignCohorts succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/roadmaps/1/bulk-assign-cohorts/')
      .reply(200);

    return store.dispatch(bulkAssignCohorts({ roadmapId: 1, cohorts: [] }))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_BULK_ASSIGN_COHORTS_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_BULK_ASSIGN_COHORTS_SUCCESS);
      });
  });

  it('dispatches failure action when bulkAssignCohorts fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/roadmaps/1/bulk-assign-cohorts/')
      .reply(500, {});

    return store.dispatch(bulkAssignCohorts({ roadmapId: 1, cohorts: [] }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_BULK_ASSIGN_COHORTS_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_BULK_ASSIGN_COHORTS_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissBulkAssignCohortsError', () => {
    const expectedAction = {
      type: MANAGE_BULK_ASSIGN_COHORTS_DISMISS_ERROR,
    };
    expect(dismissBulkAssignCohortsError()).toEqual(expectedAction);
  });

  it('handles action type MANAGE_BULK_ASSIGN_COHORTS_BEGIN correctly', () => {
    const prevState = { bulkAssignCohortsPending: false };
    const state = reducer(
      prevState,
      { type: MANAGE_BULK_ASSIGN_COHORTS_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.bulkAssignCohortsPending).toBe(true);
  });

  it('handles action type MANAGE_BULK_ASSIGN_COHORTS_SUCCESS correctly', () => {
    const prevState = { bulkAssignCohortsPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_BULK_ASSIGN_COHORTS_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.bulkAssignCohortsPending).toBe(false);
  });

  it('handles action type MANAGE_BULK_ASSIGN_COHORTS_FAILURE correctly', () => {
    const prevState = { bulkAssignCohortsPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_BULK_ASSIGN_COHORTS_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.bulkAssignCohortsPending).toBe(false);
    expect(state.bulkAssignCohortsError).toEqual(expect.anything());
  });

  it('handles action type MANAGE_BULK_ASSIGN_COHORTS_DISMISS_ERROR correctly', () => {
    const prevState = { bulkAssignCohortsError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MANAGE_BULK_ASSIGN_COHORTS_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.bulkAssignCohortsError).toBe(null);
  });
});

