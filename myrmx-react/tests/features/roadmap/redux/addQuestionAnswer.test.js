import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  ROADMAP_ADD_QUESTION_ANSWER_BEGIN,
  ROADMAP_ADD_QUESTION_ANSWER_SUCCESS,
  ROADMAP_ADD_QUESTION_ANSWER_FAILURE,
  ROADMAP_ADD_QUESTION_ANSWER_DISMISS_ERROR,
} from '../../../../src/features/roadmap/redux/constants';

import {
  addQuestionAnswer,
  dismissAddQuestionAnswerError,
  reducer,
} from '../../../../src/features/roadmap/redux/addQuestionAnswer';

import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('roadmap/redux/addQuestionAnswer', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when addQuestionAnswer succeeds', () => {
    const store = mockStore({});
    
      nock(config.apiRootUrl)
        .post('/roadmaps/1/stages/1/competencies/1/question-answers/')
        .reply(200, {});

    return store.dispatch(addQuestionAnswer({roadmapId: 1, stageId: 1, competencyId:1}))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ROADMAP_ADD_QUESTION_ANSWER_BEGIN);
        expect(actions[1]).toHaveProperty('type', ROADMAP_ADD_QUESTION_ANSWER_SUCCESS);
      });
  });

  it('dispatches failure action when addQuestionAnswer fails', () => {
    const store = mockStore({});
    
    nock(config.apiRootUrl)
      .post('/roadmaps/1/stages/1/competencies/1/question-answers/')
      .reply(500, {});

    return store.dispatch(addQuestionAnswer({roadmapId: 1, stageId: 1, competencyId: 1}))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ROADMAP_ADD_QUESTION_ANSWER_BEGIN);
        expect(actions[1]).toHaveProperty('type', ROADMAP_ADD_QUESTION_ANSWER_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissAddQuestionAnswerError', () => {
    const expectedAction = {
      type: ROADMAP_ADD_QUESTION_ANSWER_DISMISS_ERROR,
    };
    expect(dismissAddQuestionAnswerError()).toEqual(expectedAction);
  });

  it('handles action type ROADMAP_ADD_QUESTION_ANSWER_BEGIN correctly', () => {
    const prevState = { addQuestionAnswerPending: false };
    const state = reducer(
      prevState,
      { type: ROADMAP_ADD_QUESTION_ANSWER_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addQuestionAnswerPending).toBe(true);
  });

  it('handles action type ROADMAP_ADD_QUESTION_ANSWER_SUCCESS correctly', () => {
    const prevState = { addQuestionAnswerPending: true };
    const state = reducer(
      prevState,
      { type: ROADMAP_ADD_QUESTION_ANSWER_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addQuestionAnswerPending).toBe(false);
  });

  it('handles action type ROADMAP_ADD_QUESTION_ANSWER_FAILURE correctly', () => {
    const prevState = { addQuestionAnswerPending: true };
    const state = reducer(
      prevState,
      { type: ROADMAP_ADD_QUESTION_ANSWER_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addQuestionAnswerPending).toBe(false);
    expect(state.addQuestionAnswerError).toEqual(expect.anything());
  });

  it('handles action type ROADMAP_ADD_QUESTION_ANSWER_DISMISS_ERROR correctly', () => {
    const prevState = { addQuestionAnswerError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: ROADMAP_ADD_QUESTION_ANSWER_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addQuestionAnswerError).toBe(null);
  });
});

