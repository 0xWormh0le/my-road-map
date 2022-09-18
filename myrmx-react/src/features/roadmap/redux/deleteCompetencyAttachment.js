import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  ROADMAP_DELETE_COMPETENCY_ATTACHMENT_BEGIN,
  ROADMAP_DELETE_COMPETENCY_ATTACHMENT_SUCCESS,
  ROADMAP_DELETE_COMPETENCY_ATTACHMENT_FAILURE,
  ROADMAP_DELETE_COMPETENCY_ATTACHMENT_DISMISS_ERROR,
} from './constants';
import fp from 'lodash/fp';
import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function deleteCompetencyAttachment(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: ROADMAP_DELETE_COMPETENCY_ATTACHMENT_BEGIN,
    });

    const { roadmapId, competency, attachmentId } = args;

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.delete(
        `${config.apiRootUrl}/roadmaps/${roadmapId}/stages/${competency.stage}/competencies/${competency.id}/remove-attachment/${attachmentId}/`,
        createAxiosConfigWithAuth(getState()),
      );
      doRequest.then(
        () => {
          const data = { attachmentId, competencyId: competency.id };
          dispatch({
            type: ROADMAP_DELETE_COMPETENCY_ATTACHMENT_SUCCESS,
            data
          });
          resolve(data);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: ROADMAP_DELETE_COMPETENCY_ATTACHMENT_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissDeleteCompetencyAttachmentError() {
  return {
    type: ROADMAP_DELETE_COMPETENCY_ATTACHMENT_DISMISS_ERROR,
  };
}

export function useDeleteCompetencyAttachment() {
  const dispatch = useDispatch();

  const { deleteCompetencyAttachmentPending, deleteCompetencyAttachmentError } = useSelector(
    state => ({
      deleteCompetencyAttachmentPending: state.roadmap.deleteCompetencyAttachmentPending,
      deleteCompetencyAttachmentError: state.roadmap.deleteCompetencyAttachmentError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(deleteCompetencyAttachment(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissDeleteCompetencyAttachmentError());
  }, [dispatch]);

  return {
    deleteCompetencyAttachment: boundAction,
    deleteCompetencyAttachmentPending,
    deleteCompetencyAttachmentError,
    dismissDeleteCompetencyAttachmentError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case ROADMAP_DELETE_COMPETENCY_ATTACHMENT_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        deleteCompetencyAttachmentPending: true,
        deleteCompetencyAttachmentError: null,
      };

    case ROADMAP_DELETE_COMPETENCY_ATTACHMENT_SUCCESS:
      // The request is success
      const attachments = state.competencies[action.data.competencyId].attachments
      return fp.compose(
        fp.set('deleteCompetencyAttachmentPending', false),
        fp.set('deleteCompetencyAttachment', null),
        fp.set(
          `competencies[${action.data.competencyId}].attachments`,
          attachments.filter(att => att.id !== action.data.attachmentId)
        )
      )(state)

    case ROADMAP_DELETE_COMPETENCY_ATTACHMENT_FAILURE:
      // The request is failed
      return {
        ...state,
        deleteCompetencyAttachmentPending: false,
        deleteCompetencyAttachmentError: action.data.error,
      };

    case ROADMAP_DELETE_COMPETENCY_ATTACHMENT_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        deleteCompetencyAttachmentError: null,
      };

    default:
      return state;
  }
}
