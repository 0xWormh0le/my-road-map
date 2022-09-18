import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  ROADMAP_SET_ACTION_ITEM_ASSESSMENT_BEGIN,
  ROADMAP_SET_ACTION_ITEM_ASSESSMENT_SUCCESS,
  ROADMAP_SET_ACTION_ITEM_ASSESSMENT_FAILURE,
  ROADMAP_SET_ACTION_ITEM_ASSESSMENT_DISMISS_ERROR,
} from '../../../../src/features/roadmap/redux/constants';

import {
  setActionItemAssessment,
  dismissSetActionItemAssessmentError,
  reducer,
} from '../../../../src/features/roadmap/redux/setActionItemAssessment';
import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('roadmap/redux/setActionItemAssessment', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when setActionItemAssessment succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/roadmaps/1/stages/1/competencies/1/action-item-assessments/1/approve-ai/')
      .reply(200, {});

    const args = { roadmapId: 1, stageId: 1, competencyId: 1, actionItemId: 1, approve: true }

    return store.dispatch(setActionItemAssessment(args))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ROADMAP_SET_ACTION_ITEM_ASSESSMENT_BEGIN);
        expect(actions[1]).toHaveProperty('type', ROADMAP_SET_ACTION_ITEM_ASSESSMENT_SUCCESS);
      });
  });

  it('dispatches failure action when setActionItemAssessment fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/roadmaps/1/stages/1/competencies/1/action-item-assessments/1/approve-ai/')
      .reply(500, {});

    const args = { roadmapId: 1, stageId: 1, competencyId: 1, actionItemId: 1, approve: true }

    return store.dispatch(setActionItemAssessment(args))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ROADMAP_SET_ACTION_ITEM_ASSESSMENT_BEGIN);
        expect(actions[1]).toHaveProperty('type', ROADMAP_SET_ACTION_ITEM_ASSESSMENT_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissSetActionItemAssessmentError', () => {
    const expectedAction = {
      type: ROADMAP_SET_ACTION_ITEM_ASSESSMENT_DISMISS_ERROR,
    };
    expect(dismissSetActionItemAssessmentError()).toEqual(expectedAction);
  });

  it('handles action type ROADMAP_SET_ACTION_ITEM_ASSESSMENT_BEGIN correctly', () => {
    const prevState = { setActionItemAssessmentPending: false };
    const state = reducer(
      prevState,
      { type: ROADMAP_SET_ACTION_ITEM_ASSESSMENT_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.setActionItemAssessmentPending).toBe(true);
  });

  it('handles action type ROADMAP_SET_ACTION_ITEM_ASSESSMENT_SUCCESS correctly', () => {
    const prevState = { setActionItemAssessmentPending: true };
    const state = reducer(
      prevState,
      { type: ROADMAP_SET_ACTION_ITEM_ASSESSMENT_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.setActionItemAssessmentPending).toBe(false);
  });

  it('handles action type ROADMAP_SET_ACTION_ITEM_ASSESSMENT_FAILURE correctly', () => {
    const prevState = { setActionItemAssessmentPending: true };
    const state = reducer(
      prevState,
      { type: ROADMAP_SET_ACTION_ITEM_ASSESSMENT_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.setActionItemAssessmentPending).toBe(false);
    expect(state.setActionItemAssessmentError).toEqual(expect.anything());
  });

  it('handles action type ROADMAP_SET_ACTION_ITEM_ASSESSMENT_DISMISS_ERROR correctly', () => {
    const prevState = { setActionItemAssessmentError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: ROADMAP_SET_ACTION_ITEM_ASSESSMENT_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.setActionItemAssessmentError).toBe(null);
  });
});

