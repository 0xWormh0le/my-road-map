import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  ROADMAP_ADD_COMPETENCY_ATTACHMENT_BEGIN,
  ROADMAP_ADD_COMPETENCY_ATTACHMENT_SUCCESS,
  ROADMAP_ADD_COMPETENCY_ATTACHMENT_FAILURE,
  ROADMAP_ADD_COMPETENCY_ATTACHMENT_DISMISS_ERROR,
} from '../../../../src/features/roadmap/redux/constants';

import {
  addCompetencyAttachment,
  dismissAddCompetencyAttachmentError,
  reducer,
} from '../../../../src/features/roadmap/redux/addCompetencyAttachment';
import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('roadmap/redux/addCompetencyAttachment', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when addCompetencyAttachment succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/roadmaps/1/stages/1/competencies/1/add-attachment/')
      .reply(201);

    return store.dispatch(addCompetencyAttachment({ roadmapId: 1, competency: { id: 1, stage: 1 } }))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ROADMAP_ADD_COMPETENCY_ATTACHMENT_BEGIN);
        expect(actions[1]).toHaveProperty('type', ROADMAP_ADD_COMPETENCY_ATTACHMENT_SUCCESS);
      });
  });

  it('dispatches failure action when addCompetencyAttachment fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl).post('/roadmaps/1/stages/1/competencies/1/add-attachment/').reply(500, {})

    return store.dispatch(addCompetencyAttachment({ error: true, roadmapId: 1, competency: { id: 1, stage: 1 } }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ROADMAP_ADD_COMPETENCY_ATTACHMENT_BEGIN);
        expect(actions[1]).toHaveProperty('type', ROADMAP_ADD_COMPETENCY_ATTACHMENT_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissAddCompetencyAttachmentError', () => {
    const expectedAction = {
      type: ROADMAP_ADD_COMPETENCY_ATTACHMENT_DISMISS_ERROR,
    };
    expect(dismissAddCompetencyAttachmentError()).toEqual(expectedAction);
  });

  it('handles action type ROADMAP_ADD_COMPETENCY_ATTACHMENT_BEGIN correctly', () => {
    const prevState = { addCompetencyAttachmentPending: false };
    const state = reducer(
      prevState,
      { type: ROADMAP_ADD_COMPETENCY_ATTACHMENT_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addCompetencyAttachmentPending).toBe(true);
  });

  it('handles action type ROADMAP_ADD_COMPETENCY_ATTACHMENT_SUCCESS correctly', () => {
    const prevState = { addCompetencyAttachmentPending: true, competencies: { 1: { attachments: [] } } };
    const state = reducer(
      prevState,
      { type: ROADMAP_ADD_COMPETENCY_ATTACHMENT_SUCCESS, data: { competencyId: 1 } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addCompetencyAttachmentPending).toBe(false);
  });

  it('handles action type ROADMAP_ADD_COMPETENCY_ATTACHMENT_FAILURE correctly', () => {
    const prevState = { addCompetencyAttachmentPending: true };
    const state = reducer(
      prevState,
      { type: ROADMAP_ADD_COMPETENCY_ATTACHMENT_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addCompetencyAttachmentPending).toBe(false);
    expect(state.addCompetencyAttachmentError).toEqual(expect.anything());
  });

  it('handles action type ROADMAP_ADD_COMPETENCY_ATTACHMENT_DISMISS_ERROR correctly', () => {
    const prevState = { addCompetencyAttachmentError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: ROADMAP_ADD_COMPETENCY_ATTACHMENT_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addCompetencyAttachmentError).toBe(null);
  });
});

