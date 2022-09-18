import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MANAGE_REORDER_COMPETENCY_BEGIN,
  MANAGE_REORDER_COMPETENCY_SUCCESS,
  MANAGE_REORDER_COMPETENCY_FAILURE,
  MANAGE_REORDER_COMPETENCY_DISMISS_ERROR,
} from '../../../../src/features/manage/redux/constants';

import {
  reorderCompetency,
  dismissReorderCompetencyError,
  reducer,
} from '../../../../src/features/manage/redux/reorderCompetency';

import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('manage/redux/reorderCompetency', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when reorderCompetency succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/roadmaps/1/stages/1/reorder-competencies/')
      .reply(200);

    return store.dispatch(reorderCompetency({ roadmapId: 1, stageId: 1 }))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_REORDER_COMPETENCY_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_REORDER_COMPETENCY_SUCCESS);
      });
  });

  it('dispatches failure action when reorderCompetency fails', () => {
    const store = mockStore({});
    
    nock(config.apiRootUrl)
      .post('/roadmaps/1/stages/1/reorder-competencies/')
      .reply(500, {});

    return store.dispatch(reorderCompetency({ roadmapId: 1, stageId: 1 }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_REORDER_COMPETENCY_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_REORDER_COMPETENCY_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissReorderCompetencyError', () => {
    const expectedAction = {
      type: MANAGE_REORDER_COMPETENCY_DISMISS_ERROR,
    };
    expect(dismissReorderCompetencyError()).toEqual(expectedAction);
  });

  it('handles action type MANAGE_REORDER_COMPETENCY_BEGIN correctly', () => {
    const prevState = { reorderCompetencyPending: false };
    const state = reducer(
      prevState,
      { type: MANAGE_REORDER_COMPETENCY_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.reorderCompetencyPending).toBe(true);
  });

  it('handles action type MANAGE_REORDER_COMPETENCY_SUCCESS correctly', () => {
    const prevState = { reorderCompetencyPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_REORDER_COMPETENCY_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.reorderCompetencyPending).toBe(false);
  });

  it('handles action type MANAGE_REORDER_COMPETENCY_FAILURE correctly', () => {
    const prevState = { reorderCompetencyPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_REORDER_COMPETENCY_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.reorderCompetencyPending).toBe(false);
    expect(state.reorderCompetencyError).toEqual(expect.anything());
  });

  it('handles action type MANAGE_REORDER_COMPETENCY_DISMISS_ERROR correctly', () => {
    const prevState = { reorderCompetencyError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MANAGE_REORDER_COMPETENCY_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.reorderCompetencyError).toBe(null);
  });
});

