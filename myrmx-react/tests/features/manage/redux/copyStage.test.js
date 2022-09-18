import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MANAGE_COPY_STAGE_BEGIN,
  MANAGE_COPY_STAGE_SUCCESS,
  MANAGE_COPY_STAGE_FAILURE,
  MANAGE_COPY_STAGE_DISMISS_ERROR,
} from '../../../../src/features/manage/redux/constants';

import {
  copyStage,
  dismissCopyStageError,
  reducer,
} from '../../../../src/features/manage/redux/copyStage';

import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('manage/redux/copyStage', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when copyStage succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/roadmaps/1/stages/1/copy-stage/')
      .reply(201);

    return store.dispatch(copyStage({roadmapId: 1, stageId: 1}))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_COPY_STAGE_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_COPY_STAGE_SUCCESS);
      });
  });

  it('dispatches failure action when copyStage fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/roadmaps/1/stages/1/copy-stage/')
      .reply(500, {});

    return store.dispatch(copyStage({ roadmapId:1, stageId: 1, error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_COPY_STAGE_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_COPY_STAGE_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissCopyStageError', () => {
    const expectedAction = {
      type: MANAGE_COPY_STAGE_DISMISS_ERROR,
    };
    expect(dismissCopyStageError()).toEqual(expectedAction);
  });

  it('handles action type MANAGE_COPY_STAGE_BEGIN correctly', () => {
    const prevState = { copyStagePending: false };
    const state = reducer(
      prevState,
      { type: MANAGE_COPY_STAGE_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.copyStagePending).toBe(true);
  });

  it('handles action type MANAGE_COPY_STAGE_SUCCESS correctly', () => {
    const prevState = { copyStagePending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_COPY_STAGE_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.copyStagePending).toBe(false);
  });

  it('handles action type MANAGE_COPY_STAGE_FAILURE correctly', () => {
    const prevState = { copyStagePending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_COPY_STAGE_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.copyStagePending).toBe(false);
    expect(state.copyStageError).toEqual(expect.anything());
  });

  it('handles action type MANAGE_COPY_STAGE_DISMISS_ERROR correctly', () => {
    const prevState = { copyStageError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MANAGE_COPY_STAGE_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.copyStageError).toBe(null);
  });
});

