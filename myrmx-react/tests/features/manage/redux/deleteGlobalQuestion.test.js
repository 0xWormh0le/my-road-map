import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MANAGE_DELETE_GLOBAL_QUESTION_BEGIN,
  MANAGE_DELETE_GLOBAL_QUESTION_SUCCESS,
  MANAGE_DELETE_GLOBAL_QUESTION_FAILURE,
  MANAGE_DELETE_GLOBAL_QUESTION_DISMISS_ERROR,
} from '../../../../src/features/manage/redux/constants';

import {
  deleteGlobalQuestion,
  dismissDeleteGlobalQuestionError,
  reducer,
} from '../../../../src/features/manage/redux/deleteGlobalQuestion';
import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('manage/redux/deleteGlobalQuestion', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when deleteGlobalQuestion succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .delete('/roadmaps/1/stages/1/competencies/1/global-questions/1/')
      .reply(200);

    return store.dispatch(deleteGlobalQuestion({roadmapId: 1, stageId: 1, competencyId: 1, questionId: 1}))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_DELETE_GLOBAL_QUESTION_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_DELETE_GLOBAL_QUESTION_SUCCESS);
      });
  });

  it('dispatches failure action when deleteGlobalQuestion fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .delete('/roadmaps/1/stages/1/competencies/1/global-questions/1/')
      .reply(500, {});

    return store.dispatch(deleteGlobalQuestion({roadmapId: 1, stageId: 1, competencyId: 1, questionId: 1 }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_DELETE_GLOBAL_QUESTION_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_DELETE_GLOBAL_QUESTION_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissDeleteGlobalQuestionError', () => {
    const expectedAction = {
      type: MANAGE_DELETE_GLOBAL_QUESTION_DISMISS_ERROR,
    };
    expect(dismissDeleteGlobalQuestionError()).toEqual(expectedAction);
  });

  it('handles action type MANAGE_DELETE_GLOBAL_QUESTION_BEGIN correctly', () => {
    const prevState = { deleteGlobalQuestionPending: false };
    const state = reducer(
      prevState,
      { type: MANAGE_DELETE_GLOBAL_QUESTION_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteGlobalQuestionPending).toBe(true);
  });

  it('handles action type MANAGE_DELETE_GLOBAL_QUESTION_SUCCESS correctly', () => {
    const prevState = { globalQuestions: [], deleteGlobalQuestionPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_DELETE_GLOBAL_QUESTION_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteGlobalQuestionPending).toBe(false);
  });

  it('handles action type MANAGE_DELETE_GLOBAL_QUESTION_FAILURE correctly', () => {
    const prevState = { deleteGlobalQuestionPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_DELETE_GLOBAL_QUESTION_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteGlobalQuestionPending).toBe(false);
    expect(state.deleteGlobalQuestionError).toEqual(expect.anything());
  });

  it('handles action type MANAGE_DELETE_GLOBAL_QUESTION_DISMISS_ERROR correctly', () => {
    const prevState = { deleteGlobalQuestionError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MANAGE_DELETE_GLOBAL_QUESTION_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteGlobalQuestionError).toBe(null);
  });
});

