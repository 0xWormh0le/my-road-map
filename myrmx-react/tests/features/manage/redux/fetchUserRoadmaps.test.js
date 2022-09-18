import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MANAGE_FETCH_USER_ROADMAPS_BEGIN,
  MANAGE_FETCH_USER_ROADMAPS_SUCCESS,
  MANAGE_FETCH_USER_ROADMAPS_FAILURE,
  MANAGE_FETCH_USER_ROADMAPS_DISMISS_ERROR,
} from '../../../../src/features/manage/redux/constants';

import {
  fetchUserRoadmaps,
  dismissFetchUserRoadmapsError,
  reducer,
} from '../../../../src/features/manage/redux/fetchUserRoadmaps';
import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('manage/redux/fetchUserRoadmaps', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when fetchUserRoadmaps succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .get('/users/1/assigned-roadmaps/')
      .reply(200);

    return store.dispatch(fetchUserRoadmaps({ userId: 1, type: 'assigned' }))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_FETCH_USER_ROADMAPS_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_FETCH_USER_ROADMAPS_SUCCESS);
      });
  });

  it('dispatches failure action when fetchUserRoadmaps fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .get('/users/1/assigned-roadmaps/')
      .reply(500, {});

    return store.dispatch(fetchUserRoadmaps({ userId: 1, type: 'assigned', error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_FETCH_USER_ROADMAPS_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_FETCH_USER_ROADMAPS_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissFetchUserRoadmapsError', () => {
    const expectedAction = {
      type: MANAGE_FETCH_USER_ROADMAPS_DISMISS_ERROR,
    };
    expect(dismissFetchUserRoadmapsError()).toEqual(expectedAction);
  });

  it('handles action type MANAGE_FETCH_USER_ROADMAPS_BEGIN correctly', () => {
    const prevState = { fetchUserRoadmapsPending: false };
    const state = reducer(
      prevState,
      { type: MANAGE_FETCH_USER_ROADMAPS_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchUserRoadmapsPending).toBe(true);
  });

  it('handles action type MANAGE_FETCH_USER_ROADMAPS_SUCCESS correctly', () => {
    const prevState = { fetchUserRoadmapsPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_FETCH_USER_ROADMAPS_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchUserRoadmapsPending).toBe(false);
  });

  it('handles action type MANAGE_FETCH_USER_ROADMAPS_FAILURE correctly', () => {
    const prevState = { fetchUserRoadmapsPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_FETCH_USER_ROADMAPS_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchUserRoadmapsPending).toBe(false);
    expect(state.fetchUserRoadmapsError).toEqual(expect.anything());
  });

  it('handles action type MANAGE_FETCH_USER_ROADMAPS_DISMISS_ERROR correctly', () => {
    const prevState = { fetchUserRoadmapsError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MANAGE_FETCH_USER_ROADMAPS_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchUserRoadmapsError).toBe(null);
  });
});

