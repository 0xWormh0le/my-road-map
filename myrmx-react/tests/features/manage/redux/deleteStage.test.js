import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MANAGE_DELETE_STAGE_BEGIN,
  MANAGE_DELETE_STAGE_SUCCESS,
  MANAGE_DELETE_STAGE_FAILURE,
  MANAGE_DELETE_STAGE_DISMISS_ERROR,
} from '../../../../src/features/manage/redux/constants';

import {
  deleteStage,
  dismissDeleteStageError,
  reducer,
} from '../../../../src/features/manage/redux/deleteStage';

import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('manage/redux/deleteStage', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when deleteStage succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .delete('/roadmaps/1/stages/1')
      .reply(200);

    return store.dispatch(deleteStage({ roadmapId: 1, stageId: 1 }))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_DELETE_STAGE_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_DELETE_STAGE_SUCCESS);
      });
  });

  it('dispatches failure action when deleteStage fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .delete('/roadmaps/1/stages/1/')
      .reply(500, {});

    return store.dispatch(deleteStage({ roadmapId: 1, stageId: 1 }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_DELETE_STAGE_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_DELETE_STAGE_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissDeleteStageError', () => {
    const expectedAction = {
      type: MANAGE_DELETE_STAGE_DISMISS_ERROR,
    };
    expect(dismissDeleteStageError()).toEqual(expectedAction);
  });

  it('handles action type MANAGE_DELETE_STAGE_BEGIN correctly', () => {
    const prevState = { deleteStagePending: false };
    const state = reducer(
      prevState,
      { type: MANAGE_DELETE_STAGE_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteStagePending).toBe(true);
  });

  it('handles action type MANAGE_DELETE_STAGE_SUCCESS correctly', () => {
    const prevState = { deleteStagePending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_DELETE_STAGE_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteStagePending).toBe(false);
  });

  it('handles action type MANAGE_DELETE_STAGE_FAILURE correctly', () => {
    const prevState = { deleteStagePending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_DELETE_STAGE_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteStagePending).toBe(false);
    expect(state.deleteStageError).toEqual(expect.anything());
  });

  it('handles action type MANAGE_DELETE_STAGE_DISMISS_ERROR correctly', () => {
    const prevState = { deleteStageError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MANAGE_DELETE_STAGE_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteStageError).toBe(null);
  });
});

