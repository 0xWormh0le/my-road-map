import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  ROADMAP_ADD_COMPETENCY_COMMENT_BEGIN,
  ROADMAP_ADD_COMPETENCY_COMMENT_SUCCESS,
  ROADMAP_ADD_COMPETENCY_COMMENT_FAILURE,
  ROADMAP_ADD_COMPETENCY_COMMENT_DISMISS_ERROR,
} from '../../../../src/features/roadmap/redux/constants';

import {
  addCompetencyComment,
  dismissAddCompetencyCommentError,
  reducer,
} from '../../../../src/features/roadmap/redux/addCompetencyComment';
import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('roadmap/redux/addCompetencyComment', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when addCompetencyComment succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/roadmaps/1/stages/1/competencies/1/comments/')
      .reply(200);

    return store.dispatch(addCompetencyComment({ roadmapId: 1, stageId: 1, competencyId: 1 }))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ROADMAP_ADD_COMPETENCY_COMMENT_BEGIN);
        expect(actions[1]).toHaveProperty('type', ROADMAP_ADD_COMPETENCY_COMMENT_SUCCESS);
      });
  });

  it('dispatches failure action when addCompetencyComment fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/roadmaps/1/stages/1/competencies/1/comments/')
      .reply(500, {});

    return store.dispatch(addCompetencyComment({ roadmapId: 1, stageId: 1, competencyId: 1 }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ROADMAP_ADD_COMPETENCY_COMMENT_BEGIN);
        expect(actions[1]).toHaveProperty('type', ROADMAP_ADD_COMPETENCY_COMMENT_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissAddCompetencyCommentError', () => {
    const expectedAction = {
      type: ROADMAP_ADD_COMPETENCY_COMMENT_DISMISS_ERROR,
    };
    expect(dismissAddCompetencyCommentError()).toEqual(expectedAction);
  });

  it('handles action type ROADMAP_ADD_COMPETENCY_COMMENT_BEGIN correctly', () => {
    const prevState = { addCompetencyCommentPending: false };
    const state = reducer(
      prevState,
      { type: ROADMAP_ADD_COMPETENCY_COMMENT_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addCompetencyCommentPending).toBe(true);
  });

  it('handles action type ROADMAP_ADD_COMPETENCY_COMMENT_SUCCESS correctly', () => {
    const prevState = { addCompetencyCommentPending: true };
    const state = reducer(
      prevState,
      { type: ROADMAP_ADD_COMPETENCY_COMMENT_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addCompetencyCommentPending).toBe(false);
  });

  it('handles action type ROADMAP_ADD_COMPETENCY_COMMENT_FAILURE correctly', () => {
    const prevState = { addCompetencyCommentPending: true };
    const state = reducer(
      prevState,
      { type: ROADMAP_ADD_COMPETENCY_COMMENT_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addCompetencyCommentPending).toBe(false);
    expect(state.addCompetencyCommentError).toEqual(expect.anything());
  });

  it('handles action type ROADMAP_ADD_COMPETENCY_COMMENT_DISMISS_ERROR correctly', () => {
    const prevState = { addCompetencyCommentError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: ROADMAP_ADD_COMPETENCY_COMMENT_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addCompetencyCommentError).toBe(null);
  });
});
