import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  ROADMAP_SUBMIT_RECENT_COMPETENCY_BEGIN,
  ROADMAP_SUBMIT_RECENT_COMPETENCY_SUCCESS,
  ROADMAP_SUBMIT_RECENT_COMPETENCY_FAILURE,
  ROADMAP_SUBMIT_RECENT_COMPETENCY_DISMISS_ERROR,
} from '../../../../src/features/roadmap/redux/constants';

import {
  submitRecentCompetency,
  dismissSubmitRecentCompetencyError,
  reducer,
} from '../../../../src/features/roadmap/redux/submitRecentCompetency';
import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('roadmap/redux/submitRecentCompetency', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when submitRecentCompetency succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/recent-competencies/')
      .reply(200);

    return store.dispatch(submitRecentCompetency())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ROADMAP_SUBMIT_RECENT_COMPETENCY_BEGIN);
        expect(actions[1]).toHaveProperty('type', ROADMAP_SUBMIT_RECENT_COMPETENCY_SUCCESS);
      });
  });

  it('dispatches failure action when submitRecentCompetency fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/recent-competencies/')
      .reply(500, {});

    return store.dispatch(submitRecentCompetency({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ROADMAP_SUBMIT_RECENT_COMPETENCY_BEGIN);
        expect(actions[1]).toHaveProperty('type', ROADMAP_SUBMIT_RECENT_COMPETENCY_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissSubmitRecentCompetencyError', () => {
    const expectedAction = {
      type: ROADMAP_SUBMIT_RECENT_COMPETENCY_DISMISS_ERROR,
    };
    expect(dismissSubmitRecentCompetencyError()).toEqual(expectedAction);
  });

  it('handles action type ROADMAP_SUBMIT_RECENT_COMPETENCY_BEGIN correctly', () => {
    const prevState = { submitRecentCompetencyPending: false };
    const state = reducer(
      prevState,
      { type: ROADMAP_SUBMIT_RECENT_COMPETENCY_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.submitRecentCompetencyPending).toBe(true);
  });

  it('handles action type ROADMAP_SUBMIT_RECENT_COMPETENCY_SUCCESS correctly', () => {
    const prevState = { submitRecentCompetencyPending: true };
    const state = reducer(
      prevState,
      { type: ROADMAP_SUBMIT_RECENT_COMPETENCY_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.submitRecentCompetencyPending).toBe(false);
  });

  it('handles action type ROADMAP_SUBMIT_RECENT_COMPETENCY_FAILURE correctly', () => {
    const prevState = { submitRecentCompetencyPending: true };
    const state = reducer(
      prevState,
      { type: ROADMAP_SUBMIT_RECENT_COMPETENCY_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.submitRecentCompetencyPending).toBe(false);
    expect(state.submitRecentCompetencyError).toEqual(expect.anything());
  });

  it('handles action type ROADMAP_SUBMIT_RECENT_COMPETENCY_DISMISS_ERROR correctly', () => {
    const prevState = { submitRecentCompetencyError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: ROADMAP_SUBMIT_RECENT_COMPETENCY_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.submitRecentCompetencyError).toBe(null);
  });
});

