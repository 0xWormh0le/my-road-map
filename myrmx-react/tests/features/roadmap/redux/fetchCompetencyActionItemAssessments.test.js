import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  ROADMAP_FETCH_COMPETENCY_ACTION_ITEM_ASSESSMENTS_BEGIN,
  ROADMAP_FETCH_COMPETENCY_ACTION_ITEM_ASSESSMENTS_SUCCESS,
  ROADMAP_FETCH_COMPETENCY_ACTION_ITEM_ASSESSMENTS_FAILURE,
  ROADMAP_FETCH_COMPETENCY_ACTION_ITEM_ASSESSMENTS_DISMISS_ERROR,
} from '../../../../src/features/roadmap/redux/constants';

import {
  fetchCompetencyActionItemAssessments,
  dismissFetchCompetencyActionItemAssessmentsError,
  reducer,
} from '../../../../src/features/roadmap/redux/fetchCompetencyActionItemAssessments';

import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('roadmap/redux/fetchCompetencyActionItemAssessments', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when fetchCompetencyActionItemAssessments succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .get('/roadmaps/1/stages/1/competencies/1/action-item-assessments/')
      .reply(200, {});

    return store.dispatch(fetchCompetencyActionItemAssessments({ roadmapId: 1, stageId: 1, competencyId: 1 }))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ROADMAP_FETCH_COMPETENCY_ACTION_ITEM_ASSESSMENTS_BEGIN);
        expect(actions[1]).toHaveProperty('type', ROADMAP_FETCH_COMPETENCY_ACTION_ITEM_ASSESSMENTS_SUCCESS);
      });
  });

  it('dispatches failure action when fetchCompetencyActionItemAssessments fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .get('/roadmaps/1/stages/1/competencies/1/action-item-assessments/')
      .reply(500, {});

    return store.dispatch(fetchCompetencyActionItemAssessments({ error: true, roadmapId: 1, stageId: 1, competencyId: 1 }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ROADMAP_FETCH_COMPETENCY_ACTION_ITEM_ASSESSMENTS_BEGIN);
        expect(actions[1]).toHaveProperty('type', ROADMAP_FETCH_COMPETENCY_ACTION_ITEM_ASSESSMENTS_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissFetchCompetencyActionItemAssessmentsError', () => {
    const expectedAction = {
      type: ROADMAP_FETCH_COMPETENCY_ACTION_ITEM_ASSESSMENTS_DISMISS_ERROR,
    };
    expect(dismissFetchCompetencyActionItemAssessmentsError()).toEqual(expectedAction);
  });

  it('handles action type ROADMAP_FETCH_COMPETENCY_ACTION_ITEM_ASSESSMENTS_BEGIN correctly', () => {
    const prevState = { fetchCompetencyActionItemAssessmentsPending: false };
    const state = reducer(
      prevState,
      { type: ROADMAP_FETCH_COMPETENCY_ACTION_ITEM_ASSESSMENTS_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchCompetencyActionItemAssessmentsPending).toBe(true);
  });

  it('handles action type ROADMAP_FETCH_COMPETENCY_ACTION_ITEM_ASSESSMENTS_SUCCESS correctly', () => {
    const prevState = { fetchCompetencyActionItemAssessmentsPending: true };
    const state = reducer(
      prevState,
      { type: ROADMAP_FETCH_COMPETENCY_ACTION_ITEM_ASSESSMENTS_SUCCESS, data: [] }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchCompetencyActionItemAssessmentsPending).toBe(false);
  });

  it('handles action type ROADMAP_FETCH_COMPETENCY_ACTION_ITEM_ASSESSMENTS_FAILURE correctly', () => {
    const prevState = { fetchCompetencyActionItemAssessmentsPending: true };
    const state = reducer(
      prevState,
      { type: ROADMAP_FETCH_COMPETENCY_ACTION_ITEM_ASSESSMENTS_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchCompetencyActionItemAssessmentsPending).toBe(false);
    expect(state.fetchCompetencyActionItemAssessmentsError).toEqual(expect.anything());
  });

  it('handles action type ROADMAP_FETCH_COMPETENCY_ACTION_ITEM_ASSESSMENTS_DISMISS_ERROR correctly', () => {
    const prevState = { fetchCompetencyActionItemAssessmentsError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: ROADMAP_FETCH_COMPETENCY_ACTION_ITEM_ASSESSMENTS_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchCompetencyActionItemAssessmentsError).toBe(null);
  });
});

