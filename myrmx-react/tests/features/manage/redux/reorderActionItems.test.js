import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MANAGE_REORDER_ACTION_ITEMS_BEGIN,
  MANAGE_REORDER_ACTION_ITEMS_SUCCESS,
  MANAGE_REORDER_ACTION_ITEMS_FAILURE,
  MANAGE_REORDER_ACTION_ITEMS_DISMISS_ERROR,
} from '../../../../src/features/manage/redux/constants';

import {
  reorderActionItems,
  dismissReorderActionItemsError,
  reducer,
} from '../../../../src/features/manage/redux/reorderActionItems';
import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('manage/redux/reorderActionItems', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when reorderActionItems succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/roadmaps/1/stages/1/competencies/1/reorder-action-items/')
      .reply(200);

    return store.dispatch(reorderActionItems({ roadmapId: 1, stageId: 1, competencyId: 1 }))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_REORDER_ACTION_ITEMS_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_REORDER_ACTION_ITEMS_SUCCESS);
      });
  });

  it('dispatches failure action when reorderActionItems fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/roadmaps/1/stages/1/competencies/1/reorder-action-items/')
      .reply(500, {});

    return store.dispatch(reorderActionItems({ roadmapId: 1, stageId: 1, competencyId: 1 }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_REORDER_ACTION_ITEMS_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_REORDER_ACTION_ITEMS_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissReorderActionItemsError', () => {
    const expectedAction = {
      type: MANAGE_REORDER_ACTION_ITEMS_DISMISS_ERROR,
    };
    expect(dismissReorderActionItemsError()).toEqual(expectedAction);
  });

  it('handles action type MANAGE_REORDER_ACTION_ITEMS_BEGIN correctly', () => {
    const prevState = { reorderActionItemsPending: false };
    const state = reducer(
      prevState,
      { type: MANAGE_REORDER_ACTION_ITEMS_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.reorderActionItemsPending).toBe(true);
  });

  it('handles action type MANAGE_REORDER_ACTION_ITEMS_SUCCESS correctly', () => {
    const prevState = { reorderActionItemsPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_REORDER_ACTION_ITEMS_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.reorderActionItemsPending).toBe(false);
  });

  it('handles action type MANAGE_REORDER_ACTION_ITEMS_FAILURE correctly', () => {
    const prevState = { reorderActionItemsPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_REORDER_ACTION_ITEMS_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.reorderActionItemsPending).toBe(false);
    expect(state.reorderActionItemsError).toEqual(expect.anything());
  });

  it('handles action type MANAGE_REORDER_ACTION_ITEMS_DISMISS_ERROR correctly', () => {
    const prevState = { reorderActionItemsError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MANAGE_REORDER_ACTION_ITEMS_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.reorderActionItemsError).toBe(null);
  });
});

