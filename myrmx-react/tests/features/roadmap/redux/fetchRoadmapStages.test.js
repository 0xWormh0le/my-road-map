import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  ROADMAP_FETCH_ROADMAP_STAGES_BEGIN,
  ROADMAP_FETCH_ROADMAP_STAGES_SUCCESS,
  ROADMAP_FETCH_ROADMAP_STAGES_FAILURE,
  ROADMAP_FETCH_ROADMAP_STAGES_DISMISS_ERROR,
} from '../../../../src/features/roadmap/redux/constants';

import {
  fetchRoadmapStages,
  dismissFetchRoadmapStagesError,
  reducer,
} from '../../../../src/features/roadmap/redux/fetchRoadmapStages';

import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('roadmap/redux/fetchRoadmapStages', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when fetchRoadmapStages succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .get('/roadmaps/1/stages/')
      .reply(200, {});

    return store.dispatch(fetchRoadmapStages({ roadmapId: 1 }))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ROADMAP_FETCH_ROADMAP_STAGES_BEGIN);
        expect(actions[1]).toHaveProperty('type', ROADMAP_FETCH_ROADMAP_STAGES_SUCCESS);
      });
  });

  it('dispatches failure action when fetchRoadmapStages fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .get('/roadmaps/1/stages/')
      .reply(500, {});

    return store.dispatch(fetchRoadmapStages({ roadmapId: 1, error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ROADMAP_FETCH_ROADMAP_STAGES_BEGIN);
        expect(actions[1]).toHaveProperty('type', ROADMAP_FETCH_ROADMAP_STAGES_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissFetchRoadmapStagesError', () => {
    const expectedAction = {
      type: ROADMAP_FETCH_ROADMAP_STAGES_DISMISS_ERROR,
    };
    expect(dismissFetchRoadmapStagesError()).toEqual(expectedAction);
  });

  it('handles action type ROADMAP_FETCH_ROADMAP_STAGES_BEGIN correctly', () => {
    const prevState = { fetchRoadmapStagesPending: false };
    const state = reducer(
      prevState,
      { type: ROADMAP_FETCH_ROADMAP_STAGES_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchRoadmapStagesPending).toBe(true);
  });

  it('handles action type ROADMAP_FETCH_ROADMAP_STAGES_SUCCESS correctly', () => {
    const prevState = { fetchRoadmapStagesPending: true };
    const state = reducer(
      prevState,
      { type: ROADMAP_FETCH_ROADMAP_STAGES_SUCCESS, data: [] }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchRoadmapStagesPending).toBe(false);
  });

  it('handles action type ROADMAP_FETCH_ROADMAP_STAGES_FAILURE correctly', () => {
    const prevState = { fetchRoadmapStagesPending: true };
    const state = reducer(
      prevState,
      { type: ROADMAP_FETCH_ROADMAP_STAGES_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchRoadmapStagesPending).toBe(false);
    expect(state.fetchRoadmapStagesError).toEqual(expect.anything());
  });

  it('handles action type ROADMAP_FETCH_ROADMAP_STAGES_DISMISS_ERROR correctly', () => {
    const prevState = { fetchRoadmapStagesError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: ROADMAP_FETCH_ROADMAP_STAGES_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchRoadmapStagesError).toBe(null);
  });
});

