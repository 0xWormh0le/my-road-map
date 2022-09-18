import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MANAGE_ADD_GLOBAL_QUESTION_BEGIN,
  MANAGE_ADD_GLOBAL_QUESTION_SUCCESS,
  MANAGE_ADD_GLOBAL_QUESTION_FAILURE,
  MANAGE_ADD_GLOBAL_QUESTION_DISMISS_ERROR,
} from '../../../../src/features/manage/redux/constants';

import {
  addGlobalQuestion,
  dismissAddGlobalQuestionError,
  reducer,
} from '../../../../src/features/manage/redux/addGlobalQuestion';
import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('manage/redux/addGlobalQuestion', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when addGlobalQuestion succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/roadmaps/1/stages/1/competencies/1/global-questions/')
      .reply(201);
      
    return store.dispatch(addGlobalQuestion({roadmapId: 1, stageId: 1, competencyId: 1}))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_ADD_GLOBAL_QUESTION_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_ADD_GLOBAL_QUESTION_SUCCESS);
      });
  });

  it('dispatches failure action when addGlobalQuestion fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/roadmaps/1/stages/1/competencies/1/global-questions/')
      .reply(500, {})

    return store.dispatch(addGlobalQuestion({roadmapId: 1, stageId: 1, competencyId: 1}))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_ADD_GLOBAL_QUESTION_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_ADD_GLOBAL_QUESTION_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissAddGlobalQuestionError', () => {
    const expectedAction = {
      type: MANAGE_ADD_GLOBAL_QUESTION_DISMISS_ERROR,
    };
    expect(dismissAddGlobalQuestionError()).toEqual(expectedAction);
  });

  it('handles action type MANAGE_ADD_GLOBAL_QUESTION_BEGIN correctly', () => {
    const prevState = { addGlobalQuestionPending: false };
    const state = reducer(
      prevState,
      { type: MANAGE_ADD_GLOBAL_QUESTION_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addGlobalQuestionPending).toBe(true);
  });

  it('handles action type MANAGE_ADD_GLOBAL_QUESTION_SUCCESS correctly', () => {
    const prevState = { addGlobalQuestionPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_ADD_GLOBAL_QUESTION_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addGlobalQuestionPending).toBe(false);
  });

  it('handles action type MANAGE_ADD_GLOBAL_QUESTION_FAILURE correctly', () => {
    const prevState = { addGlobalQuestionPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_ADD_GLOBAL_QUESTION_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addGlobalQuestionPending).toBe(false);
    expect(state.addGlobalQuestionError).toEqual(expect.anything());
  });

  it('handles action type MANAGE_ADD_GLOBAL_QUESTION_DISMISS_ERROR correctly', () => {
    const prevState = { addGlobalQuestionError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MANAGE_ADD_GLOBAL_QUESTION_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addGlobalQuestionError).toBe(null);
  });
});

