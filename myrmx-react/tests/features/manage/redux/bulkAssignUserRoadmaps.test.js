import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MANAGE_BULK_ASSIGN_USER_ROADMAPS_BEGIN,
  MANAGE_BULK_ASSIGN_USER_ROADMAPS_SUCCESS,
  MANAGE_BULK_ASSIGN_USER_ROADMAPS_FAILURE,
  MANAGE_BULK_ASSIGN_USER_ROADMAPS_DISMISS_ERROR,
} from '../../../../src/features/manage/redux/constants';

import {
  bulkAssignUserRoadmaps,
  dismissBulkAssignUserRoadmapsError,
  reducer,
} from '../../../../src/features/manage/redux/bulkAssignUserRoadmaps';
import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('manage/redux/bulkAssignUserRoadmaps', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when bulkAssignUserRoadmaps succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/users/1/assigned-roadmaps/bulk-assign/')
      .reply(200, {});

    return store.dispatch(bulkAssignUserRoadmaps({ userId: 1, ids: [] }))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_BULK_ASSIGN_USER_ROADMAPS_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_BULK_ASSIGN_USER_ROADMAPS_SUCCESS);
      });
  });

  it('dispatches failure action when bulkAssignUserRoadmaps fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/users/1/assigned-roadmaps/bulk-assign/')
      .reply(500, {});

    return store.dispatch(bulkAssignUserRoadmaps({ userId: 1, ids: [] }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_BULK_ASSIGN_USER_ROADMAPS_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_BULK_ASSIGN_USER_ROADMAPS_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissBulkAssignUserRoadmapsError', () => {
    const expectedAction = {
      type: MANAGE_BULK_ASSIGN_USER_ROADMAPS_DISMISS_ERROR,
    };
    expect(dismissBulkAssignUserRoadmapsError()).toEqual(expectedAction);
  });

  it('handles action type MANAGE_BULK_ASSIGN_USER_ROADMAPS_BEGIN correctly', () => {
    const prevState = { bulkAssignUserRoadmapsPending: false };
    const state = reducer(
      prevState,
      { type: MANAGE_BULK_ASSIGN_USER_ROADMAPS_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.bulkAssignUserRoadmapsPending).toBe(true);
  });

  it('handles action type MANAGE_BULK_ASSIGN_USER_ROADMAPS_SUCCESS correctly', () => {
    const prevState = { bulkAssignUserRoadmapsPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_BULK_ASSIGN_USER_ROADMAPS_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.bulkAssignUserRoadmapsPending).toBe(false);
  });

  it('handles action type MANAGE_BULK_ASSIGN_USER_ROADMAPS_FAILURE correctly', () => {
    const prevState = { bulkAssignUserRoadmapsPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_BULK_ASSIGN_USER_ROADMAPS_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.bulkAssignUserRoadmapsPending).toBe(false);
    expect(state.bulkAssignUserRoadmapsError).toEqual(expect.anything());
  });

  it('handles action type MANAGE_BULK_ASSIGN_USER_ROADMAPS_DISMISS_ERROR correctly', () => {
    const prevState = { bulkAssignUserRoadmapsError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MANAGE_BULK_ASSIGN_USER_ROADMAPS_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.bulkAssignUserRoadmapsError).toBe(null);
  });
});

