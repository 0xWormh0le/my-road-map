import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  ROADMAP_FETCH_QUESTION_ANSWERS_BEGIN,
  ROADMAP_FETCH_QUESTION_ANSWERS_SUCCESS,
  ROADMAP_FETCH_QUESTION_ANSWERS_FAILURE,
  ROADMAP_FETCH_QUESTION_ANSWERS_DISMISS_ERROR,
} from '../../../../src/features/roadmap/redux/constants';

import {
  fetchQuestionAnswers,
  dismissFetchQuestionAnswersError,
  reducer,
} from '../../../../src/features/roadmap/redux/fetchQuestionAnswers';

import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('roadmap/redux/fetchQuestionAnswers', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when fetchQuestionAnswers succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .get('/roadmaps/1/stages/1/competencies/1/question-answers/')
      .reply(200, {});
      
    return store.dispatch(fetchQuestionAnswers({roadmapId: 1, stageId: 1, competencyId: 1}))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ROADMAP_FETCH_QUESTION_ANSWERS_BEGIN);
        expect(actions[1]).toHaveProperty('type', ROADMAP_FETCH_QUESTION_ANSWERS_SUCCESS);
      });
  });

  it('dispatches failure action when fetchQuestionAnswers fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .get('/roadmaps/1/stages/1/competencies/1/question-answers/')
      .reply(500, {});

    return store.dispatch(fetchQuestionAnswers({roadmapId: 1, stageId: 1, competencyId: 1}))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ROADMAP_FETCH_QUESTION_ANSWERS_BEGIN);
        expect(actions[1]).toHaveProperty('type', ROADMAP_FETCH_QUESTION_ANSWERS_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissFetchQuestionAnswersError', () => {
    const expectedAction = {
      type: ROADMAP_FETCH_QUESTION_ANSWERS_DISMISS_ERROR,
    };
    expect(dismissFetchQuestionAnswersError()).toEqual(expectedAction);
  });

  it('handles action type ROADMAP_FETCH_QUESTION_ANSWERS_BEGIN correctly', () => {
    const prevState = { fetchQuestionAnswersPending: false };
    const state = reducer(
      prevState,
      { type: ROADMAP_FETCH_QUESTION_ANSWERS_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchQuestionAnswersPending).toBe(true);
  });

  it('handles action type ROADMAP_FETCH_QUESTION_ANSWERS_SUCCESS correctly', () => {
    const prevState = { fetchQuestionAnswersPending: true };
    const state = reducer(
      prevState,
      { type: ROADMAP_FETCH_QUESTION_ANSWERS_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchQuestionAnswersPending).toBe(false);
  });

  it('handles action type ROADMAP_FETCH_QUESTION_ANSWERS_FAILURE correctly', () => {
    const prevState = { fetchQuestionAnswersPending: true };
    const state = reducer(
      prevState,
      { type: ROADMAP_FETCH_QUESTION_ANSWERS_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchQuestionAnswersPending).toBe(false);
    expect(state.fetchQuestionAnswersError).toEqual(expect.anything());
  });

  it('handles action type ROADMAP_FETCH_QUESTION_ANSWERS_DISMISS_ERROR correctly', () => {
    const prevState = { fetchQuestionAnswersError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: ROADMAP_FETCH_QUESTION_ANSWERS_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchQuestionAnswersError).toBe(null);
  });
});

