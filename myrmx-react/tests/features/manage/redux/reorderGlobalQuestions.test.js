import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MANAGE_REORDER_GLOBAL_QUESTIONS_BEGIN,
  MANAGE_REORDER_GLOBAL_QUESTIONS_SUCCESS,
  MANAGE_REORDER_GLOBAL_QUESTIONS_FAILURE,
  MANAGE_REORDER_GLOBAL_QUESTIONS_DISMISS_ERROR,
} from '../../../../src/features/manage/redux/constants';

import {
  reorderGlobalQuestions,
  dismissReorderGlobalQuestionsError,
  reducer,
} from '../../../../src/features/manage/redux/reorderGlobalQuestions';
import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('manage/redux/reorderGlobalQuestions', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when reorderGlobalQuestions succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/roadmaps/1/stages/1/competencies/1/reorder-questions/')
      .reply(200);

    return store.dispatch(reorderGlobalQuestions({ roadmapId: 1, stageId: 1, competencyId: 1 }))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_REORDER_GLOBAL_QUESTIONS_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_REORDER_GLOBAL_QUESTIONS_SUCCESS);
      });
  });

  it('dispatches failure action when reorderGlobalQuestions fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/roadmaps/1/stages/1/competencies/1/reorder-questions/')
      .reply(500, {});

    return store.dispatch(reorderGlobalQuestions({ roadmapId: 1, stageId: 1, competencyId: 1 }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_REORDER_GLOBAL_QUESTIONS_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_REORDER_GLOBAL_QUESTIONS_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissReorderGlobalQuestionsError', () => {
    const expectedAction = {
      type: MANAGE_REORDER_GLOBAL_QUESTIONS_DISMISS_ERROR,
    };
    expect(dismissReorderGlobalQuestionsError()).toEqual(expectedAction);
  });

  it('handles action type MANAGE_REORDER_GLOBAL_QUESTIONS_BEGIN correctly', () => {
    const prevState = { reorderGlobalQuestionsPending: false };
    const state = reducer(
      prevState,
      { type: MANAGE_REORDER_GLOBAL_QUESTIONS_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.reorderGlobalQuestionsPending).toBe(true);
  });

  it('handles action type MANAGE_REORDER_GLOBAL_QUESTIONS_SUCCESS correctly', () => {
    const prevState = { reorderGlobalQuestionsPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_REORDER_GLOBAL_QUESTIONS_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.reorderGlobalQuestionsPending).toBe(false);
  });

  it('handles action type MANAGE_REORDER_GLOBAL_QUESTIONS_FAILURE correctly', () => {
    const prevState = { reorderGlobalQuestionsPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_REORDER_GLOBAL_QUESTIONS_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.reorderGlobalQuestionsPending).toBe(false);
    expect(state.reorderGlobalQuestionsError).toEqual(expect.anything());
  });

  it('handles action type MANAGE_REORDER_GLOBAL_QUESTIONS_DISMISS_ERROR correctly', () => {
    const prevState = { reorderGlobalQuestionsError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MANAGE_REORDER_GLOBAL_QUESTIONS_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.reorderGlobalQuestionsError).toBe(null);
  });
});

