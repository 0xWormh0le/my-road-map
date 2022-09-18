import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  ROADMAP_ADD_NOTE_BEGIN,
  ROADMAP_ADD_NOTE_SUCCESS,
  ROADMAP_ADD_NOTE_FAILURE,
  ROADMAP_ADD_NOTE_DISMISS_ERROR,
} from './constants';

import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function addNote(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: ROADMAP_ADD_NOTE_BEGIN,
    });

    const { roadmapId, stageId, competencyId, note, student } = args;

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.post(
        `${config.apiRootUrl}/roadmaps/${roadmapId}/stages/${stageId}/competencies/${competencyId}/notes/`,
        { text: note, student },
        createAxiosConfigWithAuth(getState()),
      );

      doRequest.then(
        (res) => {
          dispatch({
            type: ROADMAP_ADD_NOTE_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: ROADMAP_ADD_NOTE_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissAddNoteError() {
  return {
    type: ROADMAP_ADD_NOTE_DISMISS_ERROR,
  };
}

export function useAddNote() {
  const dispatch = useDispatch();

  const { addNotePending, addNoteError } = useSelector(
    state => ({
      addNotePending: state.roadmap.addNotePending,
      addNoteError: state.roadmap.addNoteError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(addNote(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissAddNoteError());
  }, [dispatch]);

  return {
    addNote: boundAction,
    addNotePending,
    addNoteError,
    dismissAddNoteError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case ROADMAP_ADD_NOTE_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        addNotePending: true,
        addNoteError: null,
      };

    case ROADMAP_ADD_NOTE_SUCCESS:
      // The request is success
      return {
        ...state,
        addNotePending: false,
        addNoteError: null,
      };

    case ROADMAP_ADD_NOTE_FAILURE:
      // The request is failed
      return {
        ...state,
        addNotePending: false,
        addNoteError: action.data.error,
      };

    case ROADMAP_ADD_NOTE_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        addNoteError: null,
      };

    default:
      return state;
  }
}
