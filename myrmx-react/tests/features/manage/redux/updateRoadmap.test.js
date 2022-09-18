import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MANAGE_UPDATE_ROADMAP_BEGIN,
  MANAGE_UPDATE_ROADMAP_SUCCESS,
  MANAGE_UPDATE_ROADMAP_FAILURE,
  MANAGE_UPDATE_ROADMAP_DISMISS_ERROR,
} from '../../../../src/features/manage/redux/constants';

import {
  updateRoadmap,
  dismissUpdateRoadmapError,
  reducer,
} from '../../../../src/features/manage/redux/updateRoadmap';

import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('manage/redux/updateRoadmap', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when updateRoadmap succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .patch('/roadmaps/1/')
      .reply(200);

    return store.dispatch(updateRoadmap({ roadmapId: 1}))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_UPDATE_ROADMAP_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_UPDATE_ROADMAP_SUCCESS);
      });
  });

  it('dispatches failure action when updateRoadmap fails', () => {
    const store = mockStore({});
    
    nock(config.apiRootUrl)
      .patch('/roadmaps/1/')
      .reply(500, {});

    return store.dispatch(updateRoadmap({ roadmapId: 1 }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_UPDATE_ROADMAP_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_UPDATE_ROADMAP_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissUpdateRoadmapError', () => {
    const expectedAction = {
      type: MANAGE_UPDATE_ROADMAP_DISMISS_ERROR,
    };
    expect(dismissUpdateRoadmapError()).toEqual(expectedAction);
  });

  it('handles action type MANAGE_UPDATE_ROADMAP_BEGIN correctly', () => {
    const prevState = { updateRoadmapPending: false };
    const state = reducer(
      prevState,
      { type: MANAGE_UPDATE_ROADMAP_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateRoadmapPending).toBe(true);
  });

  it('handles action type MANAGE_UPDATE_ROADMAP_SUCCESS correctly', () => {
    const prevState = { updateRoadmapPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_UPDATE_ROADMAP_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateRoadmapPending).toBe(false);
  });

  it('handles action type MANAGE_UPDATE_ROADMAP_FAILURE correctly', () => {
    const prevState = { updateRoadmapPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_UPDATE_ROADMAP_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateRoadmapPending).toBe(false);
    expect(state.updateRoadmapError).toEqual(expect.anything());
  });

  it('handles action type MANAGE_UPDATE_ROADMAP_DISMISS_ERROR correctly', () => {
    const prevState = { updateRoadmapError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MANAGE_UPDATE_ROADMAP_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateRoadmapError).toBe(null);
  });
});

