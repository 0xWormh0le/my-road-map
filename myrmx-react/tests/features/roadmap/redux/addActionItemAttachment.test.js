import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  ROADMAP_ADD_ACTION_ITEM_ATTACHMENT_BEGIN,
  ROADMAP_ADD_ACTION_ITEM_ATTACHMENT_SUCCESS,
  ROADMAP_ADD_ACTION_ITEM_ATTACHMENT_FAILURE,
  ROADMAP_ADD_ACTION_ITEM_ATTACHMENT_DISMISS_ERROR,
} from '../../../../src/features/roadmap/redux/constants';

import {
  addActionItemAttachment,
  dismissAddActionItemAttachmentError,
  reducer,
} from '../../../../src/features/roadmap/redux/addActionItemAttachment';
import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('roadmap/redux/addActionItemAttachment', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when addActionItemAttachment succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/roadmaps/1/stages/1/competencies/1/action-item-assessments/1/add-attachment/')
      .reply(201);

    return store.dispatch(addActionItemAttachment({ roadmapId: 1, stageId: 1, competencyId: 1, actionItemId: 1 }))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ROADMAP_ADD_ACTION_ITEM_ATTACHMENT_BEGIN);
        expect(actions[1]).toHaveProperty('type', ROADMAP_ADD_ACTION_ITEM_ATTACHMENT_SUCCESS);
      });
  });

  it('dispatches failure action when addActionItemAttachment fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/roadmaps/1/stages/1/competencies/1/action-item-assessments/1/add-attachment/')
      .reply(500, {});

    return store.dispatch(addActionItemAttachment({ roadmapId: 1, stageId: 1, competencyId: 1, actionItemId: 1 }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ROADMAP_ADD_ACTION_ITEM_ATTACHMENT_BEGIN);
        expect(actions[1]).toHaveProperty('type', ROADMAP_ADD_ACTION_ITEM_ATTACHMENT_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissAddActionItemAttachmentError', () => {
    const expectedAction = {
      type: ROADMAP_ADD_ACTION_ITEM_ATTACHMENT_DISMISS_ERROR,
    };
    expect(dismissAddActionItemAttachmentError()).toEqual(expectedAction);
  });

  it('handles action type ROADMAP_ADD_ACTION_ITEM_ATTACHMENT_BEGIN correctly', () => {
    const prevState = { addActionItemAttachmentPending: false };
    const state = reducer(
      prevState,
      { type: ROADMAP_ADD_ACTION_ITEM_ATTACHMENT_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addActionItemAttachmentPending).toBe(true);
  });

  it('handles action type ROADMAP_ADD_ACTION_ITEM_ATTACHMENT_SUCCESS correctly', () => {
    const prevState = { addActionItemAttachmentPending: true, actionItems: { 1: { attachments: [] } } };
    const state = reducer(
      prevState,
      { type: ROADMAP_ADD_ACTION_ITEM_ATTACHMENT_SUCCESS, data: { actionItemId: 1 } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addActionItemAttachmentPending).toBe(false);
  });

  it('handles action type ROADMAP_ADD_ACTION_ITEM_ATTACHMENT_FAILURE correctly', () => {
    const prevState = { addActionItemAttachmentPending: true };
    const state = reducer(
      prevState,
      { type: ROADMAP_ADD_ACTION_ITEM_ATTACHMENT_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addActionItemAttachmentPending).toBe(false);
    expect(state.addActionItemAttachmentError).toEqual(expect.anything());
  });

  it('handles action type ROADMAP_ADD_ACTION_ITEM_ATTACHMENT_DISMISS_ERROR correctly', () => {
    const prevState = { addActionItemAttachmentError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: ROADMAP_ADD_ACTION_ITEM_ATTACHMENT_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addActionItemAttachmentError).toBe(null);
  });
});

