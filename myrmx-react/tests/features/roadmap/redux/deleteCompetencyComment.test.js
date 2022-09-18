import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  ROADMAP_DELETE_COMPETENCY_COMMENT_BEGIN,
  ROADMAP_DELETE_COMPETENCY_COMMENT_SUCCESS,
  ROADMAP_DELETE_COMPETENCY_COMMENT_FAILURE,
  ROADMAP_DELETE_COMPETENCY_COMMENT_DISMISS_ERROR,
} from '../../../../src/features/roadmap/redux/constants';

import {
  deleteCompetencyComment,
  dismissDeleteCompetencyCommentError,
  reducer,
} from '../../../../src/features/roadmap/redux/deleteCompetencyComment';

import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('roadmap/redux/deleteCompetencyComment', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when deleteCompetencyComment succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .delete('/roadmaps/1/stages/1/competencies/1/comments/1')
      .reply(204);

    return store.dispatch(deleteCompetencyComment({ roadmapId: 1, stageId: 1, competencyId: 1, commentId: 1 }))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ROADMAP_DELETE_COMPETENCY_COMMENT_BEGIN);
        expect(actions[1]).toHaveProperty('type', ROADMAP_DELETE_COMPETENCY_COMMENT_SUCCESS);
      });
  });

  it('dispatches failure action when deleteCompetencyComment fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .delete('/roadmaps/1/stages/1/competencies/1/comments/1')
      .reply(500, {});

    return store.dispatch(deleteCompetencyComment({ roadmapId: 1, stageId: 1, competencyId: 1, commentId: 1 }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ROADMAP_DELETE_COMPETENCY_COMMENT_BEGIN);
        expect(actions[1]).toHaveProperty('type', ROADMAP_DELETE_COMPETENCY_COMMENT_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissDeleteCompetencyCommentError', () => {
    const expectedAction = {
      type: ROADMAP_DELETE_COMPETENCY_COMMENT_DISMISS_ERROR,
    };
    expect(dismissDeleteCompetencyCommentError()).toEqual(expectedAction);
  });

  it('handles action type ROADMAP_DELETE_COMPETENCY_COMMENT_BEGIN correctly', () => {
    const prevState = { deleteCompetencyCommentPending: false };
    const state = reducer(
      prevState,
      { type: ROADMAP_DELETE_COMPETENCY_COMMENT_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteCompetencyCommentPending).toBe(true);
  });

  it('handles action type ROADMAP_DELETE_COMPETENCY_COMMENT_SUCCESS correctly', () => {
    const prevState = { deleteCompetencyCommentPending: true };
    const state = reducer(
      prevState,
      { type: ROADMAP_DELETE_COMPETENCY_COMMENT_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteCompetencyCommentPending).toBe(false);
  });

  it('handles action type ROADMAP_DELETE_COMPETENCY_COMMENT_FAILURE correctly', () => {
    const prevState = { deleteCompetencyCommentPending: true };
    const state = reducer(
      prevState,
      { type: ROADMAP_DELETE_COMPETENCY_COMMENT_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteCompetencyCommentPending).toBe(false);
    expect(state.deleteCompetencyCommentError).toEqual(expect.anything());
  });

  it('handles action type ROADMAP_DELETE_COMPETENCY_COMMENT_DISMISS_ERROR correctly', () => {
    const prevState = { deleteCompetencyCommentError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: ROADMAP_DELETE_COMPETENCY_COMMENT_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteCompetencyCommentError).toBe(null);
  });
});

