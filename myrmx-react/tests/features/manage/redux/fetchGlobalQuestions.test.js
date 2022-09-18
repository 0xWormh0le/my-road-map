import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MANAGE_FETCH_GLOBAL_QUESTIONS_BEGIN,
  MANAGE_FETCH_GLOBAL_QUESTIONS_SUCCESS,
  MANAGE_FETCH_GLOBAL_QUESTIONS_FAILURE,
  MANAGE_FETCH_GLOBAL_QUESTIONS_DISMISS_ERROR,
} from '../../../../src/features/manage/redux/constants';

import {
  fetchGlobalQuestions,
  dismissFetchGlobalQuestionsError,
  reducer,
} from '../../../../src/features/manage/redux/fetchGlobalQuestions';
import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('manage/redux/fetchGlobalQuestions', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when fetchGlobalQuestions succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .get('/roadmaps/1/stages/1/competencies/1/global-questions/')
      .reply(200);
      
    return store.dispatch(fetchGlobalQuestions({roadmapId: 1, stageId: 1, competencyId: 1}))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_FETCH_GLOBAL_QUESTIONS_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_FETCH_GLOBAL_QUESTIONS_SUCCESS);
      });
  });

  it('dispatches failure action when fetchGlobalQuestions fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .get('/roadmaps/1/stages/1/competencies/1/global-questions/')
      .reply(500, {})

    return store.dispatch(fetchGlobalQuestions({roadmapId: 1, stageId: 1, competencyId: 1}))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_FETCH_GLOBAL_QUESTIONS_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_FETCH_GLOBAL_QUESTIONS_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissFetchGlobalQuestionsError', () => {
    const expectedAction = {
      type: MANAGE_FETCH_GLOBAL_QUESTIONS_DISMISS_ERROR,
    };
    expect(dismissFetchGlobalQuestionsError()).toEqual(expectedAction);
  });

  it('handles action type MANAGE_FETCH_GLOBAL_QUESTIONS_BEGIN correctly', () => {
    const prevState = { fetchGlobalQuestionsPending: false };
    const state = reducer(
      prevState,
      { type: MANAGE_FETCH_GLOBAL_QUESTIONS_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchGlobalQuestionsPending).toBe(true);
  });

  it('handles action type MANAGE_FETCH_GLOBAL_QUESTIONS_SUCCESS correctly', () => {
    const prevState = { fetchGlobalQuestionsPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_FETCH_GLOBAL_QUESTIONS_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchGlobalQuestionsPending).toBe(false);
  });

  it('handles action type MANAGE_FETCH_GLOBAL_QUESTIONS_FAILURE correctly', () => {
    const prevState = { fetchGlobalQuestionsPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_FETCH_GLOBAL_QUESTIONS_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchGlobalQuestionsPending).toBe(false);
    expect(state.fetchGlobalQuestionsError).toEqual(expect.anything());
  });

  it('handles action type MANAGE_FETCH_GLOBAL_QUESTIONS_DISMISS_ERROR correctly', () => {
    const prevState = { fetchGlobalQuestionsError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MANAGE_FETCH_GLOBAL_QUESTIONS_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchGlobalQuestionsError).toBe(null);
  });
});

