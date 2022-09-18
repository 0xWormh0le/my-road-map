import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MANAGE_DELETE_COMPETENCY_BEGIN,
  MANAGE_DELETE_COMPETENCY_SUCCESS,
  MANAGE_DELETE_COMPETENCY_FAILURE,
  MANAGE_DELETE_COMPETENCY_DISMISS_ERROR,
} from '../../../../src/features/manage/redux/constants';

import {
  deleteCompetency,
  dismissDeleteCompetencyError,
  reducer,
} from '../../../../src/features/manage/redux/deleteCompetency';

import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('manage/redux/deleteCompetency', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when deleteCompetency succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .delete('/roadmaps/1/stages/1/competencies/1/')
      .reply(200);

    return store.dispatch(deleteCompetency({roadmapId: 1, stageId: 1, competencyId: 1}))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_DELETE_COMPETENCY_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_DELETE_COMPETENCY_SUCCESS);
      });
  });

  it('dispatches failure action when deleteCompetency fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .delete('/roadmaps/1/stages/1/competencies/1/')
      .reply(500, {});

    return store.dispatch(deleteCompetency({roadmapId: 1, stageId: 1, competencyId: 1}))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_DELETE_COMPETENCY_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_DELETE_COMPETENCY_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissDeleteCompetencyError', () => {
    const expectedAction = {
      type: MANAGE_DELETE_COMPETENCY_DISMISS_ERROR,
    };
    expect(dismissDeleteCompetencyError()).toEqual(expectedAction);
  });

  it('handles action type MANAGE_DELETE_COMPETENCY_BEGIN correctly', () => {
    const prevState = { deleteCompetencyPending: false };
    const state = reducer(
      prevState,
      { type: MANAGE_DELETE_COMPETENCY_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteCompetencyPending).toBe(true);
  });

  it('handles action type MANAGE_DELETE_COMPETENCY_SUCCESS correctly', () => {
    const prevState = { deleteCompetencyPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_DELETE_COMPETENCY_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteCompetencyPending).toBe(false);
  });

  it('handles action type MANAGE_DELETE_COMPETENCY_FAILURE correctly', () => {
    const prevState = { deleteCompetencyPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_DELETE_COMPETENCY_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteCompetencyPending).toBe(false);
    expect(state.deleteCompetencyError).toEqual(expect.anything());
  });

  it('handles action type MANAGE_DELETE_COMPETENCY_DISMISS_ERROR correctly', () => {
    const prevState = { deleteCompetencyError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MANAGE_DELETE_COMPETENCY_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteCompetencyError).toBe(null);
  });
});

