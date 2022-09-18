import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  ROADMAP_SET_ACTION_ITEM_DETAILS_BEGIN,
  ROADMAP_SET_ACTION_ITEM_DETAILS_SUCCESS,
  ROADMAP_SET_ACTION_ITEM_DETAILS_FAILURE,
  ROADMAP_SET_ACTION_ITEM_DETAILS_DISMISS_ERROR,
} from '../../../../src/features/roadmap/redux/constants';

import {
  setActionItemDetails,
  dismissSetActionItemDetailsError,
  reducer,
} from '../../../../src/features/roadmap/redux/setActionItemDetails';

import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('roadmap/redux/setActionItemDetails', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when setActionItemDetails succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .patch('/roadmaps/1/stages/1/competencies/1/action-item-assessments/1/')
      .reply(200);

    return store.dispatch(setActionItemDetails({ roadmapId: 1, stageId: 1, competencyId: 1, actionItemId: 1 }))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ROADMAP_SET_ACTION_ITEM_DETAILS_BEGIN);
        expect(actions[1]).toHaveProperty('type', ROADMAP_SET_ACTION_ITEM_DETAILS_SUCCESS);
      });
  });

  it('dispatches failure action when setActionItemDetails fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .patch('/roadmaps/1/stages/1/competencies/1/action-item-assessments/1/')
      .reply(500, {});

    return store.dispatch(setActionItemDetails({ roadmapId: 1, stageId: 1, competencyId: 1, actionItemId: 1 }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ROADMAP_SET_ACTION_ITEM_DETAILS_BEGIN);
        expect(actions[1]).toHaveProperty('type', ROADMAP_SET_ACTION_ITEM_DETAILS_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissSetActionItemDetailsError', () => {
    const expectedAction = {
      type: ROADMAP_SET_ACTION_ITEM_DETAILS_DISMISS_ERROR,
    };
    expect(dismissSetActionItemDetailsError()).toEqual(expectedAction);
  });

  it('handles action type ROADMAP_SET_ACTION_ITEM_DETAILS_BEGIN correctly', () => {
    const prevState = { setActionItemDetailsPending: false };
    const state = reducer(
      prevState,
      { type: ROADMAP_SET_ACTION_ITEM_DETAILS_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.setActionItemDetailsPending).toBe(true);
  });

  it('handles action type ROADMAP_SET_ACTION_ITEM_DETAILS_SUCCESS correctly', () => {
    const prevState = { setActionItemDetailsPending: true };
    const state = reducer(
      prevState,
      { type: ROADMAP_SET_ACTION_ITEM_DETAILS_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.setActionItemDetailsPending).toBe(false);
  });

  it('handles action type ROADMAP_SET_ACTION_ITEM_DETAILS_FAILURE correctly', () => {
    const prevState = { setActionItemDetailsPending: true };
    const state = reducer(
      prevState,
      { type: ROADMAP_SET_ACTION_ITEM_DETAILS_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.setActionItemDetailsPending).toBe(false);
    expect(state.setActionItemDetailsError).toEqual(expect.anything());
  });

  it('handles action type ROADMAP_SET_ACTION_ITEM_DETAILS_DISMISS_ERROR correctly', () => {
    const prevState = { setActionItemDetailsError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: ROADMAP_SET_ACTION_ITEM_DETAILS_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.setActionItemDetailsError).toBe(null);
  });
});

