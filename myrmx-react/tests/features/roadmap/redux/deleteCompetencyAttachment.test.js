import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  ROADMAP_DELETE_COMPETENCY_ATTACHMENT_BEGIN,
  ROADMAP_DELETE_COMPETENCY_ATTACHMENT_SUCCESS,
  ROADMAP_DELETE_COMPETENCY_ATTACHMENT_FAILURE,
  ROADMAP_DELETE_COMPETENCY_ATTACHMENT_DISMISS_ERROR,
} from '../../../../src/features/roadmap/redux/constants';

import {
  deleteCompetencyAttachment,
  dismissDeleteCompetencyAttachmentError,
  reducer,
} from '../../../../src/features/roadmap/redux/deleteCompetencyAttachment';
import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('roadmap/redux/deleteCompetencyAttachment', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when deleteCompetencyAttachment succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .delete('/roadmaps/1/stages/1/competencies/1/remove-attachment/1/')
      .reply(204);

    return store.dispatch(deleteCompetencyAttachment({
      roadmapId: 1,
      competency: { stage: 1, id: 1 },
      attachmentId: 1
    })).then(() => {
      const actions = store.getActions();
      expect(actions[0]).toHaveProperty('type', ROADMAP_DELETE_COMPETENCY_ATTACHMENT_BEGIN);
      expect(actions[1]).toHaveProperty('type', ROADMAP_DELETE_COMPETENCY_ATTACHMENT_SUCCESS);
    });
  });

  it('dispatches failure action when deleteCompetencyAttachment fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .delete('/roadmaps/1/stages/1/competencies/1/remove-attachment/1/')
      .reply(500, {});

    return store.dispatch(deleteCompetencyAttachment({
      roadmapId: 1,
      competency: { stage: 1, id: 1 },
      attachmentId: 1,
      error: true
    })).catch(() => {
      const actions = store.getActions();
      expect(actions[0]).toHaveProperty('type', ROADMAP_DELETE_COMPETENCY_ATTACHMENT_BEGIN);
      expect(actions[1]).toHaveProperty('type', ROADMAP_DELETE_COMPETENCY_ATTACHMENT_FAILURE);
      expect(actions[1]).toHaveProperty('data.error', expect.anything());
    });
  });

  it('returns correct action by dismissDeleteCompetencyAttachmentError', () => {
    const expectedAction = {
      type: ROADMAP_DELETE_COMPETENCY_ATTACHMENT_DISMISS_ERROR,
    };
    expect(dismissDeleteCompetencyAttachmentError()).toEqual(expectedAction);
  });

  it('handles action type ROADMAP_DELETE_COMPETENCY_ATTACHMENT_BEGIN correctly', () => {
    const prevState = { deleteCompetencyAttachmentPending: false };
    const state = reducer(
      prevState,
      { type: ROADMAP_DELETE_COMPETENCY_ATTACHMENT_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteCompetencyAttachmentPending).toBe(true);
  });

  it('handles action type ROADMAP_DELETE_COMPETENCY_ATTACHMENT_SUCCESS correctly', () => {
    const prevState = { deleteActionItemAttachmentPending: true, competencies: { 1: { attachments: [] } } };
    const state = reducer(
      prevState,
      { type: ROADMAP_DELETE_COMPETENCY_ATTACHMENT_SUCCESS, data: { competencyId: 1 } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteCompetencyAttachmentPending).toBe(false);
  });

  it('handles action type ROADMAP_DELETE_COMPETENCY_ATTACHMENT_FAILURE correctly', () => {
    const prevState = { deleteCompetencyAttachmentPending: true };
    const state = reducer(
      prevState,
      { type: ROADMAP_DELETE_COMPETENCY_ATTACHMENT_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteCompetencyAttachmentPending).toBe(false);
    expect(state.deleteCompetencyAttachmentError).toEqual(expect.anything());
  });

  it('handles action type ROADMAP_DELETE_COMPETENCY_ATTACHMENT_DISMISS_ERROR correctly', () => {
    const prevState = { deleteCompetencyAttachmentError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: ROADMAP_DELETE_COMPETENCY_ATTACHMENT_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteCompetencyAttachmentError).toBe(null);
  });
});

