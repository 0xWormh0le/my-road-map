import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  ROADMAP_DELETE_ACTION_ITEM_BEGIN,
  ROADMAP_DELETE_ACTION_ITEM_SUCCESS,
  ROADMAP_DELETE_ACTION_ITEM_FAILURE,
  ROADMAP_DELETE_ACTION_ITEM_DISMISS_ERROR,
} from '../../../../src/features/roadmap/redux/constants';

import {
  deleteActionItem,
  dismissDeleteActionItemError,
  reducer,
} from '../../../../src/features/roadmap/redux/deleteActionItem';

import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('roadmap/redux/deleteActionItem', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when deleteActionItem succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .delete('/roadmaps/1/stages/1/competencies/1/action-item-assessments/1/')
      .reply(204);

    return store.dispatch(deleteActionItem({ roadmapId: 1, stageId: 1, competencyId: 1, actionItemId: 1 }))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ROADMAP_DELETE_ACTION_ITEM_BEGIN);
        expect(actions[1]).toHaveProperty('type', ROADMAP_DELETE_ACTION_ITEM_SUCCESS);
      });
  });

  it('dispatches failure action when deleteActionItem fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .delete('/roadmaps/1/stages/1/competencies/1/action-item-assessments/1/')
      .reply(500, {});

    return store.dispatch(deleteActionItem({ roadmapId: 1, stageId: 1, competencyId: 1, actionItemId: 1 }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ROADMAP_DELETE_ACTION_ITEM_BEGIN);
        expect(actions[1]).toHaveProperty('type', ROADMAP_DELETE_ACTION_ITEM_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissDeleteActionItemError', () => {
    const expectedAction = {
      type: ROADMAP_DELETE_ACTION_ITEM_DISMISS_ERROR,
    };
    expect(dismissDeleteActionItemError()).toEqual(expectedAction);
  });

  it('handles action type ROADMAP_DELETE_ACTION_ITEM_BEGIN correctly', () => {
    const prevState = { deleteActionItemPending: false };
    const state = reducer(
      prevState,
      { type: ROADMAP_DELETE_ACTION_ITEM_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteActionItemPending).toBe(true);
  });

  it('handles action type ROADMAP_DELETE_ACTION_ITEM_SUCCESS correctly', () => {
    const prevState = { deleteActionItemPending: true, competencies: { 1: { action_item_ids: [] } } };
    const state = reducer(
      prevState,
      { type: ROADMAP_DELETE_ACTION_ITEM_SUCCESS, data: { competency: 1 } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteActionItemPending).toBe(false);
  });

  it('handles action type ROADMAP_DELETE_ACTION_ITEM_FAILURE correctly', () => {
    const prevState = { deleteActionItemPending: true };
    const state = reducer(
      prevState,
      { type: ROADMAP_DELETE_ACTION_ITEM_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteActionItemPending).toBe(false);
    expect(state.deleteActionItemError).toEqual(expect.anything());
  });

  it('handles action type ROADMAP_DELETE_ACTION_ITEM_DISMISS_ERROR correctly', () => {
    const prevState = { deleteActionItemError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: ROADMAP_DELETE_ACTION_ITEM_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteActionItemError).toBe(null);
  });
});

