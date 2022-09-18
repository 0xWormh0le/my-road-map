import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  ROADMAP_DELETE_ACTION_ITEM_ATTACHMENT_BEGIN,
  ROADMAP_DELETE_ACTION_ITEM_ATTACHMENT_SUCCESS,
  ROADMAP_DELETE_ACTION_ITEM_ATTACHMENT_FAILURE,
  ROADMAP_DELETE_ACTION_ITEM_ATTACHMENT_DISMISS_ERROR,
} from './constants';
import fp from 'lodash/fp';
import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function deleteActionItemAttachment(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: ROADMAP_DELETE_ACTION_ITEM_ATTACHMENT_BEGIN,
    });

    const { roadmapId, stageId, competencyId, actionItemId, attachmentId } = args;

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.delete(
        `${config.apiRootUrl}/roadmaps/${roadmapId}/stages/${stageId}/competencies/${competencyId}/action-item-assessments/${actionItemId}/remove-attachment/${attachmentId}/`,
        createAxiosConfigWithAuth(getState()),
      );
      doRequest.then(
        () => {
          const data = { actionItemId, attachmentId }
          dispatch({
            type: ROADMAP_DELETE_ACTION_ITEM_ATTACHMENT_SUCCESS,
            data,
          });
          resolve(data);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: ROADMAP_DELETE_ACTION_ITEM_ATTACHMENT_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissDeleteActionItemAttachmentError() {
  return {
    type: ROADMAP_DELETE_ACTION_ITEM_ATTACHMENT_DISMISS_ERROR,
  };
}

export function useDeleteActionItemAttachment() {
  const dispatch = useDispatch();

  const {
    deleteActionItemAttachmentPending,
    deleteActionItemAttachmentError
  } = useSelector(
    state => ({
      deleteActionItemAttachmentPending: state.roadmap.deleteActionItemAttachmentPending,
      deleteActionItemAttachmentError: state.roadmap.deleteActionItemAttachmentError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(deleteActionItemAttachment(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissDeleteActionItemAttachmentError());
  }, [dispatch]);

  return {
    deleteActionItemAttachment: boundAction,
    deleteActionItemAttachmentPending,
    deleteActionItemAttachmentError,
    dismissDeleteActionItemAttachmentError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case ROADMAP_DELETE_ACTION_ITEM_ATTACHMENT_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        deleteActionItemAttachmentPending: true,
        deleteActionItemAttachmentError: null,
      };

    case ROADMAP_DELETE_ACTION_ITEM_ATTACHMENT_SUCCESS:
      // The request is success
      const attachments = state.actionItems[action.data.actionItemId].attachments

      return fp.compose(
        fp.set('deleteActionItemAttachmentPending', false),
        fp.set('deleteActionItemAttachmentError', null),
        fp.set(
          `actionItems[${action.data.actionItemId}].attachments`,
          attachments.filter(att => att.id !== action.data.attachmentId)
        )
      )(state)

    case ROADMAP_DELETE_ACTION_ITEM_ATTACHMENT_FAILURE:
      // The request is failed
      return {
        ...state,
        deleteActionItemAttachmentPending: false,
        deleteActionItemAttachmentError: action.data.error,
      };

    case ROADMAP_DELETE_ACTION_ITEM_ATTACHMENT_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        deleteActionItemAttachmentError: null,
      };

    default:
      return state;
  }
}
