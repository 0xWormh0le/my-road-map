import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  ROADMAP_DELETE_NOTE_BEGIN,
  ROADMAP_DELETE_NOTE_SUCCESS,
  ROADMAP_DELETE_NOTE_FAILURE,
  ROADMAP_DELETE_NOTE_DISMISS_ERROR,
} from '../../../../src/features/roadmap/redux/constants';

import {
  deleteNote,
  dismissDeleteNoteError,
  reducer,
} from '../../../../src/features/roadmap/redux/deleteNote';
import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('roadmap/redux/deleteNote', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when deleteNote succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .delete('/roadmaps/1/stages/1/competencies/1/notes/1/')
      .reply(204);

    return store.dispatch(deleteNote({ roadmapId: 1, stageId: 1, competencyId: 1, noteId: 1 }))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ROADMAP_DELETE_NOTE_BEGIN);
        expect(actions[1]).toHaveProperty('type', ROADMAP_DELETE_NOTE_SUCCESS);
      });
  });

  it('dispatches failure action when deleteNote fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .delete('/roadmaps/1/stages/1/competencies/1/notes/1/')
      .reply(500, {});

    return store.dispatch(deleteNote({ roadmapId: 1, stageId: 1, competencyId: 1, noteId: 1 }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ROADMAP_DELETE_NOTE_BEGIN);
        expect(actions[1]).toHaveProperty('type', ROADMAP_DELETE_NOTE_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissDeleteNoteError', () => {
    const expectedAction = {
      type: ROADMAP_DELETE_NOTE_DISMISS_ERROR,
    };
    expect(dismissDeleteNoteError()).toEqual(expectedAction);
  });

  it('handles action type ROADMAP_DELETE_NOTE_BEGIN correctly', () => {
    const prevState = { deleteNotePending: false };
    const state = reducer(
      prevState,
      { type: ROADMAP_DELETE_NOTE_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteNotePending).toBe(true);
  });

  it('handles action type ROADMAP_DELETE_NOTE_SUCCESS correctly', () => {
    const prevState = { deleteNotePending: true };
    const state = reducer(
      prevState,
      { type: ROADMAP_DELETE_NOTE_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteNotePending).toBe(false);
  });

  it('handles action type ROADMAP_DELETE_NOTE_FAILURE correctly', () => {
    const prevState = { deleteNotePending: true };
    const state = reducer(
      prevState,
      { type: ROADMAP_DELETE_NOTE_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteNotePending).toBe(false);
    expect(state.deleteNoteError).toEqual(expect.anything());
  });

  it('handles action type ROADMAP_DELETE_NOTE_DISMISS_ERROR correctly', () => {
    const prevState = { deleteNoteError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: ROADMAP_DELETE_NOTE_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteNoteError).toBe(null);
  });
});

