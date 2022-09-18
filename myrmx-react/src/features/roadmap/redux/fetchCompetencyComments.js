import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import fp from 'lodash/fp'
import {
  ROADMAP_FETCH_COMPETENCY_COMMENTS_BEGIN,
  ROADMAP_FETCH_COMPETENCY_COMMENTS_SUCCESS,
  ROADMAP_FETCH_COMPETENCY_COMMENTS_ADD,
  ROADMAP_FETCH_COMPETENCY_COMMENTS_REMOVE,
  ROADMAP_FETCH_COMPETENCY_COMMENTS_FAILURE,
  ROADMAP_FETCH_COMPETENCY_COMMENTS_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function fetchCompetencyComments(args = {}) {
  return (dispatch, getState) => {
    // optionally you can have getState as the second argument
    dispatch({
      type: ROADMAP_FETCH_COMPETENCY_COMMENTS_BEGIN,
    });

    const { roadmapId, stageId, competencyId, page, studentId } = args;
    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.get(
        `${config.apiRootUrl}/roadmaps/${roadmapId}/stages/${stageId}/competencies/${competencyId}/comments/`,
        {
          params: {
            ordering: '-date',
            page: page ? page + 1 : undefined,
            student: studentId,
          },
          ...createAxiosConfigWithAuth(getState()),
        }
      );
      doRequest.then(
        res => {
          dispatch({
            type: ROADMAP_FETCH_COMPETENCY_COMMENTS_SUCCESS,
            data: { page, ...res.data },
          });
          resolve(res.data.results);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        err => {
          dispatch({
            type: ROADMAP_FETCH_COMPETENCY_COMMENTS_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissFetchCompetencyCommentsError() {
  return {
    type: ROADMAP_FETCH_COMPETENCY_COMMENTS_DISMISS_ERROR,
  };
}

export function useFetchCompetencyComments() {
  const dispatch = useDispatch();

  const { comments, fetchCompetencyCommentsPending, fetchCompetencyCommentsError } = useSelector(
    state => ({
      comments: state.roadmap.competencyComments,
      fetchCompetencyCommentsPending: state.roadmap.fetchCompetencyCommentsPending,
      fetchCompetencyCommentsError: state.roadmap.fetchCompetencyCommentsError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (...args) => {
      return dispatch(fetchCompetencyComments(...args));
    },
    [dispatch],
  );

  const addComment = useCallback(
    comment => {
      return dispatch({
        type: ROADMAP_FETCH_COMPETENCY_COMMENTS_ADD,
        data: comment
      })
    },
    [dispatch]
  )

  const removeComment = useCallback(
    id => {
      return dispatch({
        type: ROADMAP_FETCH_COMPETENCY_COMMENTS_REMOVE,
        data: id
      })
    },
    [dispatch]
  )

  const boundDismissError = useCallback(() => {
    return dispatch(dismissFetchCompetencyCommentsError());
  }, [dispatch]);

  return {
    comments,
    addCompetencyComment: addComment,
    removeCompetencyComment: removeComment,
    fetchCompetencyComments: boundAction,
    fetchCompetencyCommentsPending,
    fetchCompetencyCommentsError,
    dismissFetchCompetencyCommentsError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case ROADMAP_FETCH_COMPETENCY_COMMENTS_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        fetchCompetencyCommentsPending: true,
        fetchCompetencyCommentsError: null,
      };

    case ROADMAP_FETCH_COMPETENCY_COMMENTS_ADD:
      return fp.compose(
        fp.set('competencyComments.results', [action.data].concat(
          state.competencyComments && state.competencyComments.results
            ? state.competencyComments.results
            : []
        )),
      )(state)

    case ROADMAP_FETCH_COMPETENCY_COMMENTS_REMOVE:
      return fp.compose(
        fp.set('competencyComments.results', state.competencyComments && state.competencyComments.results
          ? state.competencyComments.results.filter(c => c.id !== action.data)
          : []
        )
      )(state)

    case ROADMAP_FETCH_COMPETENCY_COMMENTS_SUCCESS:
      // The request is success
      const page = action.data.page || 0
      const results = page === 0 ? [] : state.competencyComments.results

      return fp.compose(
        fp.set('competencyComments', {
          page,
          next: action.data.next,
          count: action.data.count,
          results: results.concat(action.data.results)
        }),
        fp.set('fetchCompetencyCommentsPending', false),
        fp.set('fetchCompetencyCommentsError', null)
      )(state)

    case ROADMAP_FETCH_COMPETENCY_COMMENTS_FAILURE:
      // The request is failed
      return {
        ...state,
        fetchCompetencyCommentsPending: false,
        fetchCompetencyCommentsError: action.data.error,
      };

    case ROADMAP_FETCH_COMPETENCY_COMMENTS_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        fetchCompetencyCommentsError: null,
      };

    default:
      return state;
  }
}
