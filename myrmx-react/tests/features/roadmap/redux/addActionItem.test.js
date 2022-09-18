import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  ROADMAP_ADD_ACTION_ITEM_BEGIN,
  ROADMAP_ADD_ACTION_ITEM_SUCCESS,
  ROADMAP_ADD_ACTION_ITEM_FAILURE,
  ROADMAP_ADD_ACTION_ITEM_DISMISS_ERROR,
} from '../../../../src/features/roadmap/redux/constants';

import {
  addActionItem,
  dismissAddActionItemError,
  reducer,
} from '../../../../src/features/roadmap/redux/addActionItem';

import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('roadmap/redux/addActionItem', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when addActionItem succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/roadmaps/1/stages/1/competencies/1/action-item-assessments/')
      .reply(200);

    return store.dispatch(addActionItem({ roadmapId: 1, stageId: 1, competencyId: 1 }))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ROADMAP_ADD_ACTION_ITEM_BEGIN);
        expect(actions[1]).toHaveProperty('type', ROADMAP_ADD_ACTION_ITEM_SUCCESS);
      });
  });

  it('dispatches failure action when addActionItem fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/roadmaps/1/stages/1/competencies/1/action-item-assessments/')
      .reply(500, {});

    return store.dispatch(addActionItem({ roadmapId: 1, stageId: 1, competencyId: 1 }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ROADMAP_ADD_ACTION_ITEM_BEGIN);
        expect(actions[1]).toHaveProperty('type', ROADMAP_ADD_ACTION_ITEM_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissAddActionItemError', () => {
    const expectedAction = {
      type: ROADMAP_ADD_ACTION_ITEM_DISMISS_ERROR,
    };
    expect(dismissAddActionItemError()).toEqual(expectedAction);
  });

  it('handles action type ROADMAP_ADD_ACTION_ITEM_BEGIN correctly', () => {
    const prevState = { addActionItemPending: false };
    const state = reducer(
      prevState,
      { type: ROADMAP_ADD_ACTION_ITEM_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addActionItemPending).toBe(true);
  });

  it('handles action type ROADMAP_ADD_ACTION_ITEM_SUCCESS correctly', () => {
    const prevState = { addActionItemPending: true, competencies: { 1: { action_item_ids: [] } } };
    const state = reducer(
      prevState,
      { type: ROADMAP_ADD_ACTION_ITEM_SUCCESS, data: { competency: 1 } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addActionItemPending).toBe(false);
  });

  it('handles action type ROADMAP_ADD_ACTION_ITEM_FAILURE correctly', () => {
    const prevState = { addActionItemPending: true };
    const state = reducer(
      prevState,
      { type: ROADMAP_ADD_ACTION_ITEM_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addActionItemPending).toBe(false);
    expect(state.addActionItemError).toEqual(expect.anything());
  });

  it('handles action type ROADMAP_ADD_ACTION_ITEM_DISMISS_ERROR correctly', () => {
    const prevState = { addActionItemError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: ROADMAP_ADD_ACTION_ITEM_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addActionItemError).toBe(null);
  });
});

