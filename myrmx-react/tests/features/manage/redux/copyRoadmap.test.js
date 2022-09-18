import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MANAGE_COPY_ROADMAP_BEGIN,
  MANAGE_COPY_ROADMAP_SUCCESS,
  MANAGE_COPY_ROADMAP_FAILURE,
  MANAGE_COPY_ROADMAP_DISMISS_ERROR,
} from '../../../../src/features/manage/redux/constants';

import {
  copyRoadmap,
  dismissCopyRoadmapError,
  reducer,
} from '../../../../src/features/manage/redux/copyRoadmap';

import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('manage/redux/copyRoadmap', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when copyRoadmap succeeds', () => {
    const store = mockStore({});
    nock(config.apiRootUrl)
      .post('/roadmaps/1/copy-roadmap/')
      .reply(201);

    return store.dispatch(copyRoadmap({ roadmapId: 1 }))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_COPY_ROADMAP_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_COPY_ROADMAP_SUCCESS);
      });
  });

  it('dispatches failure action when copyRoadmap fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/roadmaps/1/copy-roadmap/')
      .reply(500, {});

    return store.dispatch(copyRoadmap({ roadmapId: 1 }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_COPY_ROADMAP_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_COPY_ROADMAP_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissCopyRoadmapError', () => {
    const expectedAction = {
      type: MANAGE_COPY_ROADMAP_DISMISS_ERROR,
    };
    expect(dismissCopyRoadmapError()).toEqual(expectedAction);
  });

  it('handles action type MANAGE_COPY_ROADMAP_BEGIN correctly', () => {
    const prevState = { copyRoadmapPending: false };
    const state = reducer(
      prevState,
      { type: MANAGE_COPY_ROADMAP_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.copyRoadmapPending).toBe(true);
  });

  it('handles action type MANAGE_COPY_ROADMAP_SUCCESS correctly', () => {
    const prevState = { copyRoadmapPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_COPY_ROADMAP_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.copyRoadmapPending).toBe(false);
  });

  it('handles action type MANAGE_COPY_ROADMAP_FAILURE correctly', () => {
    const prevState = { copyRoadmapPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_COPY_ROADMAP_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.copyRoadmapPending).toBe(false);
    expect(state.copyRoadmapError).toEqual(expect.anything());
  });

  it('handles action type MANAGE_COPY_ROADMAP_DISMISS_ERROR correctly', () => {
    const prevState = { copyRoadmapError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MANAGE_COPY_ROADMAP_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.copyRoadmapError).toBe(null);
  });
});

