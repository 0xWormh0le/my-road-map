import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  DASHBOARD_FETCH_ROADMAPS_BEGIN,
  DASHBOARD_FETCH_ROADMAPS_SUCCESS,
  DASHBOARD_FETCH_ROADMAPS_FAILURE,
  DASHBOARD_FETCH_ROADMAPS_DISMISS_ERROR,
} from '../../../../src/features/dashboard/redux/constants';

import {
  fetchRoadmaps,
  dismissFetchRoadmapsError,
  reducer,
} from '../../../../src/features/dashboard/redux/fetchRoadmaps';

import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('dashboard/redux/fetchRoadmaps', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when fetchRoadmaps succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .get('/roadmaps/')
      .reply(200, { results: [] });

    return store.dispatch(fetchRoadmaps())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', DASHBOARD_FETCH_ROADMAPS_BEGIN);
        expect(actions[1]).toHaveProperty('type', DASHBOARD_FETCH_ROADMAPS_SUCCESS);
      });
  });

  it('dispatches failure action when fetchRoadmaps fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .get('/roadmaps/')
      .reply(500, {});

    return store.dispatch(fetchRoadmaps({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', DASHBOARD_FETCH_ROADMAPS_BEGIN);
        expect(actions[1]).toHaveProperty('type', DASHBOARD_FETCH_ROADMAPS_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissFetchRoadmapsError', () => {
    const expectedAction = {
      type: DASHBOARD_FETCH_ROADMAPS_DISMISS_ERROR,
    };
    expect(dismissFetchRoadmapsError()).toEqual(expectedAction);
  });

  it('handles action type DASHBOARD_FETCH_ROADMAPS_BEGIN correctly', () => {
    const prevState = { fetchRoadmapsPending: false };
    const state = reducer(
      prevState,
      { type: DASHBOARD_FETCH_ROADMAPS_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchRoadmapsPending).toBe(true);
  });

  it('handles action type DASHBOARD_FETCH_ROADMAPS_SUCCESS correctly', () => {
    const prevState = { fetchRoadmapsPending: true };
    const state = reducer(
      prevState,
      { type: DASHBOARD_FETCH_ROADMAPS_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchRoadmapsPending).toBe(false);
  });

  it('handles action type DASHBOARD_FETCH_ROADMAPS_FAILURE correctly', () => {
    const prevState = { fetchRoadmapsPending: true };
    const state = reducer(
      prevState,
      { type: DASHBOARD_FETCH_ROADMAPS_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchRoadmapsPending).toBe(false);
    expect(state.fetchRoadmapsError).toEqual(expect.anything());
  });

  it('handles action type DASHBOARD_FETCH_ROADMAPS_DISMISS_ERROR correctly', () => {
    const prevState = { fetchRoadmapsError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: DASHBOARD_FETCH_ROADMAPS_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchRoadmapsError).toBe(null);
  });
});

