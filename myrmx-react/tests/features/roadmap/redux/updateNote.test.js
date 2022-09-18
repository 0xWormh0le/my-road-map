import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  ROADMAP_UPDATE_NOTE_BEGIN,
  ROADMAP_UPDATE_NOTE_SUCCESS,
  ROADMAP_UPDATE_NOTE_FAILURE,
  ROADMAP_UPDATE_NOTE_DISMISS_ERROR,
} from '../../../../src/features/roadmap/redux/constants';

import {
  updateNote,
  dismissUpdateNoteError,
  reducer,
} from '../../../../src/features/roadmap/redux/updateNote';
import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('roadmap/redux/updateNote', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when updateNote succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .patch('/roadmaps/1/stages/1/competencies/1/notes/1/')
      .reply(200);

    return store.dispatch(updateNote({ roadmapId: 1, stageId: 1, competencyId: 1, noteId: 1 }))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ROADMAP_UPDATE_NOTE_BEGIN);
        expect(actions[1]).toHaveProperty('type', ROADMAP_UPDATE_NOTE_SUCCESS);
      });
  });

  it('dispatches failure action when updateNote fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .patch('/roadmaps/1/stages/1/competencies/1/notes/1/')
      .reply(500, {});

    return store.dispatch(updateNote({ roadmapId: 1, stageId: 1, competencyId: 1, noteId: 1 }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ROADMAP_UPDATE_NOTE_BEGIN);
        expect(actions[1]).toHaveProperty('type', ROADMAP_UPDATE_NOTE_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissUpdateNoteError', () => {
    const expectedAction = {
      type: ROADMAP_UPDATE_NOTE_DISMISS_ERROR,
    };
    expect(dismissUpdateNoteError()).toEqual(expectedAction);
  });

  it('handles action type ROADMAP_UPDATE_NOTE_BEGIN correctly', () => {
    const prevState = { updateNotePending: false };
    const state = reducer(
      prevState,
      { type: ROADMAP_UPDATE_NOTE_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateNotePending).toBe(true);
  });

  it('handles action type ROADMAP_UPDATE_NOTE_SUCCESS correctly', () => {
    const prevState = { updateNotePending: true };
    const state = reducer(
      prevState,
      { type: ROADMAP_UPDATE_NOTE_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateNotePending).toBe(false);
  });

  it('handles action type ROADMAP_UPDATE_NOTE_FAILURE correctly', () => {
    const prevState = { updateNotePending: true };
    const state = reducer(
      prevState,
      { type: ROADMAP_UPDATE_NOTE_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateNotePending).toBe(false);
    expect(state.updateNoteError).toEqual(expect.anything());
  });

  it('handles action type ROADMAP_UPDATE_NOTE_DISMISS_ERROR correctly', () => {
    const prevState = { updateNoteError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: ROADMAP_UPDATE_NOTE_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateNoteError).toBe(null);
  });
});

