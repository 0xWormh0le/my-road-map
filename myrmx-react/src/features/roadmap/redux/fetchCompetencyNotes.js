import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  ROADMAP_FETCH_COMPETENCY_NOTES_BEGIN,
  ROADMAP_FETCH_COMPETENCY_NOTES_SUCCESS,
  ROADMAP_FETCH_COMPETENCY_NOTES_FAILURE,
  ROADMAP_FETCH_COMPETENCY_NOTES_DISMISS_ERROR,
} from './constants';

import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function fetchCompetencyNotes(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: ROADMAP_FETCH_COMPETENCY_NOTES_BEGIN,
    });

    const { roadmapId, stageId, competencyId, userId, noteId } = args;

    const promise = new Promise((resolve, reject) => {
      let url = `${config.apiRootUrl}/roadmaps/${roadmapId}/stages/${stageId}/competencies/${competencyId}/notes/`
      if (noteId) url = `${url}${noteId}/`
      const requestConfig = createAxiosConfigWithAuth(getState());
      if (!noteId) {
        requestConfig.params = {
          ordering: '-pk',
          student: userId
        };
      }
      const doRequest = axios.get(url, requestConfig);
      doRequest.then(
        (res) => {
          const results = !noteId ? res.data.results : [res.data];
          dispatch({
            type: ROADMAP_FETCH_COMPETENCY_NOTES_SUCCESS,
            data: results,
          });
          resolve(results);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: ROADMAP_FETCH_COMPETENCY_NOTES_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissFetchCompetencyNotesError() {
  return {
    type: ROADMAP_FETCH_COMPETENCY_NOTES_DISMISS_ERROR,
  };
}

export function useFetchCompetencyNotes() {
  const dispatch = useDispatch();

  const { notes, fetchCompetencyNotesPending, fetchCompetencyNotesError } = useSelector(
    state => ({
      notes: state.roadmap.notes,
      fetchCompetencyNotesPending: state.roadmap.fetchCompetencyNotesPending,
      fetchCompetencyNotesError: state.roadmap.fetchCompetencyNotesError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(fetchCompetencyNotes(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissFetchCompetencyNotesError());
  }, [dispatch]);

  return {
    notes,
    fetchCompetencyNotes: boundAction,
    fetchCompetencyNotesPending,
    fetchCompetencyNotesError,
    dismissFetchCompetencyNotesError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case ROADMAP_FETCH_COMPETENCY_NOTES_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        fetchCompetencyNotesPending: true,
        fetchCompetencyNotesError: null,
      };

    case ROADMAP_FETCH_COMPETENCY_NOTES_SUCCESS:
      // The request is success
      return {
        ...state,
        notes: action.data,
        fetchCompetencyNotesPending: false,
        fetchCompetencyNotesError: null,
      };

    case ROADMAP_FETCH_COMPETENCY_NOTES_FAILURE:
      // The request is failed
      return {
        ...state,
        fetchCompetencyNotesPending: false,
        fetchCompetencyNotesError: action.data.error,
      };

    case ROADMAP_FETCH_COMPETENCY_NOTES_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        fetchCompetencyNotesError: null,
      };

    default:
      return state;
  }
}
