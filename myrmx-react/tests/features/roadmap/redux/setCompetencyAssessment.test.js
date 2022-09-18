import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  ROADMAP_SET_COMPETENCY_ASSESSMENT_BEGIN,
  ROADMAP_SET_COMPETENCY_ASSESSMENT_SUCCESS,
  ROADMAP_SET_COMPETENCY_ASSESSMENT_FAILURE,
  ROADMAP_SET_COMPETENCY_ASSESSMENT_DISMISS_ERROR,
} from '../../../../src/features/roadmap/redux/constants';

import {
  setCompetencyAssessment,
  dismissSetCompetencyAssessmentError,
  reducer,
} from '../../../../src/features/roadmap/redux/setCompetencyAssessment';

import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('roadmap/redux/setCompetencyAssessment', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when setCompetencyAssessment succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/roadmaps/1/stages/1/competencies/1/assessments/')
      .reply(200);

    return store.dispatch(setCompetencyAssessment({ roadmapId: 1, stageId: 1, competencyId: 1 }))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ROADMAP_SET_COMPETENCY_ASSESSMENT_BEGIN);
        expect(actions[1]).toHaveProperty('type', ROADMAP_SET_COMPETENCY_ASSESSMENT_SUCCESS);
      });
  });

  it('dispatches failure action when setCompetencyAssessment fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/roadmaps/1/stages/1/competencies/1/assessments/')
      .reply(500, {});

    return store.dispatch(setCompetencyAssessment({ roadmapId: 1, stageId: 1, competencyId: 1 }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ROADMAP_SET_COMPETENCY_ASSESSMENT_BEGIN);
        expect(actions[1]).toHaveProperty('type', ROADMAP_SET_COMPETENCY_ASSESSMENT_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissSetCompetencyAssessmentError', () => {
    const expectedAction = {
      type: ROADMAP_SET_COMPETENCY_ASSESSMENT_DISMISS_ERROR,
    };
    expect(dismissSetCompetencyAssessmentError()).toEqual(expectedAction);
  });

  it('handles action type ROADMAP_SET_COMPETENCY_ASSESSMENT_BEGIN correctly', () => {
    const prevState = { setCompetencyAssessmentPending: false };
    const state = reducer(
      prevState,
      { type: ROADMAP_SET_COMPETENCY_ASSESSMENT_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.setCompetencyAssessmentPending).toBe(true);
  });

  it('handles action type ROADMAP_SET_COMPETENCY_ASSESSMENT_SUCCESS correctly', () => {
    const prevState = { setCompetencyAssessmentPending: true };
    const state = reducer(
      prevState,
      { type: ROADMAP_SET_COMPETENCY_ASSESSMENT_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.setCompetencyAssessmentPending).toBe(false);
  });

  it('handles action type ROADMAP_SET_COMPETENCY_ASSESSMENT_FAILURE correctly', () => {
    const prevState = { setCompetencyAssessmentPending: true };
    const state = reducer(
      prevState,
      { type: ROADMAP_SET_COMPETENCY_ASSESSMENT_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.setCompetencyAssessmentPending).toBe(false);
    expect(state.setCompetencyAssessmentError).toEqual(expect.anything());
  });

  it('handles action type ROADMAP_SET_COMPETENCY_ASSESSMENT_DISMISS_ERROR correctly', () => {
    const prevState = { setCompetencyAssessmentError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: ROADMAP_SET_COMPETENCY_ASSESSMENT_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.setCompetencyAssessmentError).toBe(null);
  });
});

