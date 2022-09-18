import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  ROADMAP_FETCH_COMPETENCY_GLOBAL_ACTION_ITEMS_BEGIN,
  ROADMAP_FETCH_COMPETENCY_GLOBAL_ACTION_ITEMS_SUCCESS,
  ROADMAP_FETCH_COMPETENCY_GLOBAL_ACTION_ITEMS_FAILURE,
  ROADMAP_FETCH_COMPETENCY_GLOBAL_ACTION_ITEMS_DISMISS_ERROR,
} from '../../../../src/features/roadmap/redux/constants';

import {
  fetchCompetencyGlobalActionItems,
  dismissFetchCompetencyGlobalActionItemsError,
  reducer,
} from '../../../../src/features/roadmap/redux/fetchCompetencyGlobalActionItems';

import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('roadmap/redux/fetchCompetencyGlobalActionItems', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when fetchCompetencyGlobalActionItems succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .get('/roadmaps/1/stages/1/competencies/1/global-action-items/')
      .reply(200);

    return store.dispatch(fetchCompetencyGlobalActionItems({ roadmapId: 1, stageId: 1, competencyId: 1 }))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ROADMAP_FETCH_COMPETENCY_GLOBAL_ACTION_ITEMS_BEGIN);
        expect(actions[1]).toHaveProperty('type', ROADMAP_FETCH_COMPETENCY_GLOBAL_ACTION_ITEMS_SUCCESS);
      });
  });

  it('dispatches failure action when fetchCompetencyGlobalActionItems fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .get('/roadmaps/1/stages/1/competencies/1/global-action-items/')
      .reply(500, {});

    return store.dispatch(fetchCompetencyGlobalActionItems({ roadmapId: 1, stageId: 1, competencyId: 1 }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ROADMAP_FETCH_COMPETENCY_GLOBAL_ACTION_ITEMS_BEGIN);
        expect(actions[1]).toHaveProperty('type', ROADMAP_FETCH_COMPETENCY_GLOBAL_ACTION_ITEMS_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissFetchCompetencyGlobalActionItemsError', () => {
    const expectedAction = {
      type: ROADMAP_FETCH_COMPETENCY_GLOBAL_ACTION_ITEMS_DISMISS_ERROR,
    };
    expect(dismissFetchCompetencyGlobalActionItemsError()).toEqual(expectedAction);
  });

  it('handles action type ROADMAP_FETCH_COMPETENCY_GLOBAL_ACTION_ITEMS_BEGIN correctly', () => {
    const prevState = { fetchCompetencyGlobalActionItemsPending: false };
    const state = reducer(
      prevState,
      { type: ROADMAP_FETCH_COMPETENCY_GLOBAL_ACTION_ITEMS_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchCompetencyGlobalActionItemsPending).toBe(true);
  });

  it('handles action type ROADMAP_FETCH_COMPETENCY_GLOBAL_ACTION_ITEMS_SUCCESS correctly', () => {
    const prevState = { fetchCompetencyGlobalActionItemsPending: true };
    const state = reducer(
      prevState,
      { type: ROADMAP_FETCH_COMPETENCY_GLOBAL_ACTION_ITEMS_SUCCESS, data: [] }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchCompetencyGlobalActionItemsPending).toBe(false);
  });

  it('handles action type ROADMAP_FETCH_COMPETENCY_GLOBAL_ACTION_ITEMS_FAILURE correctly', () => {
    const prevState = { fetchCompetencyGlobalActionItemsPending: true };
    const state = reducer(
      prevState,
      { type: ROADMAP_FETCH_COMPETENCY_GLOBAL_ACTION_ITEMS_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchCompetencyGlobalActionItemsPending).toBe(false);
    expect(state.fetchCompetencyGlobalActionItemsError).toEqual(expect.anything());
  });

  it('handles action type ROADMAP_FETCH_COMPETENCY_GLOBAL_ACTION_ITEMS_DISMISS_ERROR correctly', () => {
    const prevState = { fetchCompetencyGlobalActionItemsError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: ROADMAP_FETCH_COMPETENCY_GLOBAL_ACTION_ITEMS_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchCompetencyGlobalActionItemsError).toBe(null);
  });
});

