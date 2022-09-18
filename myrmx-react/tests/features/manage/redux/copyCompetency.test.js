import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MANAGE_COPY_COMPETENCY_BEGIN,
  MANAGE_COPY_COMPETENCY_SUCCESS,
  MANAGE_COPY_COMPETENCY_FAILURE,
  MANAGE_COPY_COMPETENCY_DISMISS_ERROR,
} from '../../../../src/features/manage/redux/constants';

import {
  copyCompetency,
  dismissCopyCompetencyError,
  reducer,
} from '../../../../src/features/manage/redux/copyCompetency';

import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('manage/redux/copyCompetency', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when copyCompetency succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/roadmaps/1/stages/1/competencies/1/copy-competency/')
      .reply(201);

    return store.dispatch(copyCompetency({roadmapId: 1, stageId: 1, competencyId: 1}))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_COPY_COMPETENCY_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_COPY_COMPETENCY_SUCCESS);
      });
  });

  it('dispatches failure action when copyCompetency fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/roadmaps/1/stages/1/competencies/1/copy-competency/')
      .reply(500, {});

    return store.dispatch(copyCompetency({roadmapId: 1, stageId: 1, competencyId: 1}))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_COPY_COMPETENCY_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_COPY_COMPETENCY_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissCopyCompetencyError', () => {
    const expectedAction = {
      type: MANAGE_COPY_COMPETENCY_DISMISS_ERROR,
    };
    expect(dismissCopyCompetencyError()).toEqual(expectedAction);
  });

  it('handles action type MANAGE_COPY_COMPETENCY_BEGIN correctly', () => {
    const prevState = { copyCompetencyPending: false };
    const state = reducer(
      prevState,
      { type: MANAGE_COPY_COMPETENCY_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.copyCompetencyPending).toBe(true);
  });

  it('handles action type MANAGE_COPY_COMPETENCY_SUCCESS correctly', () => {
    const prevState = { copyCompetencyPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_COPY_COMPETENCY_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.copyCompetencyPending).toBe(false);
  });

  it('handles action type MANAGE_COPY_COMPETENCY_FAILURE correctly', () => {
    const prevState = { copyCompetencyPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_COPY_COMPETENCY_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.copyCompetencyPending).toBe(false);
    expect(state.copyCompetencyError).toEqual(expect.anything());
  });

  it('handles action type MANAGE_COPY_COMPETENCY_DISMISS_ERROR correctly', () => {
    const prevState = { copyCompetencyError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MANAGE_COPY_COMPETENCY_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.copyCompetencyError).toBe(null);
  });
});

