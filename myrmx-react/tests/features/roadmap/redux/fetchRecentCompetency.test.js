import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  ROADMAP_FETCH_RECENT_COMPETENCY_BEGIN,
  ROADMAP_FETCH_RECENT_COMPETENCY_SUCCESS,
  ROADMAP_FETCH_RECENT_COMPETENCY_FAILURE,
  ROADMAP_FETCH_RECENT_COMPETENCY_DISMISS_ERROR,
} from '../../../../src/features/roadmap/redux/constants';

import {
  fetchRecentCompetency,
  dismissFetchRecentCompetencyError,
  reducer,
} from '../../../../src/features/roadmap/redux/fetchRecentCompetency';

import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('roadmap/redux/fetchRecentCompetency', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when fetchRecentCompetency succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .get('/recent-competencies/')
      .reply(200, {});

    return store.dispatch(fetchRecentCompetency())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ROADMAP_FETCH_RECENT_COMPETENCY_BEGIN);
        expect(actions[1]).toHaveProperty('type', ROADMAP_FETCH_RECENT_COMPETENCY_SUCCESS);
      });
  });

  it('dispatches failure action when fetchRecentCompetency fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .get('/recent-competencies/')
      .reply(500, {});

    return store.dispatch(fetchRecentCompetency({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ROADMAP_FETCH_RECENT_COMPETENCY_BEGIN);
        expect(actions[1]).toHaveProperty('type', ROADMAP_FETCH_RECENT_COMPETENCY_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissFetchRecentCompetencyError', () => {
    const expectedAction = {
      type: ROADMAP_FETCH_RECENT_COMPETENCY_DISMISS_ERROR,
    };
    expect(dismissFetchRecentCompetencyError()).toEqual(expectedAction);
  });

  it('handles action type ROADMAP_FETCH_RECENT_COMPETENCY_BEGIN correctly', () => {
    const prevState = { fetchRecentCompetencyPending: false };
    const state = reducer(
      prevState,
      { type: ROADMAP_FETCH_RECENT_COMPETENCY_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchRecentCompetencyPending).toBe(true);
  });

  it('handles action type ROADMAP_FETCH_RECENT_COMPETENCY_SUCCESS correctly', () => {
    const prevState = { fetchRecentCompetencyPending: true };
    const state = reducer(
      prevState,
      { type: ROADMAP_FETCH_RECENT_COMPETENCY_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchRecentCompetencyPending).toBe(false);
  });

  it('handles action type ROADMAP_FETCH_RECENT_COMPETENCY_FAILURE correctly', () => {
    const prevState = { fetchRecentCompetencyPending: true };
    const state = reducer(
      prevState,
      { type: ROADMAP_FETCH_RECENT_COMPETENCY_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchRecentCompetencyPending).toBe(false);
    expect(state.fetchRecentCompetencyError).toEqual(expect.anything());
  });

  it('handles action type ROADMAP_FETCH_RECENT_COMPETENCY_DISMISS_ERROR correctly', () => {
    const prevState = { fetchRecentCompetencyError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: ROADMAP_FETCH_RECENT_COMPETENCY_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchRecentCompetencyError).toBe(null);
  });
});

