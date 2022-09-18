import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  ROADMAP_FETCH_ROADMAP_BEGIN,
  ROADMAP_FETCH_ROADMAP_SUCCESS,
  ROADMAP_FETCH_ROADMAP_FAILURE,
  ROADMAP_FETCH_ROADMAP_DISMISS_ERROR,
} from '../../../../src/features/roadmap/redux/constants';

import {
  fetchRoadmap,
  dismissFetchRoadmapError,
  reducer,
} from '../../../../src/features/roadmap/redux/fetchRoadmap';

import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('roadmap/redux/fetchRoadmap', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when fetchRoadmap succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .get('/roadmaps/1/')
      .reply(200, {});

    return store.dispatch(fetchRoadmap({ roadmapId: 1 }))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ROADMAP_FETCH_ROADMAP_BEGIN);
        expect(actions[1]).toHaveProperty('type', ROADMAP_FETCH_ROADMAP_SUCCESS);
      });
  });

  it('dispatches failure action when fetchRoadmap fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .get('/roadmaps/1/')
      .reply(500, {});

    return store.dispatch(fetchRoadmap({ roadmapId: 1, error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ROADMAP_FETCH_ROADMAP_BEGIN);
        expect(actions[1]).toHaveProperty('type', ROADMAP_FETCH_ROADMAP_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissFetchRoadmapError', () => {
    const expectedAction = {
      type: ROADMAP_FETCH_ROADMAP_DISMISS_ERROR,
    };
    expect(dismissFetchRoadmapError()).toEqual(expectedAction);
  });

  it('handles action type ROADMAP_FETCH_ROADMAP_BEGIN correctly', () => {
    const prevState = { fetchRoadmapPending: false };
    const state = reducer(
      prevState,
      { type: ROADMAP_FETCH_ROADMAP_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchRoadmapPending).toBe(true);
  });

  it('handles action type ROADMAP_FETCH_ROADMAP_SUCCESS correctly', () => {
    const prevState = { fetchRoadmapPending: true };
    const state = reducer(
      prevState,
      { type: ROADMAP_FETCH_ROADMAP_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchRoadmapPending).toBe(false);
  });

  it('handles action type ROADMAP_FETCH_ROADMAP_FAILURE correctly', () => {
    const prevState = { fetchRoadmapPending: true };
    const state = reducer(
      prevState,
      { type: ROADMAP_FETCH_ROADMAP_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchRoadmapPending).toBe(false);
    expect(state.fetchRoadmapError).toEqual(expect.anything());
  });

  it('handles action type ROADMAP_FETCH_ROADMAP_DISMISS_ERROR correctly', () => {
    const prevState = { fetchRoadmapError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: ROADMAP_FETCH_ROADMAP_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchRoadmapError).toBe(null);
  });
});

