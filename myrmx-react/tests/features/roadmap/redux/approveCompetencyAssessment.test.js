import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  ROADMAP_APPROVE_COMPETENCY_ASSESSMENT_BEGIN,
  ROADMAP_APPROVE_COMPETENCY_ASSESSMENT_SUCCESS,
  ROADMAP_APPROVE_COMPETENCY_ASSESSMENT_FAILURE,
  ROADMAP_APPROVE_COMPETENCY_ASSESSMENT_DISMISS_ERROR,
} from '../../../../src/features/roadmap/redux/constants';

import {
  approveCompetencyAssessment,
  dismissApproveCompetencyAssessmentError,
  reducer,
} from '../../../../src/features/roadmap/redux/approveCompetencyAssessment';

import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('roadmap/redux/approveCompetencyAssessment', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when approveCompetencyAssessment succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/roadmaps/1/stages/1/competencies/1/assessments/1/approve-assessment/')
      .reply(200);

    return store.dispatch(approveCompetencyAssessment({ roadmapId: 1, stageId: 1, competencyId: 1, approved: true, assessmentId: 1 }))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ROADMAP_APPROVE_COMPETENCY_ASSESSMENT_BEGIN);
        expect(actions[1]).toHaveProperty('type', ROADMAP_APPROVE_COMPETENCY_ASSESSMENT_SUCCESS);
      });
  });

  it('dispatches failure action when approveCompetencyAssessment fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/roadmaps/1/stages/1/competencies/1/assessments/1/approve-assessment/')
      .reply(500, {});

    return store.dispatch(approveCompetencyAssessment({ roadmapId: 1, stageId: 1, competencyId: 1, approved: true, assessmentId: 1 }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ROADMAP_APPROVE_COMPETENCY_ASSESSMENT_BEGIN);
        expect(actions[1]).toHaveProperty('type', ROADMAP_APPROVE_COMPETENCY_ASSESSMENT_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissApproveCompetencyAssessmentError', () => {
    const expectedAction = {
      type: ROADMAP_APPROVE_COMPETENCY_ASSESSMENT_DISMISS_ERROR,
    };
    expect(dismissApproveCompetencyAssessmentError()).toEqual(expectedAction);
  });

  it('handles action type ROADMAP_APPROVE_COMPETENCY_ASSESSMENT_BEGIN correctly', () => {
    const prevState = { approveCompetencyAssessmentPending: false };
    const state = reducer(
      prevState,
      { type: ROADMAP_APPROVE_COMPETENCY_ASSESSMENT_BEGIN, data: 'approve' }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.approveCompetencyAssessmentPending).toBe('approve');
  });

  it('handles action type ROADMAP_APPROVE_COMPETENCY_ASSESSMENT_SUCCESS correctly', () => {
    const prevState = { approveCompetencyAssessmentPending: true };
    const state = reducer(
      prevState,
      { type: ROADMAP_APPROVE_COMPETENCY_ASSESSMENT_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.approveCompetencyAssessmentPending).toBe(false);
  });

  it('handles action type ROADMAP_APPROVE_COMPETENCY_ASSESSMENT_FAILURE correctly', () => {
    const prevState = { approveCompetencyAssessmentPending: true };
    const state = reducer(
      prevState,
      { type: ROADMAP_APPROVE_COMPETENCY_ASSESSMENT_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.approveCompetencyAssessmentPending).toBe(false);
    expect(state.approveCompetencyAssessmentError).toEqual(expect.anything());
  });

  it('handles action type ROADMAP_APPROVE_COMPETENCY_ASSESSMENT_DISMISS_ERROR correctly', () => {
    const prevState = { approveCompetencyAssessmentError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: ROADMAP_APPROVE_COMPETENCY_ASSESSMENT_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.approveCompetencyAssessmentError).toBe(null);
  });
});

