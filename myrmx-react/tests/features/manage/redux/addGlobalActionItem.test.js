import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  MANAGE_ADD_GLOBAL_ACTION_ITEM_BEGIN,
  MANAGE_ADD_GLOBAL_ACTION_ITEM_SUCCESS,
  MANAGE_ADD_GLOBAL_ACTION_ITEM_FAILURE,
  MANAGE_ADD_GLOBAL_ACTION_ITEM_DISMISS_ERROR,
} from '../../../../src/features/manage/redux/constants';

import {
  addGlobalActionItem,
  dismissAddGlobalActionItemError,
  reducer,
} from '../../../../src/features/manage/redux/addGlobalActionItem';

import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('manage/redux/addGlobalActionItem', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when addGlobalActionItem succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/roadmaps/1/stages/1/competencies/1/global-action-items/')
      .reply(201);

    return store.dispatch(addGlobalActionItem({roadmapId: 1, stageId: 1, competencyId: 1}))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_ADD_GLOBAL_ACTION_ITEM_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_ADD_GLOBAL_ACTION_ITEM_SUCCESS);
      });
  });

  it('dispatches failure action when addGlobalActionItem fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/roadmaps/1/stages/1/competencies/1/global-action-items/')
      .reply(500, {});

    return store.dispatch(addGlobalActionItem({roadmapId: 1, stageId: 1, competencyId: 1}))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', MANAGE_ADD_GLOBAL_ACTION_ITEM_BEGIN);
        expect(actions[1]).toHaveProperty('type', MANAGE_ADD_GLOBAL_ACTION_ITEM_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissAddGlobalActionItemError', () => {
    const expectedAction = {
      type: MANAGE_ADD_GLOBAL_ACTION_ITEM_DISMISS_ERROR,
    };
    expect(dismissAddGlobalActionItemError()).toEqual(expectedAction);
  });

  it('handles action type MANAGE_ADD_GLOBAL_ACTION_ITEM_BEGIN correctly', () => {
    const prevState = { addGlobalActionItemPending: false };
    const state = reducer(
      prevState,
      { type: MANAGE_ADD_GLOBAL_ACTION_ITEM_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addGlobalActionItemPending).toBe(true);
  });

  it('handles action type MANAGE_ADD_GLOBAL_ACTION_ITEM_SUCCESS correctly', () => {
    const prevState = { addGlobalActionItemPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_ADD_GLOBAL_ACTION_ITEM_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addGlobalActionItemPending).toBe(false);
  });

  it('handles action type MANAGE_ADD_GLOBAL_ACTION_ITEM_FAILURE correctly', () => {
    const prevState = { addGlobalActionItemPending: true };
    const state = reducer(
      prevState,
      { type: MANAGE_ADD_GLOBAL_ACTION_ITEM_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addGlobalActionItemPending).toBe(false);
    expect(state.addGlobalActionItemError).toEqual(expect.anything());
  });

  it('handles action type MANAGE_ADD_GLOBAL_ACTION_ITEM_DISMISS_ERROR correctly', () => {
    const prevState = { addGlobalActionItemError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MANAGE_ADD_GLOBAL_ACTION_ITEM_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addGlobalActionItemError).toBe(null);
  });
});

