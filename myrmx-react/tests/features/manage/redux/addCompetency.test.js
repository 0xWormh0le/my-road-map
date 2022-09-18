import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MANAGE_ADD_COMPETENCY_BEGIN,
  MANAGE_ADD_COMPETENCY_SUCCESS,
  MANAGE_ADD_COMPETENCY_FAILURE,
  MANAGE_ADD_COMPETENCY_DISMISS_ERROR,
} from '../../../../src/features/manage/redux/constants';

import {
  addCompetency,
  dismissAddCompetencyError,
  reducer,
} from '../../../../src/features/manage/redux/addCompetency';
import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('manage/redux/addCompetency', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when addCompetency succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/roadmaps/1/stages/1/competencies/')
      .reply(201);

    return store.dispatch(addCompetency({ roadmapId: 1, stage: 1}))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_ADD_COMPETENCY_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_ADD_COMPETENCY_SUCCESS);
      });
  });

  it('dispatches failure action when addCompetency fails', () => {
    const store = mockStore({});
    
    nock(config.apiRootUrl)
      .post('/roadmaps/1/stages/1/competencies/')
      .reply(500, {});

    return store.dispatch(addCompetency({ roadmapId: 1, stage: 1 }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_ADD_COMPETENCY_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_ADD_COMPETENCY_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissAddCompetencyError', () => {
    const expectedAction = {
      type: MANAGE_ADD_COMPETENCY_DISMISS_ERROR,
    };
    expect(dismissAddCompetencyError()).toEqual(expectedAction);
  });

  it('handles action type MANAGE_ADD_COMPETENCY_BEGIN correctly', () => {
    const prevState = { addCompetencyPending: false };
    const state = reducer(
      prevState,
      { type: MANAGE_ADD_COMPETENCY_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addCompetencyPending).toBe(true);
  });

  it('handles action type MANAGE_ADD_COMPETENCY_SUCCESS correctly', () => {
    const prevState = { addCompetencyPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_ADD_COMPETENCY_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addCompetencyPending).toBe(false);
  });

  it('handles action type MANAGE_ADD_COMPETENCY_FAILURE correctly', () => {
    const prevState = { addCompetencyPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_ADD_COMPETENCY_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addCompetencyPending).toBe(false);
    expect(state.addCompetencyError).toEqual(expect.anything());
  });

  it('handles action type MANAGE_ADD_COMPETENCY_DISMISS_ERROR correctly', () => {
    const prevState = { addCompetencyError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MANAGE_ADD_COMPETENCY_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addCompetencyError).toBe(null);
  });
});

