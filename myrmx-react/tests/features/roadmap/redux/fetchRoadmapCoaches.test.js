import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  ROADMAP_FETCH_ROADMAP_COACHES_BEGIN,
  ROADMAP_FETCH_ROADMAP_COACHES_SUCCESS,
  ROADMAP_FETCH_ROADMAP_COACHES_FAILURE,
  ROADMAP_FETCH_ROADMAP_COACHES_DISMISS_ERROR,
} from '../../../../src/features/roadmap/redux/constants';

import {
  fetchRoadmapCoaches,
  dismissFetchRoadmapCoachesError,
  reducer,
} from '../../../../src/features/roadmap/redux/fetchRoadmapCoaches';
import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('roadmap/redux/fetchRoadmapCoaches', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when fetchRoadmapCoaches succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .get('/roadmaps/1/assigned-coaches/')
      .reply(200, {});

    return store.dispatch(fetchRoadmapCoaches({ type: 'assigned', roadmapId: 1 }))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ROADMAP_FETCH_ROADMAP_COACHES_BEGIN);
        expect(actions[1]).toHaveProperty('type', ROADMAP_FETCH_ROADMAP_COACHES_SUCCESS);
      });
  });

  it('dispatches failure action when fetchRoadmapCoaches fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .get('/roadmaps/1/assigned-coaches/')
      .reply(500, {});

    return store.dispatch(fetchRoadmapCoaches({ type: 'assigned', roadmapId: 1 }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ROADMAP_FETCH_ROADMAP_COACHES_BEGIN);
        expect(actions[1]).toHaveProperty('type', ROADMAP_FETCH_ROADMAP_COACHES_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissFetchRoadmapCoachesError', () => {
    const expectedAction = {
      type: ROADMAP_FETCH_ROADMAP_COACHES_DISMISS_ERROR,
    };
    expect(dismissFetchRoadmapCoachesError()).toEqual(expectedAction);
  });

  it('handles action type ROADMAP_FETCH_ROADMAP_COACHES_BEGIN correctly', () => {
    const prevState = { fetchRoadmapCoachesPending: false };
    const state = reducer(
      prevState,
      { type: ROADMAP_FETCH_ROADMAP_COACHES_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchRoadmapCoachesPending).toBe(true);
  });

  it('handles action type ROADMAP_FETCH_ROADMAP_COACHES_SUCCESS correctly', () => {
    const prevState = { fetchRoadmapCoachesPending: true };
    const state = reducer(
      prevState,
      { type: ROADMAP_FETCH_ROADMAP_COACHES_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchRoadmapCoachesPending).toBe(false);
  });

  it('handles action type ROADMAP_FETCH_ROADMAP_COACHES_FAILURE correctly', () => {
    const prevState = { fetchRoadmapCoachesPending: true };
    const state = reducer(
      prevState,
      { type: ROADMAP_FETCH_ROADMAP_COACHES_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchRoadmapCoachesPending).toBe(false);
    expect(state.fetchRoadmapCoachesError).toEqual(expect.anything());
  });

  it('handles action type ROADMAP_FETCH_ROADMAP_COACHES_DISMISS_ERROR correctly', () => {
    const prevState = { fetchRoadmapCoachesError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: ROADMAP_FETCH_ROADMAP_COACHES_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchRoadmapCoachesError).toBe(null);
  });
});

