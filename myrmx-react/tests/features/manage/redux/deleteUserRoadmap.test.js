import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MANAGE_DELETE_USER_ROADMAP_BEGIN,
  MANAGE_DELETE_USER_ROADMAP_SUCCESS,
  MANAGE_DELETE_USER_ROADMAP_FAILURE,
  MANAGE_DELETE_USER_ROADMAP_DISMISS_ERROR,
} from '../../../../src/features/manage/redux/constants';

import {
  deleteUserRoadmap,
  dismissDeleteUserRoadmapError,
  reducer,
} from '../../../../src/features/manage/redux/deleteUserRoadmap';

import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('manage/redux/deleteUserRoadmap', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when deleteUserRoadmap succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .delete('/users/1/assigned-roadmaps/1/')
      .reply(200);

    return store.dispatch(deleteUserRoadmap({ userId: 1, roadmapId: 1 }))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_DELETE_USER_ROADMAP_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_DELETE_USER_ROADMAP_SUCCESS);
      });
  });

  it('dispatches failure action when deleteUserRoadmap fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .delete('/users/1/assigned-roadmaps/1/')
      .reply(500, {});

    return store.dispatch(deleteUserRoadmap({ error: true, userId: 1, roadmapId: 1 }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_DELETE_USER_ROADMAP_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_DELETE_USER_ROADMAP_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissDeleteUserRoadmapError', () => {
    const expectedAction = {
      type: MANAGE_DELETE_USER_ROADMAP_DISMISS_ERROR,
    };
    expect(dismissDeleteUserRoadmapError()).toEqual(expectedAction);
  });

  it('handles action type MANAGE_DELETE_USER_ROADMAP_BEGIN correctly', () => {
    const prevState = { deleteUserRoadmapPending: false };
    const state = reducer(
      prevState,
      { type: MANAGE_DELETE_USER_ROADMAP_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteUserRoadmapPending).toBe(true);
  });

  it('handles action type MANAGE_DELETE_USER_ROADMAP_SUCCESS correctly', () => {
    const prevState = {
      deleteUserRoadmapPending: true,
      userRoadmaps: {
        assigned: [],
        available: []
      }
    };
    const state = reducer(
      prevState,
      { type: MANAGE_DELETE_USER_ROADMAP_SUCCESS, data: 1 }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteUserRoadmapPending).toBe(false);
  });

  it('handles action type MANAGE_DELETE_USER_ROADMAP_FAILURE correctly', () => {
    const prevState = { deleteUserRoadmapPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_DELETE_USER_ROADMAP_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteUserRoadmapPending).toBe(false);
    expect(state.deleteUserRoadmapError).toEqual(expect.anything());
  });

  it('handles action type MANAGE_DELETE_USER_ROADMAP_DISMISS_ERROR correctly', () => {
    const prevState = { deleteUserRoadmapError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MANAGE_DELETE_USER_ROADMAP_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteUserRoadmapError).toBe(null);
  });
});

