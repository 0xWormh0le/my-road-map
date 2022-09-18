import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  ROADMAP_UPDATE_NOTE_BEGIN,
  ROADMAP_UPDATE_NOTE_SUCCESS,
  ROADMAP_UPDATE_NOTE_FAILURE,
  ROADMAP_UPDATE_NOTE_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function updateNote(args = {}) {
  return (dispatch, getState) => {
    dispatch({
      type: ROADMAP_UPDATE_NOTE_BEGIN,
    });

    const { roadmapId, stageId, competencyId, noteText, noteId } = args;
    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.patch(
        `${config.apiRootUrl}/roadmaps/${roadmapId}/stages/${stageId}/competencies/${competencyId}/notes/${noteId}/`,
        { text: noteText },
        createAxiosConfigWithAuth(getState()),
      );
      doRequest.then(
        (res) => {
          dispatch({
            type: ROADMAP_UPDATE_NOTE_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: ROADMAP_UPDATE_NOTE_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissUpdateNoteError() {
  return {
    type: ROADMAP_UPDATE_NOTE_DISMISS_ERROR,
  };
}

export function useUpdateNote() {
  const dispatch = useDispatch();

  const { editNotePending, editNoteError } = useSelector(
    state => ({
      editNotePending: state.roadmap.editNotePending,
      editNoteError: state.roadmap.editNoteError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(updateNote(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissUpdateNoteError());
  }, [dispatch]);

  return {
    updateNote: boundAction,
    editNotePending,
    editNoteError,
    dismissUpdateNoteError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case ROADMAP_UPDATE_NOTE_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        updateNotePending: true,
        updateNoteError: null,
      };

    case ROADMAP_UPDATE_NOTE_SUCCESS:
      // The request is success
      return {
        ...state,
        updateNotePending: false,
        updateNoteError: null,
      };

    case ROADMAP_UPDATE_NOTE_FAILURE:
      // The request is failed
      return {
        ...state,
        updateNotePending: false,
        updateNoteError: action.data.error,
      };

    case ROADMAP_UPDATE_NOTE_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        updateNoteError: null,
      };

    default:
      return state;
  }
}
