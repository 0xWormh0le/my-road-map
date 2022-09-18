import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MANAGE_UPDATE_COMPETENCY_BEGIN,
  MANAGE_UPDATE_COMPETENCY_SUCCESS,
  MANAGE_UPDATE_COMPETENCY_FAILURE,
  MANAGE_UPDATE_COMPETENCY_DISMISS_ERROR,
} from '../../../../src/features/manage/redux/constants';

import {
  updateCompetency,
  dismissUpdateCompetencyError,
  reducer,
} from '../../../../src/features/manage/redux/updateCompetency';

import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('manage/redux/updateCompetency', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when updateCompetency succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .patch('/roadmaps/1/stages/1/competencies/1/')
      .reply(200);

    return store.dispatch(updateCompetency({roadmap: 1, stage: 1, competency: 1}))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_UPDATE_COMPETENCY_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_UPDATE_COMPETENCY_SUCCESS);
      });
  });

  it('dispatches failure action when updateCompetency fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .patch('/roadmaps/1/stages/1/competencies/1/')
      .reply(500, {});

    return store.dispatch(updateCompetency({roadmap: 1, stage: 1, competency: 1}))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_UPDATE_COMPETENCY_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_UPDATE_COMPETENCY_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissUpdateCompetencyError', () => {
    const expectedAction = {
      type: MANAGE_UPDATE_COMPETENCY_DISMISS_ERROR,
    };
    expect(dismissUpdateCompetencyError()).toEqual(expectedAction);
  });

  it('handles action type MANAGE_UPDATE_COMPETENCY_BEGIN correctly', () => {
    const prevState = { updateCompetencyPending: false };
    const state = reducer(
      prevState,
      { type: MANAGE_UPDATE_COMPETENCY_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateCompetencyPending).toBe(true);
  });

  it('handles action type MANAGE_UPDATE_COMPETENCY_SUCCESS correctly', () => {
    const prevState = { updateCompetencyPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_UPDATE_COMPETENCY_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateCompetencyPending).toBe(false);
  });

  it('handles action type MANAGE_UPDATE_COMPETENCY_FAILURE correctly', () => {
    const prevState = { updateCompetencyPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_UPDATE_COMPETENCY_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateCompetencyPending).toBe(false);
    expect(state.updateCompetencyError).toEqual(expect.anything());
  });

  it('handles action type MANAGE_UPDATE_COMPETENCY_DISMISS_ERROR correctly', () => {
    const prevState = { updateCompetencyError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MANAGE_UPDATE_COMPETENCY_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateCompetencyError).toBe(null);
  });
});

