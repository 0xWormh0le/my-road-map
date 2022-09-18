import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  ROADMAP_BULK_ASSIGN_ROADMAP_COACHES_BEGIN,
  ROADMAP_BULK_ASSIGN_ROADMAP_COACHES_SUCCESS,
  ROADMAP_BULK_ASSIGN_ROADMAP_COACHES_FAILURE,
  ROADMAP_BULK_ASSIGN_ROADMAP_COACHES_DISMISS_ERROR,
} from '../../../../src/features/roadmap/redux/constants';

import {
  bulkAssignRoadmapCoaches,
  dismissBulkAssignRoadmapCoachesError,
  reducer,
} from '../../../../src/features/roadmap/redux/bulkAssignRoadmapCoaches';
import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('roadmap/redux/bulkAssignRoadmapCoaches', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when bulkAssignRoadmapCoaches succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/roadmaps/1/assigned-coaches/bulk-assign/')
      .reply(200, {});

    return store.dispatch(bulkAssignRoadmapCoaches({ roadmapId: 1 }))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ROADMAP_BULK_ASSIGN_ROADMAP_COACHES_BEGIN);
        expect(actions[1]).toHaveProperty('type', ROADMAP_BULK_ASSIGN_ROADMAP_COACHES_SUCCESS);
      });
  });

  it('dispatches failure action when bulkAssignRoadmapCoaches fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/roadmaps/1/assigned-coaches/bulk-assign/')
      .reply(500, {});

    return store.dispatch(bulkAssignRoadmapCoaches({ roadmapId: 1 }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ROADMAP_BULK_ASSIGN_ROADMAP_COACHES_BEGIN);
        expect(actions[1]).toHaveProperty('type', ROADMAP_BULK_ASSIGN_ROADMAP_COACHES_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissBulkAssignRoadmapCoachesError', () => {
    const expectedAction = {
      type: ROADMAP_BULK_ASSIGN_ROADMAP_COACHES_DISMISS_ERROR,
    };
    expect(dismissBulkAssignRoadmapCoachesError()).toEqual(expectedAction);
  });

  it('handles action type ROADMAP_BULK_ASSIGN_ROADMAP_COACHES_BEGIN correctly', () => {
    const prevState = { bulkAssignRoadmapCoachesPending: false };
    const state = reducer(
      prevState,
      { type: ROADMAP_BULK_ASSIGN_ROADMAP_COACHES_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.bulkAssignRoadmapCoachesPending).toBe(true);
  });

  it('handles action type ROADMAP_BULK_ASSIGN_ROADMAP_COACHES_SUCCESS correctly', () => {
    const prevState = { bulkAssignRoadmapCoachesPending: true };
    const state = reducer(
      prevState,
      { type: ROADMAP_BULK_ASSIGN_ROADMAP_COACHES_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.bulkAssignRoadmapCoachesPending).toBe(false);
  });

  it('handles action type ROADMAP_BULK_ASSIGN_ROADMAP_COACHES_FAILURE correctly', () => {
    const prevState = { bulkAssignRoadmapCoachesPending: true };
    const state = reducer(
      prevState,
      { type: ROADMAP_BULK_ASSIGN_ROADMAP_COACHES_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.bulkAssignRoadmapCoachesPending).toBe(false);
    expect(state.bulkAssignRoadmapCoachesError).toEqual(expect.anything());
  });

  it('handles action type ROADMAP_BULK_ASSIGN_ROADMAP_COACHES_DISMISS_ERROR correctly', () => {
    const prevState = { bulkAssignRoadmapCoachesError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: ROADMAP_BULK_ASSIGN_ROADMAP_COACHES_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.bulkAssignRoadmapCoachesError).toBe(null);
  });
});

