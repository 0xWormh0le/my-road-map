import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  ROADMAP_FETCH_COMPETENCY_ASSESSMENTS_BEGIN,
  ROADMAP_FETCH_COMPETENCY_ASSESSMENTS_SUCCESS,
  ROADMAP_FETCH_COMPETENCY_ASSESSMENTS_FAILURE,
  ROADMAP_FETCH_COMPETENCY_ASSESSMENTS_DISMISS_ERROR,
} from '../../../../src/features/roadmap/redux/constants';

import {
  fetchCompetencyAssessments,
  dismissFetchCompetencyAssessmentsError,
  reducer,
} from '../../../../src/features/roadmap/redux/fetchCompetencyAssessments';

import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('roadmap/redux/fetchCompetencyAssessments', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when fetchCompetencyAssessments succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .get('/roadmaps/1/stages/1/competencies/1/assessments/?ordering=-pk&student=22')
      .reply(200, {});

    return store.dispatch(fetchCompetencyAssessments({ roadmapId: 1, stageId: 1, competencyId: 1, student: 22 }))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ROADMAP_FETCH_COMPETENCY_ASSESSMENTS_BEGIN);
        expect(actions[1]).toHaveProperty('type', ROADMAP_FETCH_COMPETENCY_ASSESSMENTS_SUCCESS);
      });
  });

  it('dispatches failure action when fetchCompetencyAssessments fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .get('/roadmaps/1/stages/1/competencies/1/assessments/?ordering=-pk&student=22')
      .reply(500, {});

    return store.dispatch(fetchCompetencyAssessments({ roadmapId: 1, stageId: 1, competencyId: 1, student: 22 }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ROADMAP_FETCH_COMPETENCY_ASSESSMENTS_BEGIN);
        expect(actions[1]).toHaveProperty('type', ROADMAP_FETCH_COMPETENCY_ASSESSMENTS_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissFetchCompetencyAssessmentsError', () => {
    const expectedAction = {
      type: ROADMAP_FETCH_COMPETENCY_ASSESSMENTS_DISMISS_ERROR,
    };
    expect(dismissFetchCompetencyAssessmentsError()).toEqual(expectedAction);
  });

  it('handles action type ROADMAP_FETCH_COMPETENCY_ASSESSMENTS_BEGIN correctly', () => {
    const prevState = { fetchCompetencyAssessmentsPending: false };
    const state = reducer(
      prevState,
      { type: ROADMAP_FETCH_COMPETENCY_ASSESSMENTS_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchCompetencyAssessmentsPending).toBe(true);
  });

  it('handles action type ROADMAP_FETCH_COMPETENCY_ASSESSMENTS_SUCCESS correctly', () => {
    const prevState = { fetchCompetencyAssessmentsPending: true };
    const state = reducer(
      prevState,
      { type: ROADMAP_FETCH_COMPETENCY_ASSESSMENTS_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchCompetencyAssessmentsPending).toBe(false);
  });

  it('handles action type ROADMAP_FETCH_COMPETENCY_ASSESSMENTS_FAILURE correctly', () => {
    const prevState = { fetchCompetencyAssessmentsPending: true };
    const state = reducer(
      prevState,
      { type: ROADMAP_FETCH_COMPETENCY_ASSESSMENTS_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchCompetencyAssessmentsPending).toBe(false);
    expect(state.fetchCompetencyAssessmentsError).toEqual(expect.anything());
  });

  it('handles action type ROADMAP_FETCH_COMPETENCY_ASSESSMENTS_DISMISS_ERROR correctly', () => {
    const prevState = { fetchCompetencyAssessmentsError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: ROADMAP_FETCH_COMPETENCY_ASSESSMENTS_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchCompetencyAssessmentsError).toBe(null);
  });
});

