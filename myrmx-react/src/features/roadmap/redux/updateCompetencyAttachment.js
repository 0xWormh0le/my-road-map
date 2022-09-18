import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  ROADMAP_UPDATE_COMPETENCY_ATTACHMENT_BEGIN,
  ROADMAP_UPDATE_COMPETENCY_ATTACHMENT_SUCCESS,
  ROADMAP_UPDATE_COMPETENCY_ATTACHMENT_FAILURE,
  ROADMAP_UPDATE_COMPETENCY_ATTACHMENT_DISMISS_ERROR,
} from './constants';

import fp from 'lodash/fp';
import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function updateCompetencyAttachment(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: ROADMAP_UPDATE_COMPETENCY_ATTACHMENT_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const { roadmapId, stageId, competencyId, attachmentId } = args;
      const doRequest = axios.patch(
        `${config.apiRootUrl}/roadmaps/${roadmapId}/stages/${stageId}/competencies/${competencyId}/update-attachment/${attachmentId}/`,
        args,
        createAxiosConfigWithAuth(getState())
      )

      doRequest.then(
        (res) => {
          dispatch({
            type: ROADMAP_UPDATE_COMPETENCY_ATTACHMENT_SUCCESS,
            data: {
              competencyId: competencyId,
              res: res.data,
            },
          });
          resolve(res.data);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: ROADMAP_UPDATE_COMPETENCY_ATTACHMENT_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissUpdateCompetencyAttachmentError() {
  return {
    type: ROADMAP_UPDATE_COMPETENCY_ATTACHMENT_DISMISS_ERROR,
  };
}

export function useUpdateCompetencyAttachment() {
  const dispatch = useDispatch();

  const { updateCompetencyAttachmentPending, updateCompetencyAttachmentError } = useSelector(
    state => ({
      updateCompetencyAttachmentPending: state.roadmap.updateCompetencyAttachmentPending,
      updateCompetencyAttachmentError: state.roadmap.updateCompetencyAttachmentError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(updateCompetencyAttachment(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissUpdateCompetencyAttachmentError());
  }, [dispatch]);

  return {
    updateCompetencyAttachment: boundAction,
    updateCompetencyAttachmentPending,
    updateCompetencyAttachmentError,
    dismissUpdateCompetencyAttachmentError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case ROADMAP_UPDATE_COMPETENCY_ATTACHMENT_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        updateCompetencyAttachmentPending: true,
        updateCompetencyAttachmentError: null,
      };

    case ROADMAP_UPDATE_COMPETENCY_ATTACHMENT_SUCCESS:
      // The request is success
      const attachments = state.competencies[action.data.competencyId].attachments;
      const attachIndex = attachments.findIndex(x => x.id === action.data.res.id) 
      return fp.compose(
        fp.set('updateCompetencyAttachmentPending', false),
        fp.set('updateCompetencyAttachmentError', null),
        fp.set(`competencies[${action.data.competencyId}].attachments[${attachIndex}]`,
          action.data.res
        )
      )(state);

    case ROADMAP_UPDATE_COMPETENCY_ATTACHMENT_FAILURE:
      // The request is failed
      return {
        ...state,
        updateCompetencyAttachmentPending: false,
        updateCompetencyAttachmentError: action.data.error,
      };

    case ROADMAP_UPDATE_COMPETENCY_ATTACHMENT_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        updateCompetencyAttachmentError: null,
      };

    default:
      return state;
  }
}
