import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MANAGE_CLEAR_ROADMAP_ASSESSMENT_BEGIN,
  MANAGE_CLEAR_ROADMAP_ASSESSMENT_SUCCESS,
  MANAGE_CLEAR_ROADMAP_ASSESSMENT_FAILURE,
  MANAGE_CLEAR_ROADMAP_ASSESSMENT_DISMISS_ERROR,
} from '../../../../src/features/manage/redux/constants';

import {
  clearRoadmapAssessment,
  dismissClearRoadmapAssessmentError,
  reducer,
} from '../../../../src/features/manage/redux/clearRoadmapAssessment';

import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('manage/redux/clearRoadmapAssessment', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when clearRoadmapAssessment succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/roadmaps/1/clear-assessments/')
      .reply(200);

    return store.dispatch(clearRoadmapAssessment({ roadmapId: 1 }))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_CLEAR_ROADMAP_ASSESSMENT_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_CLEAR_ROADMAP_ASSESSMENT_SUCCESS);
      });
  });

  it('dispatches failure action when clearRoadmapAssessment fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/roadmaps/1/clear-assessments/')
      .reply(500, {});

    return store.dispatch(clearRoadmapAssessment({ roadmapId: 1 }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_CLEAR_ROADMAP_ASSESSMENT_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_CLEAR_ROADMAP_ASSESSMENT_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissClearRoadmapAssessmentError', () => {
    const expectedAction = {
      type: MANAGE_CLEAR_ROADMAP_ASSESSMENT_DISMISS_ERROR,
    };
    expect(dismissClearRoadmapAssessmentError()).toEqual(expectedAction);
  });

  it('handles action type MANAGE_CLEAR_ROADMAP_ASSESSMENT_BEGIN correctly', () => {
    const prevState = { clearRoadmapAssessmentPending: false };
    const state = reducer(
      prevState,
      { type: MANAGE_CLEAR_ROADMAP_ASSESSMENT_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.clearRoadmapAssessmentPending).toBe(true);
  });

  it('handles action type MANAGE_CLEAR_ROADMAP_ASSESSMENT_SUCCESS correctly', () => {
    const prevState = { clearRoadmapAssessmentPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_CLEAR_ROADMAP_ASSESSMENT_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.clearRoadmapAssessmentPending).toBe(false);
  });

  it('handles action type MANAGE_CLEAR_ROADMAP_ASSESSMENT_FAILURE correctly', () => {
    const prevState = { clearRoadmapAssessmentPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_CLEAR_ROADMAP_ASSESSMENT_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.clearRoadmapAssessmentPending).toBe(false);
    expect(state.clearRoadmapAssessmentError).toEqual(expect.anything());
  });

  it('handles action type MANAGE_CLEAR_ROADMAP_ASSESSMENT_DISMISS_ERROR correctly', () => {
    const prevState = { clearRoadmapAssessmentError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MANAGE_CLEAR_ROADMAP_ASSESSMENT_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.clearRoadmapAssessmentError).toBe(null);
  });
});

