import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  ROADMAP_ADD_NOTE_BEGIN,
  ROADMAP_ADD_NOTE_SUCCESS,
  ROADMAP_ADD_NOTE_FAILURE,
  ROADMAP_ADD_NOTE_DISMISS_ERROR,
} from '../../../../src/features/roadmap/redux/constants';

import {
  addNote,
  dismissAddNoteError,
  reducer,
} from '../../../../src/features/roadmap/redux/addNote';

import config from '../../../../src/common/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('roadmap/redux/addNote', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when addNote succeeds', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/roadmaps/1/stages/1/competencies/1/notes/')
      .reply(200, {});
      
    return store.dispatch(addNote({ roadmapId: 1, stageId: 1, competencyId: 1 }))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ROADMAP_ADD_NOTE_BEGIN);
        expect(actions[1]).toHaveProperty('type', ROADMAP_ADD_NOTE_SUCCESS);
      });
  });

  it('dispatches failure action when addNote fails', () => {
    const store = mockStore({});

    nock(config.apiRootUrl)
      .post('/roadmaps/1/stages/1/competencies/1/notes/')
      .reply(500, {});

    return store.dispatch(addNote({ roadmapId: 1, stageId: 1, competencyId: 1 }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ROADMAP_ADD_NOTE_BEGIN);
        expect(actions[1]).toHaveProperty('type', ROADMAP_ADD_NOTE_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissAddNoteError', () => {
    const expectedAction = {
      type: ROADMAP_ADD_NOTE_DISMISS_ERROR,
    };
    expect(dismissAddNoteError()).toEqual(expectedAction);
  });

  it('handles action type ROADMAP_ADD_NOTE_BEGIN correctly', () => {
    const prevState = { addNotePending: false };
    const state = reducer(
      prevState,
      { type: ROADMAP_ADD_NOTE_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addNotePending).toBe(true);
  });

  it('handles action type ROADMAP_ADD_NOTE_SUCCESS correctly', () => {
    const prevState = { addNotePending: true };
    const state = reducer(
      prevState,
      { type: ROADMAP_ADD_NOTE_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addNotePending).toBe(false);
  });

  it('handles action type ROADMAP_ADD_NOTE_FAILURE correctly', () => {
    const prevState = { addNotePending: true };
    const state = reducer(
      prevState,
      { type: ROADMAP_ADD_NOTE_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addNotePending).toBe(false);
    expect(state.addNoteError).toEqual(expect.anything());
  });

  it('handles action type ROADMAP_ADD_NOTE_DISMISS_ERROR correctly', () => {
    const prevState = { addNoteError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: ROADMAP_ADD_NOTE_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addNoteError).toBe(null);
  });
});

