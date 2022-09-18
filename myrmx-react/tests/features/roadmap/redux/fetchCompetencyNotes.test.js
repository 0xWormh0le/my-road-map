import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  ROADMAP_FETCH_COMPETENCY_NOTES_BEGIN,
  ROADMAP_FETCH_COMPETENCY_NOTES_SUCCESS,
  ROADMAP_FETCH_COMPETENCY_NOTES_FAILURE,
  ROADMAP_FETCH_COMPETENCY_NOTES_DISMISS_ERROR,
} from '../../../../src/features/roadmap/redux/constants';

import {
  fetchCompetencyNotes,
  dismissFetchCompetencyNotesError,
  reducer,
} from '../../../../src/features/roadmap/redux/fetchCompetencyNotes';

import config from '../../../../src/common/config';
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('roadmap/redux/fetchCompetencyNotes', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when fetchCompetencyNotes succeeds', () => {
    const store = mockStore({});
    
    nock(config.apiRootUrl)
      .get('/roadmaps/1/stages/1/competencies/1/notes/?ordering=-pk&student=22')
      .reply(200, {});

    return store.dispatch(fetchCompetencyNotes({ roadmapId: 1, stageId: 1, competencyId: 1, userId: 22 }))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ROADMAP_FETCH_COMPETENCY_NOTES_BEGIN);
        expect(actions[1]).toHaveProperty('type', ROADMAP_FETCH_COMPETENCY_NOTES_SUCCESS);
      });
  });

  it('dispatches failure action when fetchCompetencyNotes fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .get('/roadmaps/1/stages/1/competencies/1/notes/?ordering=-pk&student=22')
      .reply(500, {});

    return store.dispatch(fetchCompetencyNotes({ roadmapId: 1, stageId: 1, competencyId: 1, userId: 22 }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ROADMAP_FETCH_COMPETENCY_NOTES_BEGIN);
        expect(actions[1]).toHaveProperty('type', ROADMAP_FETCH_COMPETENCY_NOTES_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissFetchCompetencyNotesError', () => {
    const expectedAction = {
      type: ROADMAP_FETCH_COMPETENCY_NOTES_DISMISS_ERROR,
    };
    expect(dismissFetchCompetencyNotesError()).toEqual(expectedAction);
  });

  it('handles action type ROADMAP_FETCH_COMPETENCY_NOTES_BEGIN correctly', () => {
    const prevState = { fetchCompetencyNotesPending: false };
    const state = reducer(
      prevState,
      { type: ROADMAP_FETCH_COMPETENCY_NOTES_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchCompetencyNotesPending).toBe(true);
  });

  it('handles action type ROADMAP_FETCH_COMPETENCY_NOTES_SUCCESS correctly', () => {
    const prevState = { fetchCompetencyNotesPending: true };
    const state = reducer(
      prevState,
      { type: ROADMAP_FETCH_COMPETENCY_NOTES_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchCompetencyNotesPending).toBe(false);
  });

  it('handles action type ROADMAP_FETCH_COMPETENCY_NOTES_FAILURE correctly', () => {
    const prevState = { fetchCompetencyNotesPending: true };
    const state = reducer(
      prevState,
      { type: ROADMAP_FETCH_COMPETENCY_NOTES_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchCompetencyNotesPending).toBe(false);
    expect(state.fetchCompetencyNotesError).toEqual(expect.anything());
  });

  it('handles action type ROADMAP_FETCH_COMPETENCY_NOTES_DISMISS_ERROR correctly', () => {
    const prevState = { fetchCompetencyNotesError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: ROADMAP_FETCH_COMPETENCY_NOTES_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchCompetencyNotesError).toBe(null);
  });
});

