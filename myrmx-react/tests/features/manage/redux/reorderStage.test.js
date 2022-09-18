import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MANAGE_REORDER_STAGE_BEGIN,
  MANAGE_REORDER_STAGE_SUCCESS,
  MANAGE_REORDER_STAGE_FAILURE,
  MANAGE_REORDER_STAGE_DISMISS_ERROR,
} from '../../../../src/features/manage/redux/constants';

import {
  reorderStage,
  dismissReorderStageError,
  reducer,
} from '../../../../src/features/manage/redux/reorderStage';

import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('manage/redux/reorderStage', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when reorderStage succeeds', () => {
    const store = mockStore({});
    
    nock(config.apiRootUrl)
      .post('/roadmaps/1/reorder-stages/')
      .reply(200);

    return store.dispatch(reorderStage({ roadmapId: 1, order_mapping: [] }))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_REORDER_STAGE_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_REORDER_STAGE_SUCCESS);
      });
  });

  it('dispatches failure action when reorderStage fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/roadmaps/1/reorder-stages/')
      .reply(500, {});

    return store.dispatch(reorderStage({ roadmapId: 1, order_mapping: []  }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_REORDER_STAGE_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_REORDER_STAGE_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissReorderStageError', () => {
    const expectedAction = {
      type: MANAGE_REORDER_STAGE_DISMISS_ERROR,
    };
    expect(dismissReorderStageError()).toEqual(expectedAction);
  });

  it('handles action type MANAGE_REORDER_STAGE_BEGIN correctly', () => {
    const prevState = { reorderStagePending: false };
    const state = reducer(
      prevState,
      { type: MANAGE_REORDER_STAGE_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.reorderStagePending).toBe(true);
  });

  it('handles action type MANAGE_REORDER_STAGE_SUCCESS correctly', () => {
    const prevState = { reorderStagePending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_REORDER_STAGE_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.reorderStagePending).toBe(false);
  });

  it('handles action type MANAGE_REORDER_STAGE_FAILURE correctly', () => {
    const prevState = { reorderStagePending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_REORDER_STAGE_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.reorderStagePending).toBe(false);
    expect(state.reorderStageError).toEqual(expect.anything());
  });

  it('handles action type MANAGE_REORDER_STAGE_DISMISS_ERROR correctly', () => {
    const prevState = { reorderStageError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MANAGE_REORDER_STAGE_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.reorderStageError).toBe(null);
  });
});

