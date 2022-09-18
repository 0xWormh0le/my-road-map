import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MANAGE_UPDATE_STAGE_BEGIN,
  MANAGE_UPDATE_STAGE_SUCCESS,
  MANAGE_UPDATE_STAGE_FAILURE,
  MANAGE_UPDATE_STAGE_DISMISS_ERROR,
} from '../../../../src/features/manage/redux/constants';

import {
  updateStage,
  dismissUpdateStageError,
  reducer,
} from '../../../../src/features/manage/redux/updateStage';

import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('manage/redux/updateStage', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when updateStage succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .patch('/roadmaps/1/stages/1/')
      .reply(200);

    return store.dispatch(updateStage({ roadmap: 1, stage: 1 }))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_UPDATE_STAGE_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_UPDATE_STAGE_SUCCESS);
      });
  });

  it('dispatches failure action when updateStage fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .patch('/roadmaps/1/stages/1/')
      .reply(500, {});

    return store.dispatch(updateStage({ roadmap: 1, stage: 1 }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_UPDATE_STAGE_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_UPDATE_STAGE_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissUpdateStageError', () => {
    const expectedAction = {
      type: MANAGE_UPDATE_STAGE_DISMISS_ERROR,
    };
    expect(dismissUpdateStageError()).toEqual(expectedAction);
  });

  it('handles action type MANAGE_UPDATE_STAGE_BEGIN correctly', () => {
    const prevState = { updateStagePending: false };
    const state = reducer(
      prevState,
      { type: MANAGE_UPDATE_STAGE_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateStagePending).toBe(true);
  });

  it('handles action type MANAGE_UPDATE_STAGE_SUCCESS correctly', () => {
    const prevState = { updateStagePending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_UPDATE_STAGE_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateStagePending).toBe(false);
  });

  it('handles action type MANAGE_UPDATE_STAGE_FAILURE correctly', () => {
    const prevState = { updateStagePending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_UPDATE_STAGE_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateStagePending).toBe(false);
    expect(state.updateStageError).toEqual(expect.anything());
  });

  it('handles action type MANAGE_UPDATE_STAGE_DISMISS_ERROR correctly', () => {
    const prevState = { updateStageError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MANAGE_UPDATE_STAGE_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateStageError).toBe(null);
  });
});

