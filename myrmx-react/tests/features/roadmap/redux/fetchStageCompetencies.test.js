import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  ROADMAP_FETCH_STAGE_COMPETENCIES_BEGIN,
  ROADMAP_FETCH_STAGE_COMPETENCIES_SUCCESS,
  ROADMAP_FETCH_STAGE_COMPETENCIES_FAILURE,
  ROADMAP_FETCH_STAGE_COMPETENCIES_DISMISS_ERROR,
} from '../../../../src/features/roadmap/redux/constants';

import {
  fetchStageCompetencies,
  dismissFetchStageCompetenciesError,
  reducer,
} from '../../../../src/features/roadmap/redux/fetchStageCompetencies';

import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('roadmap/redux/fetchStageCompetencies', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when fetchStageCompetencies succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .get('/roadmaps/1/stages/1/competencies/')
      .reply(200, {});

    return store.dispatch(fetchStageCompetencies({ roadmapId: 1, stageId: 1 })).then(() => {
      const actions = store.getActions();
      expect(actions[0]).toHaveProperty('type', ROADMAP_FETCH_STAGE_COMPETENCIES_BEGIN);
      expect(actions[1]).toHaveProperty('type', ROADMAP_FETCH_STAGE_COMPETENCIES_SUCCESS);
    });
  });

  it('dispatches failure action when fetchStageCompetencies fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .get('/roadmaps/1/stages/1/competencies/')
      .reply(500, {});

    return store.dispatch(fetchStageCompetencies({ roadmapId: 1, stageId: 1})).catch(() => {
      const actions = store.getActions();
      expect(actions[0]).toHaveProperty('type', ROADMAP_FETCH_STAGE_COMPETENCIES_BEGIN);
      expect(actions[1]).toHaveProperty('type', ROADMAP_FETCH_STAGE_COMPETENCIES_FAILURE);
      expect(actions[1]).toHaveProperty('data.error', expect.anything());
    });
  });

  it('returns correct action by dismissFetchStageCompetenciesError', () => {
    const expectedAction = {
      type: ROADMAP_FETCH_STAGE_COMPETENCIES_DISMISS_ERROR,
    };
    expect(dismissFetchStageCompetenciesError()).toEqual(expectedAction);
  });

  it('handles action type ROADMAP_FETCH_STAGE_COMPETENCIES_BEGIN correctly', () => {
    const prevState = { fetchStageCompetenciesPending: false };
    const state = reducer(prevState, { type: ROADMAP_FETCH_STAGE_COMPETENCIES_BEGIN });
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchStageCompetenciesPending).toBe(true);
  });

  it('handles action type ROADMAP_FETCH_STAGE_COMPETENCIES_SUCCESS correctly', () => {
    const prevState = { fetchStageCompetenciesPending: true };
    const state = reducer(prevState, {
      type: ROADMAP_FETCH_STAGE_COMPETENCIES_SUCCESS,
      data: [],
    });
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchStageCompetenciesPending).toBe(false);
  });

  it('handles action type ROADMAP_FETCH_STAGE_COMPETENCIES_FAILURE correctly', () => {
    const prevState = { fetchStageCompetenciesPending: true };
    const state = reducer(prevState, {
      type: ROADMAP_FETCH_STAGE_COMPETENCIES_FAILURE,
      data: { error: new Error('some error') },
    });
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchStageCompetenciesPending).toBe(false);
    expect(state.fetchStageCompetenciesError).toEqual(expect.anything());
  });

  it('handles action type ROADMAP_FETCH_STAGE_COMPETENCIES_DISMISS_ERROR correctly', () => {
    const prevState = { fetchStageCompetenciesError: new Error('some error') };
    const state = reducer(prevState, { type: ROADMAP_FETCH_STAGE_COMPETENCIES_DISMISS_ERROR });
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchStageCompetenciesError).toBe(null);
  });
});
