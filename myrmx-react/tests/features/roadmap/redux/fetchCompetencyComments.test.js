import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  ROADMAP_FETCH_COMPETENCY_COMMENTS_BEGIN,
  ROADMAP_FETCH_COMPETENCY_COMMENTS_SUCCESS,
  ROADMAP_FETCH_COMPETENCY_COMMENTS_FAILURE,
  ROADMAP_FETCH_COMPETENCY_COMMENTS_DISMISS_ERROR,
} from '../../../../src/features/roadmap/redux/constants';

import {
  fetchCompetencyComments,
  dismissFetchCompetencyCommentsError,
  reducer,
} from '../../../../src/features/roadmap/redux/fetchCompetencyComments';

import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('roadmap/redux/fetchCompetencyComments', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when fetchCompetencyComments succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .get('/roadmaps/1/stages/1/competencies/1/comments/?ordering=-date')
      .reply(200, {});

    return store.dispatch(fetchCompetencyComments({ roadmapId: 1, stageId: 1, competencyId: 1 }))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ROADMAP_FETCH_COMPETENCY_COMMENTS_BEGIN);
        expect(actions[1]).toHaveProperty('type', ROADMAP_FETCH_COMPETENCY_COMMENTS_SUCCESS);
      });
  });

  it('dispatches failure action when fetchCompetencyComments fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .get('/roadmaps/1/stages/1/competencies/1/comments/')
      .reply(500, {});

    return store.dispatch(fetchCompetencyComments({ roadmapId: 1, stageId: 1, competencyId: 1 }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ROADMAP_FETCH_COMPETENCY_COMMENTS_BEGIN);
        expect(actions[1]).toHaveProperty('type', ROADMAP_FETCH_COMPETENCY_COMMENTS_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissFetchCompetencyCommentsError', () => {
    const expectedAction = {
      type: ROADMAP_FETCH_COMPETENCY_COMMENTS_DISMISS_ERROR,
    };
    expect(dismissFetchCompetencyCommentsError()).toEqual(expectedAction);
  });

  it('handles action type ROADMAP_FETCH_COMPETENCY_COMMENTS_BEGIN correctly', () => {
    const prevState = { fetchCompetencyCommentsPending: false };
    const state = reducer(
      prevState,
      { type: ROADMAP_FETCH_COMPETENCY_COMMENTS_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchCompetencyCommentsPending).toBe(true);
  });

  it('handles action type ROADMAP_FETCH_COMPETENCY_COMMENTS_SUCCESS correctly', () => {
    const prevState = { fetchCompetencyCommentsPending: true };
    const state = reducer(
      prevState,
      { type: ROADMAP_FETCH_COMPETENCY_COMMENTS_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchCompetencyCommentsPending).toBe(false);
  });

  it('handles action type ROADMAP_FETCH_COMPETENCY_COMMENTS_FAILURE correctly', () => {
    const prevState = { fetchCompetencyCommentsPending: true };
    const state = reducer(
      prevState,
      { type: ROADMAP_FETCH_COMPETENCY_COMMENTS_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchCompetencyCommentsPending).toBe(false);
    expect(state.fetchCompetencyCommentsError).toEqual(expect.anything());
  });

  it('handles action type ROADMAP_FETCH_COMPETENCY_COMMENTS_DISMISS_ERROR correctly', () => {
    const prevState = { fetchCompetencyCommentsError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: ROADMAP_FETCH_COMPETENCY_COMMENTS_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchCompetencyCommentsError).toBe(null);
  });
});

