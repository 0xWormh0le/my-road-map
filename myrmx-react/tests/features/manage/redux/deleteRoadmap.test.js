import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MANAGE_DELETE_ROADMAP_BEGIN,
  MANAGE_DELETE_ROADMAP_SUCCESS,
  MANAGE_DELETE_ROADMAP_FAILURE,
  MANAGE_DELETE_ROADMAP_DISMISS_ERROR,
} from '../../../../src/features/manage/redux/constants';

import {
  deleteRoadmap,
  dismissDeleteRoadmapError,
  reducer,
} from '../../../../src/features/manage/redux/deleteRoadmap';

import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('manage/redux/deleteRoadmap', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when deleteRoadmap succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .delete('/roadmaps/1/')
      .reply(200);

    return store.dispatch(deleteRoadmap({ roadmapId: 1 }))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_DELETE_ROADMAP_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_DELETE_ROADMAP_SUCCESS);
      });
  });

  it('dispatches failure action when deleteRoadmap fails', () => {
    const store = mockStore({});
    
    nock(config.apiRootUrl)
      .delete('/roadmaps/1/')
      .reply(500, {});

    return store.dispatch(deleteRoadmap({ roadmapId: 1 }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_DELETE_ROADMAP_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_DELETE_ROADMAP_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissDeleteRoadmapError', () => {
    const expectedAction = {
      type: MANAGE_DELETE_ROADMAP_DISMISS_ERROR,
    };
    expect(dismissDeleteRoadmapError()).toEqual(expectedAction);
  });

  it('handles action type MANAGE_DELETE_ROADMAP_BEGIN correctly', () => {
    const prevState = { deleteRoadmapPending: false };
    const state = reducer(
      prevState,
      { type: MANAGE_DELETE_ROADMAP_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteRoadmapPending).toBe(true);
  });

  it('handles action type MANAGE_DELETE_ROADMAP_SUCCESS correctly', () => {
    const prevState = { deleteRoadmapPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_DELETE_ROADMAP_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteRoadmapPending).toBe(false);
  });

  it('handles action type MANAGE_DELETE_ROADMAP_FAILURE correctly', () => {
    const prevState = { deleteRoadmapPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_DELETE_ROADMAP_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteRoadmapPending).toBe(false);
    expect(state.deleteRoadmapError).toEqual(expect.anything());
  });

  it('handles action type MANAGE_DELETE_ROADMAP_DISMISS_ERROR correctly', () => {
    const prevState = { deleteRoadmapError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MANAGE_DELETE_ROADMAP_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteRoadmapError).toBe(null);
  });
});

