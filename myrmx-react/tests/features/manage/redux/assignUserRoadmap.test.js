import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MANAGE_ASSIGN_USER_ROADMAP_BEGIN,
  MANAGE_ASSIGN_USER_ROADMAP_SUCCESS,
  MANAGE_ASSIGN_USER_ROADMAP_FAILURE,
  MANAGE_ASSIGN_USER_ROADMAP_DISMISS_ERROR,
} from '../../../../src/features/manage/redux/constants';

import {
  assignUserRoadmap,
  dismissAssignUserRoadmapError,
  reducer,
} from '../../../../src/features/manage/redux/assignUserRoadmap';
import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('manage/redux/assignUserRoadmap', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when assignUserRoadmap succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/users/1/assigned-roadmaps/')
      .reply(201);

    return store.dispatch(assignUserRoadmap({ userId: 1 }))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_ASSIGN_USER_ROADMAP_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_ASSIGN_USER_ROADMAP_SUCCESS);
      });
  });

  it('dispatches failure action when assignUserRoadmap fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/users/1/assigned-roadmaps/')
      .reply(500, {});

    return store.dispatch(assignUserRoadmap({ error: true, userId: 1 }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_ASSIGN_USER_ROADMAP_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_ASSIGN_USER_ROADMAP_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissAssignUserRoadmapError', () => {
    const expectedAction = {
      type: MANAGE_ASSIGN_USER_ROADMAP_DISMISS_ERROR,
    };
    expect(dismissAssignUserRoadmapError()).toEqual(expectedAction);
  });

  it('handles action type MANAGE_ASSIGN_USER_ROADMAP_BEGIN correctly', () => {
    const prevState = { assignUserRoadmapPending: false };
    const state = reducer(
      prevState,
      { type: MANAGE_ASSIGN_USER_ROADMAP_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.assignUserRoadmapPending).toBe(true);
  });

  it('handles action type MANAGE_ASSIGN_USER_ROADMAP_SUCCESS correctly', () => {
    const prevState = {
      assignUserRoadmapPending: true,
      userRoadmaps: {
        available: [],
        assigned: []
      }
    };
    const state = reducer(
      prevState,
      { type: MANAGE_ASSIGN_USER_ROADMAP_SUCCESS, data: 1 }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.assignUserRoadmapPending).toBe(false);
  });

  it('handles action type MANAGE_ASSIGN_USER_ROADMAP_FAILURE correctly', () => {
    const prevState = { assignUserRoadmapPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_ASSIGN_USER_ROADMAP_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.assignUserRoadmapPending).toBe(false);
    expect(state.assignUserRoadmapError).toEqual(expect.anything());
  });

  it('handles action type MANAGE_ASSIGN_USER_ROADMAP_DISMISS_ERROR correctly', () => {
    const prevState = { assignUserRoadmapError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MANAGE_ASSIGN_USER_ROADMAP_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.assignUserRoadmapError).toBe(null);
  });
});

