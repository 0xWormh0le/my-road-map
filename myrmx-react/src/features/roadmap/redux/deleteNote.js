import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  ROADMAP_DELETE_NOTE_BEGIN,
  ROADMAP_DELETE_NOTE_SUCCESS,
  ROADMAP_DELETE_NOTE_FAILURE,
  ROADMAP_DELETE_NOTE_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function deleteNote(args = {}) {
  return (dispatch, getState) => {
    dispatch({
      type: ROADMAP_DELETE_NOTE_BEGIN,
    });

    const { roadmapId, stageId, competencyId, noteId } = args;
    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.delete(
        `${config.apiRootUrl}/roadmaps/${roadmapId}/stages/${stageId}/competencies/${competencyId}/notes/${noteId}/`,
        createAxiosConfigWithAuth(getState()),
      );
      doRequest.then(
        (res) => {
          dispatch({
            type: ROADMAP_DELETE_NOTE_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: ROADMAP_DELETE_NOTE_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissDeleteNoteError() {
  return {
    type: ROADMAP_DELETE_NOTE_DISMISS_ERROR,
  };
}

export function useDeleteNote() {
  const dispatch = useDispatch();

  const { deleteNotePending, deleteNoteError } = useSelector(
    state => ({
      deleteNotePending: state.roadmap.deleteNotePending,
      deleteNoteError: state.roadmap.deleteNoteError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(deleteNote(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissDeleteNoteError());
  }, [dispatch]);

  return {
    deleteNote: boundAction,
    deleteNotePending,
    deleteNoteError,
    dismissDeleteNoteError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case ROADMAP_DELETE_NOTE_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        deleteNotePending: true,
        deleteNoteError: null,
      };

    case ROADMAP_DELETE_NOTE_SUCCESS:
      // The request is success
      return {
        ...state,
        deleteNotePending: false,
        deleteNoteError: null,
      };

    case ROADMAP_DELETE_NOTE_FAILURE:
      // The request is failed
      return {
        ...state,
        deleteNotePending: false,
        deleteNoteError: action.data.error,
      };

    case ROADMAP_DELETE_NOTE_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        deleteNoteError: null,
      };

    default:
      return state;
  }
}
