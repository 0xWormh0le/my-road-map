import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  ROADMAP_ADD_COMPETENCY_ATTACHMENT_BEGIN,
  ROADMAP_ADD_COMPETENCY_ATTACHMENT_SUCCESS,
  ROADMAP_ADD_COMPETENCY_ATTACHMENT_FAILURE,
  ROADMAP_ADD_COMPETENCY_ATTACHMENT_DISMISS_ERROR,
} from './constants';

import fp from 'lodash/fp';
import axios from 'axios';
import config from '../../../common/config';
import { createAxiosFormDataConfigWithAuth } from '../../../common/apiHelpers';

const ROADMAP_ADD_COMPETENCY_ATTACHMENT_PROGRESS = 'ROADMAP_ADD_COMPETENCY_ATTACHMENT_PROGRESS';

const ROADMAP_ADD_COMPETENCY_ATTACHMENT_RESET = 'ROADMAP_ADD_COMPETENCY_ATTACHMENT_RESET';

export function addCompetencyAttachment(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: ROADMAP_ADD_COMPETENCY_ATTACHMENT_BEGIN,
    });

    const { roadmapId, competency, data } = args;

    const conf = {
      ...createAxiosFormDataConfigWithAuth(getState()),
      onUploadProgress: e => dispatch({
        type: ROADMAP_ADD_COMPETENCY_ATTACHMENT_PROGRESS,
        data: e.loaded / e.total
      })
    }

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.post(
        `${config.apiRootUrl}/roadmaps/${roadmapId}/stages/${competency.stage}/competencies/${competency.id}/add-attachment/`,
        data,
        conf,
      );

      doRequest.then(
        (res) => {
          dispatch({
            type: ROADMAP_ADD_COMPETENCY_ATTACHMENT_SUCCESS,
            data: {
              competencyId: competency.id,
              res: res.data
            },
          });
          resolve(res.data);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: ROADMAP_ADD_COMPETENCY_ATTACHMENT_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissAddCompetencyAttachmentError() {
  return {
    type: ROADMAP_ADD_COMPETENCY_ATTACHMENT_DISMISS_ERROR,
  };
}

export function useAddCompetencyAttachment() {
  const dispatch = useDispatch();

  const { 
    addCompetencyAttachmentPending, 
    addCompetencyAttachmentError,
    addCompetencyAttachmentProgress,
  } = useSelector(
    state => ({
      addCompetencyAttachmentPending: state.roadmap.addCompetencyAttachmentPending,
      addCompetencyAttachmentError: state.roadmap.addCompetencyAttachmentError,
      addCompetencyAttachmentProgress: state.roadmap.addCompetencyAttachmentProgress,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(addCompetencyAttachment(...args));
  }, [dispatch]);

  const addCompetencyAttachmentReset = useCallback(() => {
    return dispatch({ type: ROADMAP_ADD_COMPETENCY_ATTACHMENT_RESET });
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissAddCompetencyAttachmentError());
  }, [dispatch]);

  return {
    addCompetencyAttachment: boundAction,
    addCompetencyAttachmentProgress,
    addCompetencyAttachmentReset,
    addCompetencyAttachmentPending,
    addCompetencyAttachmentError,
    dismissAddCompetencyAttachmentError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case ROADMAP_ADD_COMPETENCY_ATTACHMENT_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        addCompetencyAttachmentProgress: 0,
        addCompetencyAttachmentPending: true,
        addCompetencyAttachmentError: null,
      };
    
    case ROADMAP_ADD_COMPETENCY_ATTACHMENT_RESET:
      return {
        ...state,
        addCompetencyAttachmentProgress: undefined,
        addCompetencyAttachmentPending: false,
        addCompetencyAttachmentError: null,
      };
    case ROADMAP_ADD_COMPETENCY_ATTACHMENT_PROGRESS:
      return {
        ...state,
        addCompetencyAttachmentProgress: action.data
      };

    case ROADMAP_ADD_COMPETENCY_ATTACHMENT_SUCCESS:
      // The request is success
      const attachments = state.competencies[action.data.competencyId].attachments;

      return fp.compose(
        fp.set('addCompetencyAttachmentProgress', 1),
        fp.set('addCompetencyAttachmentPending', false),
        fp.set('addCompetencyAttachmentError', null),
        fp.set(
          `competencies[${action.data.competencyId}].attachments`,
          attachments.concat([action.data.res])
        )
      )(state)

    case ROADMAP_ADD_COMPETENCY_ATTACHMENT_FAILURE:
      // The request is failed
      return {
        ...state,
        addCompetencyAttachmentPending: false,
        addCompetencyAttachmentError: action.data.error,
      };

    case ROADMAP_ADD_COMPETENCY_ATTACHMENT_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        addCompetencyAttachmentError: null,
      };

    default:
      return state;
  }
}
