import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MANAGE_ADD_ROADMAP_BEGIN,
  MANAGE_ADD_ROADMAP_SUCCESS,
  MANAGE_ADD_ROADMAP_FAILURE,
  MANAGE_ADD_ROADMAP_DISMISS_ERROR,
} from '../../../../src/features/manage/redux/constants';

import {
  addRoadmap,
  dismissAddRoadmapError,
  reducer,
} from '../../../../src/features/manage/redux/addRoadmap';
import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('manage/redux/addRoadmap', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when addRoadmap succeeds', () => {
    const store = mockStore({});
    
    nock(config.apiRootUrl)
      .post('/roadmaps/')
      .reply(201);

    return store.dispatch(addRoadmap())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_ADD_ROADMAP_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_ADD_ROADMAP_SUCCESS);
      });
  });

  it('dispatches failure action when addRoadmap fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/roadmaps/')
      .reply(500);
      
    return store.dispatch(addRoadmap({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_ADD_ROADMAP_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_ADD_ROADMAP_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissAddRoadmapError', () => {
    const expectedAction = {
      type: MANAGE_ADD_ROADMAP_DISMISS_ERROR,
    };
    expect(dismissAddRoadmapError()).toEqual(expectedAction);
  });

  it('handles action type MANAGE_ADD_ROADMAP_BEGIN correctly', () => {
    const prevState = { addRoadmapPending: false };
    const state = reducer(
      prevState,
      { type: MANAGE_ADD_ROADMAP_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addRoadmapPending).toBe(true);
  });

  it('handles action type MANAGE_ADD_ROADMAP_SUCCESS correctly', () => {
    const prevState = { addRoadmapPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_ADD_ROADMAP_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addRoadmapPending).toBe(false);
  });

  it('handles action type MANAGE_ADD_ROADMAP_FAILURE correctly', () => {
    const prevState = { addRoadmapPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_ADD_ROADMAP_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addRoadmapPending).toBe(false);
    expect(state.addRoadmapError).toEqual(expect.anything());
  });

  it('handles action type MANAGE_ADD_ROADMAP_DISMISS_ERROR correctly', () => {
    const prevState = { addRoadmapError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MANAGE_ADD_ROADMAP_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addRoadmapError).toBe(null);
  });
});

