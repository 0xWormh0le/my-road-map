import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MANAGE_HIDE_COMPETENCY_BEGIN,
  MANAGE_HIDE_COMPETENCY_SUCCESS,
  MANAGE_HIDE_COMPETENCY_FAILURE,
  MANAGE_HIDE_COMPETENCY_DISMISS_ERROR,
} from '../../../../src/features/manage/redux/constants';

import {
  hideCompetency,
  dismissHideCompetencyError,
  reducer,
} from '../../../../src/features/manage/redux/hideCompetency';
import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('manage/redux/hideCompetency', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when hideCompetency succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/roadmaps/1/stages/1/competencies/1/hide-from-student/')
      .reply(200);

    return store.dispatch(hideCompetency({ roadmapId: 1, stageId: 1, competencyId: 1, hide: true }))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_HIDE_COMPETENCY_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_HIDE_COMPETENCY_SUCCESS);
      });
  });

  it('dispatches failure action when hideCompetency fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/roadmaps/1/stages/1/competencies/1/hide-from-student/')
      .reply(500);
    return store.dispatch(hideCompetency({ roadmapId: 1, stageId: 1, competencyId: 1, hide: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_HIDE_COMPETENCY_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_HIDE_COMPETENCY_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissHideCompetencyError', () => {
    const expectedAction = {
      type: MANAGE_HIDE_COMPETENCY_DISMISS_ERROR,
    };
    expect(dismissHideCompetencyError()).toEqual(expectedAction);
  });

  it('handles action type MANAGE_HIDE_COMPETENCY_BEGIN correctly', () => {
    const prevState = { hideCompetencyPending: false };
    const state = reducer(
      prevState,
      { type: MANAGE_HIDE_COMPETENCY_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.hideCompetencyPending).toBe(true);
  });

  it('handles action type MANAGE_HIDE_COMPETENCY_SUCCESS correctly', () => {
    const prevState = { hideCompetencyPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_HIDE_COMPETENCY_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.hideCompetencyPending).toBe(false);
  });

  it('handles action type MANAGE_HIDE_COMPETENCY_FAILURE correctly', () => {
    const prevState = { hideCompetencyPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_HIDE_COMPETENCY_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.hideCompetencyPending).toBe(false);
    expect(state.hideCompetencyError).toEqual(expect.anything());
  });

  it('handles action type MANAGE_HIDE_COMPETENCY_DISMISS_ERROR correctly', () => {
    const prevState = { hideCompetencyError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MANAGE_HIDE_COMPETENCY_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.hideCompetencyError).toBe(null);
  });
});

