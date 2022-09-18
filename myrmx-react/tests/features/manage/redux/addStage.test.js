import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MANAGE_ADD_STAGE_BEGIN,
  MANAGE_ADD_STAGE_SUCCESS,
  MANAGE_ADD_STAGE_FAILURE,
  MANAGE_ADD_STAGE_DISMISS_ERROR,
} from '../../../../src/features/manage/redux/constants';

import {
  addStage,
  dismissAddStageError,
  reducer,
} from '../../../../src/features/manage/redux/addStage';

import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('manage/redux/addStage', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when addStage succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/roadmaps/1/stages/')
      .reply(201);

    return store.dispatch(addStage({ roadmap: 1 }))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_ADD_STAGE_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_ADD_STAGE_SUCCESS);
      });
  });

  it('dispatches failure action when addStage fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/roadmaps/1/stages/')
      .reply(500, {});

    return store.dispatch(addStage({ roadmap: 1 }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_ADD_STAGE_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_ADD_STAGE_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissAddStageError', () => {
    const expectedAction = {
      type: MANAGE_ADD_STAGE_DISMISS_ERROR,
    };
    expect(dismissAddStageError()).toEqual(expectedAction);
  });

  it('handles action type MANAGE_ADD_STAGE_BEGIN correctly', () => {
    const prevState = { addStagePending: false };
    const state = reducer(
      prevState,
      { type: MANAGE_ADD_STAGE_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addStagePending).toBe(true);
  });

  it('handles action type MANAGE_ADD_STAGE_SUCCESS correctly', () => {
    const prevState = { addStagePending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_ADD_STAGE_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addStagePending).toBe(false);
  });

  it('handles action type MANAGE_ADD_STAGE_FAILURE correctly', () => {
    const prevState = { addStagePending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_ADD_STAGE_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addStagePending).toBe(false);
    expect(state.addStageError).toEqual(expect.anything());
  });

  it('handles action type MANAGE_ADD_STAGE_DISMISS_ERROR correctly', () => {
    const prevState = { addStageError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MANAGE_ADD_STAGE_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addStageError).toBe(null);
  });
});

