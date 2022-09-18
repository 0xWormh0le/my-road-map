import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MANAGE_DELETE_GLOBAL_ACTION_ITEM_BEGIN,
  MANAGE_DELETE_GLOBAL_ACTION_ITEM_SUCCESS,
  MANAGE_DELETE_GLOBAL_ACTION_ITEM_FAILURE,
  MANAGE_DELETE_GLOBAL_ACTION_ITEM_DISMISS_ERROR,
} from '../../../../src/features/manage/redux/constants';

import {
  deleteGlobalActionItem,
  dismissDeleteGlobalActionItemError,
  reducer,
} from '../../../../src/features/manage/redux/deleteGlobalActionItem';

import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('manage/redux/deleteGlobalActionItem', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when deleteGlobalActionItem succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .delete('/roadmaps/1/stages/1/competencies/1/global-action-items/1/')
      .reply(200);

    return store.dispatch(deleteGlobalActionItem({roadmapId: 1, stageId: 1, competencyId: 1, actionItemId: 1}))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_DELETE_GLOBAL_ACTION_ITEM_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_DELETE_GLOBAL_ACTION_ITEM_SUCCESS);
      });
  });

  it('dispatches failure action when deleteGlobalActionItem fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .delete('/roadmaps/1/stages/1/competencies/1/global-action-items/1/')
      .reply(500, {});
      
    return store.dispatch(deleteGlobalActionItem({roadmapId: 1, stageId: 1, competencyId: 1, actionItemId: 1}))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_DELETE_GLOBAL_ACTION_ITEM_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_DELETE_GLOBAL_ACTION_ITEM_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissDeleteGlobalActionItemError', () => {
    const expectedAction = {
      type: MANAGE_DELETE_GLOBAL_ACTION_ITEM_DISMISS_ERROR,
    };
    expect(dismissDeleteGlobalActionItemError()).toEqual(expectedAction);
  });

  it('handles action type MANAGE_DELETE_GLOBAL_ACTION_ITEM_BEGIN correctly', () => {
    const prevState = { deleteGlobalActionItemPending: false };
    const state = reducer(
      prevState,
      { type: MANAGE_DELETE_GLOBAL_ACTION_ITEM_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteGlobalActionItemPending).toBe(true);
  });

  it('handles action type MANAGE_DELETE_GLOBAL_ACTION_ITEM_SUCCESS correctly', () => {
    const prevState = { deleteGlobalActionItemPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_DELETE_GLOBAL_ACTION_ITEM_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteGlobalActionItemPending).toBe(false);
  });

  it('handles action type MANAGE_DELETE_GLOBAL_ACTION_ITEM_FAILURE correctly', () => {
    const prevState = { deleteGlobalActionItemPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_DELETE_GLOBAL_ACTION_ITEM_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteGlobalActionItemPending).toBe(false);
    expect(state.deleteGlobalActionItemError).toEqual(expect.anything());
  });

  it('handles action type MANAGE_DELETE_GLOBAL_ACTION_ITEM_DISMISS_ERROR correctly', () => {
    const prevState = { deleteGlobalActionItemError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MANAGE_DELETE_GLOBAL_ACTION_ITEM_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteGlobalActionItemError).toBe(null);
  });
});

