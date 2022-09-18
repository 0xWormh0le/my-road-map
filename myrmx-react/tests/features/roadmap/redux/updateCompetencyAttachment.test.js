import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  ROADMAP_UPDATE_COMPETENCY_ATTACHMENT_BEGIN,
  ROADMAP_UPDATE_COMPETENCY_ATTACHMENT_SUCCESS,
  ROADMAP_UPDATE_COMPETENCY_ATTACHMENT_FAILURE,
  ROADMAP_UPDATE_COMPETENCY_ATTACHMENT_DISMISS_ERROR,
} from '../../../../src/features/roadmap/redux/constants';

import {
  updateCompetencyAttachment,
  dismissUpdateCompetencyAttachmentError,
  reducer,
} from '../../../../src/features/roadmap/redux/updateCompetencyAttachment';
import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('roadmap/redux/updateCompetencyAttachment', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when updateCompetencyAttachment succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .patch('/roadmaps/1/stages/1/competencies/1/update-attachment/1/')
      .reply(200);
      
    return store.dispatch(updateCompetencyAttachment({roadmapId: 1, stageId: 1, competencyId: 1, attachmentId: 1}))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ROADMAP_UPDATE_COMPETENCY_ATTACHMENT_BEGIN);
        expect(actions[1]).toHaveProperty('type', ROADMAP_UPDATE_COMPETENCY_ATTACHMENT_SUCCESS);
      });
  });

  it('dispatches failure action when updateCompetencyAttachment fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .patch('/roadmaps/1/stages/1/competencies/1/update-attachment/1/')
      .reply(500, {});
    
    return store.dispatch(updateCompetencyAttachment({roadmapId: 1, stageId: 1, competencyId: 1, attachmentId: 1}))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ROADMAP_UPDATE_COMPETENCY_ATTACHMENT_BEGIN);
        expect(actions[1]).toHaveProperty('type', ROADMAP_UPDATE_COMPETENCY_ATTACHMENT_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissUpdateCompetencyAttachmentError', () => {
    const expectedAction = {
      type: ROADMAP_UPDATE_COMPETENCY_ATTACHMENT_DISMISS_ERROR,
    };
    expect(dismissUpdateCompetencyAttachmentError()).toEqual(expectedAction);
  });

  it('handles action type ROADMAP_UPDATE_COMPETENCY_ATTACHMENT_BEGIN correctly', () => {
    const prevState = { updateCompetencyAttachmentPending: false };
    const state = reducer(
      prevState,
      { type: ROADMAP_UPDATE_COMPETENCY_ATTACHMENT_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateCompetencyAttachmentPending).toBe(true);
  });

  it('handles action type ROADMAP_UPDATE_COMPETENCY_ATTACHMENT_SUCCESS correctly', () => {
    const prevState = { updateCompetencyAttachmentPending: true, competencies: {1: {attachments: []}} };
    const state = reducer(
      prevState,
      { type: ROADMAP_UPDATE_COMPETENCY_ATTACHMENT_SUCCESS, data: {competency: {}, competencyId: 1} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateCompetencyAttachmentPending).toBe(false);
  });

  it('handles action type ROADMAP_UPDATE_COMPETENCY_ATTACHMENT_FAILURE correctly', () => {
    const prevState = { updateCompetencyAttachmentPending: true };
    const state = reducer(
      prevState,
      { type: ROADMAP_UPDATE_COMPETENCY_ATTACHMENT_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateCompetencyAttachmentPending).toBe(false);
    expect(state.updateCompetencyAttachmentError).toEqual(expect.anything());
  });

  it('handles action type ROADMAP_UPDATE_COMPETENCY_ATTACHMENT_DISMISS_ERROR correctly', () => {
    const prevState = { updateCompetencyAttachmentError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: ROADMAP_UPDATE_COMPETENCY_ATTACHMENT_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateCompetencyAttachmentError).toBe(null);
  });
});

