import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  ROADMAP_ADD_ACTION_ITEM_ATTACHMENT_BEGIN,
  ROADMAP_ADD_ACTION_ITEM_ATTACHMENT_SUCCESS,
  ROADMAP_ADD_ACTION_ITEM_ATTACHMENT_FAILURE,
  ROADMAP_ADD_ACTION_ITEM_ATTACHMENT_DISMISS_ERROR,
} from './constants';

import fp from 'lodash/fp';
import axios from 'axios';
import config from '../../../common/config';
import { createAxiosFormDataConfigWithAuth } from '../../../common/apiHelpers';

const ROADMAP_ADD_ACTION_ITEM_ATTACHMENT_PROGRESS = 'ROADMAP_ADD_ACTION_ITEM_ATTACHMENT_PROGRESS';

const ROADMAP_ADD_ACTION_ITEM_ATTACHMENT_RESET = 'ROADMAP_ADD_ACTION_ITEM_ATTACHMENT_RESET';

export function addActionItemAttachment(args = {}) {
  return (dispatch, getState) => { // optionally you can have getState as the second argument
    dispatch({
      type: ROADMAP_ADD_ACTION_ITEM_ATTACHMENT_BEGIN,
    });

    const { roadmapId, stageId, competencyId, actionItemId, data } = args;

    const conf = {
      ...createAxiosFormDataConfigWithAuth(getState()),
      onUploadProgress: e => dispatch({
        type: ROADMAP_ADD_ACTION_ITEM_ATTACHMENT_PROGRESS,
        data: e.loaded / e.total
      })
    }

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.post(
        `${config.apiRootUrl}/roadmaps/${roadmapId}/stages/${stageId}/competencies/${competencyId}/action-item-assessments/${actionItemId}/add-attachment/`,
        data,
        conf,
      );
      doRequest.then(
        (res) => {
          dispatch({
            type: ROADMAP_ADD_ACTION_ITEM_ATTACHMENT_SUCCESS,
            data: {
              actionItemId,
              res: res.data
            },
          });
          resolve(res.data);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: ROADMAP_ADD_ACTION_ITEM_ATTACHMENT_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissAddActionItemAttachmentError() {
  return {
    type: ROADMAP_ADD_ACTION_ITEM_ATTACHMENT_DISMISS_ERROR,
  };
}

export function useAddActionItemAttachment() {
  const dispatch = useDispatch();

  const {
    addActionItemAttachmentPending,
    addActionItemAttachmentError,
    addActionItemAttachmentProgress,
  } = useSelector(
    state => ({
      addActionItemAttachmentPending: state.roadmap.addActionItemAttachmentPending,
      addActionItemAttachmentError: state.roadmap.addActionItemAttachmentError,
      addActionItemAttachmentProgress: state.roadmap.addActionItemAttachmentProgress,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(addActionItemAttachment(...args));
  }, [dispatch]);

  const addActionItemAttachmentReset = useCallback(() => {
    return dispatch({ type: ROADMAP_ADD_ACTION_ITEM_ATTACHMENT_RESET });
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissAddActionItemAttachmentError());
  }, [dispatch]);

  return {
    addActionItemAttachment: boundAction,
    addActionItemAttachmentProgress,
    addActionItemAttachmentReset,
    addActionItemAttachmentPending,
    addActionItemAttachmentError,
    dismissAddActionItemAttachmentError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case ROADMAP_ADD_ACTION_ITEM_ATTACHMENT_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        addActionItemAttachmentProgress: 0,
        addActionItemAttachmentPending: true,
        addActionItemAttachmentError: null,
      };
    
    case ROADMAP_ADD_ACTION_ITEM_ATTACHMENT_RESET:
      return {
        ...state,
        addActionItemAttachmentProgress: undefined,
        addActionItemAttachmentPending: false,
        addActionItemAttachmentError: null,
      };

    case ROADMAP_ADD_ACTION_ITEM_ATTACHMENT_PROGRESS:
      return {
        ...state,
        addActionItemAttachmentProgress: action.data
      };

    case ROADMAP_ADD_ACTION_ITEM_ATTACHMENT_SUCCESS:
      // The request is success

      const attachments = state.actionItems[action.data.actionItemId].attachments;

      return fp.compose(
        fp.set('addActionItemAttachmentProgress', 1),
        fp.set('addActionItemAttachmentPending', false),
        fp.set('addActionItemAttachmentError', null),
        fp.set(
          `actionItems[${action.data.actionItemId}].attachments`,
          attachments.concat([action.data.res])
        )
      )(state)

    case ROADMAP_ADD_ACTION_ITEM_ATTACHMENT_FAILURE:
      // The request is failed
      return {
        ...state,
        addActionItemAttachmentPending: false,
        addActionItemAttachmentError: action.data.error,
      };

    case ROADMAP_ADD_ACTION_ITEM_ATTACHMENT_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        addActionItemAttachmentError: null,
      };

    default:
      return state;
  }
}
