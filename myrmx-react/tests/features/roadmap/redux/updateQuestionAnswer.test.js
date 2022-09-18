import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  ROADMAP_UPDATE_QUESTION_ANSWER_BEGIN,
  ROADMAP_UPDATE_QUESTION_ANSWER_SUCCESS,
  ROADMAP_UPDATE_QUESTION_ANSWER_FAILURE,
  ROADMAP_UPDATE_QUESTION_ANSWER_DISMISS_ERROR,
} from '../../../../src/features/roadmap/redux/constants';

import {
  updateQuestionAnswer,
  dismissUpdateQuestionAnswerError,
  reducer,
} from '../../../../src/features/roadmap/redux/updateQuestionAnswer';

import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('roadmap/redux/updateQuestionAnswer', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when updateQuestionAnswer succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .patch('/roadmaps/1/stages/1/competencies/1/question-answers/1/')
      .reply(200);

    return store.dispatch(updateQuestionAnswer({roadmapId: 1, stageId: 1, competencyId: 1, answerId: 1}))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ROADMAP_UPDATE_QUESTION_ANSWER_BEGIN);
        expect(actions[1]).toHaveProperty('type', ROADMAP_UPDATE_QUESTION_ANSWER_SUCCESS);
      });
  });

  it('dispatches failure action when updateQuestionAnswer fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .patch('/roadmaps/1/stages/1/competencies/1/question-answers/1/')
      .reply(500, {});

    return store.dispatch(updateQuestionAnswer({roadmapId: 1, stageId: 1, competencyId: 1, answerId: 1}))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ROADMAP_UPDATE_QUESTION_ANSWER_BEGIN);
        expect(actions[1]).toHaveProperty('type', ROADMAP_UPDATE_QUESTION_ANSWER_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissUpdateQuestionAnswerError', () => {
    const expectedAction = {
      type: ROADMAP_UPDATE_QUESTION_ANSWER_DISMISS_ERROR,
    };
    expect(dismissUpdateQuestionAnswerError()).toEqual(expectedAction);
  });

  it('handles action type ROADMAP_UPDATE_QUESTION_ANSWER_BEGIN correctly', () => {
    const prevState = { updateQuestionAnswerPending: false };
    const state = reducer(
      prevState,
      { type: ROADMAP_UPDATE_QUESTION_ANSWER_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateQuestionAnswerPending).toBe(true);
  });

  it('handles action type ROADMAP_UPDATE_QUESTION_ANSWER_SUCCESS correctly', () => {
    const prevState = { updateQuestionAnswerPending: true };
    const state = reducer(
      prevState,
      { type: ROADMAP_UPDATE_QUESTION_ANSWER_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateQuestionAnswerPending).toBe(false);
  });

  it('handles action type ROADMAP_UPDATE_QUESTION_ANSWER_FAILURE correctly', () => {
    const prevState = { updateQuestionAnswerPending: true };
    const state = reducer(
      prevState,
      { type: ROADMAP_UPDATE_QUESTION_ANSWER_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateQuestionAnswerPending).toBe(false);
    expect(state.updateQuestionAnswerError).toEqual(expect.anything());
  });

  it('handles action type ROADMAP_UPDATE_QUESTION_ANSWER_DISMISS_ERROR correctly', () => {
    const prevState = { updateQuestionAnswerError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: ROADMAP_UPDATE_QUESTION_ANSWER_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateQuestionAnswerError).toBe(null);
  });
});

