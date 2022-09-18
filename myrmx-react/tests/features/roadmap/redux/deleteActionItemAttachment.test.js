import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  ROADMAP_DELETE_ACTION_ITEM_ATTACHMENT_BEGIN,
  ROADMAP_DELETE_ACTION_ITEM_ATTACHMENT_SUCCESS,
  ROADMAP_DELETE_ACTION_ITEM_ATTACHMENT_FAILURE,
  ROADMAP_DELETE_ACTION_ITEM_ATTACHMENT_DISMISS_ERROR,
} from '../../../../src/features/roadmap/redux/constants';

import {
  deleteActionItemAttachment,
  dismissDeleteActionItemAttachmentError,
  reducer,
} from '../../../../src/features/roadmap/redux/deleteActionItemAttachment';
import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('roadmap/redux/deleteActionItemAttachment', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when deleteActionItemAttachment succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .delete('/roadmaps/1/stages/1/competencies/1/action-item-assessments/1/remove-attachment/1/')
      .reply(204);

    return store.dispatch(deleteActionItemAttachment({ roadmapId: 1, stageId: 1, competencyId: 1, actionItemId: 1, attachmentId: 1 }))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ROADMAP_DELETE_ACTION_ITEM_ATTACHMENT_BEGIN);
        expect(actions[1]).toHaveProperty('type', ROADMAP_DELETE_ACTION_ITEM_ATTACHMENT_SUCCESS);
      });
  });

  it('dispatches failure action when deleteActionItemAttachment fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .delete('/roadmaps/1/stages/1/competencies/1/action-item-assessments/1/remove-attachment/1/')
      .reply(500, {});

    return store.dispatch(deleteActionItemAttachment({ roadmapId: 1, stageId: 1, competencyId: 1, actionItemId: 1, attachmentId: 1 }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ROADMAP_DELETE_ACTION_ITEM_ATTACHMENT_BEGIN);
        expect(actions[1]).toHaveProperty('type', ROADMAP_DELETE_ACTION_ITEM_ATTACHMENT_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissDeleteActionItemAttachmentError', () => {
    const expectedAction = {
      type: ROADMAP_DELETE_ACTION_ITEM_ATTACHMENT_DISMISS_ERROR,
    };
    expect(dismissDeleteActionItemAttachmentError()).toEqual(expectedAction);
  });

  it('handles action type ROADMAP_DELETE_ACTION_ITEM_ATTACHMENT_BEGIN correctly', () => {
    const prevState = { deleteActionItemAttachmentPending: false };
    const state = reducer(
      prevState,
      { type: ROADMAP_DELETE_ACTION_ITEM_ATTACHMENT_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteActionItemAttachmentPending).toBe(true);
  });

  it('handles action type ROADMAP_DELETE_ACTION_ITEM_ATTACHMENT_SUCCESS correctly', () => {
    const prevState = { deleteActionItemAttachmentPending: true, actionItems: { 1: { attachments: [] } } };
    const state = reducer(
      prevState,
      { type: ROADMAP_DELETE_ACTION_ITEM_ATTACHMENT_SUCCESS, data: { actionItemId: 1 } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteActionItemAttachmentPending).toBe(false);
  });

  it('handles action type ROADMAP_DELETE_ACTION_ITEM_ATTACHMENT_FAILURE correctly', () => {
    const prevState = { deleteActionItemAttachmentPending: true };
    const state = reducer(
      prevState,
      { type: ROADMAP_DELETE_ACTION_ITEM_ATTACHMENT_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteActionItemAttachmentPending).toBe(false);
    expect(state.deleteActionItemAttachmentError).toEqual(expect.anything());
  });

  it('handles action type ROADMAP_DELETE_ACTION_ITEM_ATTACHMENT_DISMISS_ERROR correctly', () => {
    const prevState = { deleteActionItemAttachmentError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: ROADMAP_DELETE_ACTION_ITEM_ATTACHMENT_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteActionItemAttachmentError).toBe(null);
  });
});

