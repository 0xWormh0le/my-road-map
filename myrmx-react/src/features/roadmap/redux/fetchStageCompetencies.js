import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  ROADMAP_FETCH_STAGE_COMPETENCIES_BEGIN,
  ROADMAP_FETCH_STAGE_COMPETENCIES_SUCCESS,
  ROADMAP_FETCH_STAGE_COMPETENCIES_FAILURE,
  ROADMAP_FETCH_STAGE_COMPETENCIES_DISMISS_ERROR,
} from './constants';
import fp from 'lodash/fp';
import { MANAGE_HIDE_COMPETENCY_SUCCESS } from '../../manage/redux/constants'

import axios from 'axios';
import config from '../../../common/config';
import { createAxiosConfigWithAuth } from '../../../common/apiHelpers';

export function fetchStageCompetencies(args = {}) {
  return (dispatch, getState) => {
    // optionally you can have getState as the second argument
    dispatch({
      type: ROADMAP_FETCH_STAGE_COMPETENCIES_BEGIN,
    });

    const { roadmapId, studentId, stageId, competencyId, attachment } = args;
    const fetchingSingleCompetency = !!competencyId;
    const promise = new Promise((resolve, reject) => {
      let url = `${config.apiRootUrl}/roadmaps/${roadmapId}/stages/${stageId}/competencies/`

      if (fetchingSingleCompetency) {
        url += competencyId + '/';
      }

      const doRequest = axios.get(url, {
        params: {
          forStudent: studentId || null,
          details: attachment ? 'attachments' : null
        },
        ...createAxiosConfigWithAuth(getState())
      })

      doRequest.then(
        res => {
          const results = fetchingSingleCompetency ? [ res.data ] : res.data.results;
          dispatch({
            type: ROADMAP_FETCH_STAGE_COMPETENCIES_SUCCESS,
            data: results,
          });
          resolve(results);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        err => {
          dispatch({
            type: ROADMAP_FETCH_STAGE_COMPETENCIES_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissFetchStageCompetenciesError() {
  return {
    type: ROADMAP_FETCH_STAGE_COMPETENCIES_DISMISS_ERROR,
  };
}

export function useFetchStageCompetencies(params) {
  const dispatch = useDispatch();

  const { competencies, fetchStageCompetenciesPending, fetchStageCompetenciesError } = useSelector(
    state => ({
      competencies: state.roadmap.competencies,
      fetchStageCompetenciesPending: state.roadmap.fetchStageCompetenciesPending,
      fetchStageCompetenciesError: state.roadmap.fetchStageCompetenciesError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (...args) => {
      return dispatch(fetchStageCompetencies(...args));
    },
    [dispatch],
  );

  useEffect(() => {
    if (params) boundAction(...(params || []));
  }, [...(params || []), boundAction]); // eslint-disable-line

  const boundDismissError = useCallback(() => {
    return dispatch(dismissFetchStageCompetenciesError());
  }, [dispatch]);

  return {
    competencies,
    fetchStageCompetencies: boundAction,
    fetchStageCompetenciesPending,
    fetchStageCompetenciesError,
    dismissFetchStageCompetenciesError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case ROADMAP_FETCH_STAGE_COMPETENCIES_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        fetchStageCompetenciesPending: true,
        fetchStageCompetenciesError: null,
      };

    case ROADMAP_FETCH_STAGE_COMPETENCIES_SUCCESS:
      // The request is success
      return {
        ...state,
        fetchStageCompetenciesPending: false,
        fetchStageCompetenciesError: null,
        competencies: Object.assign({}, state.competencies, ...action.data.map(c => ({ [c.id]: c }))),
      };

    case MANAGE_HIDE_COMPETENCY_SUCCESS:
      const hiddenFor = fp.get(`competencies.${action.data.competency}.hidden_for`)(state)
      return fp.set(
        `competencies.${action.data.competency}.hidden_for`,
        fp.xor(hiddenFor, [action.data.student])
      )(state)

    case ROADMAP_FETCH_STAGE_COMPETENCIES_FAILURE:
      // The request is failed
      return {
        ...state,
        fetchStageCompetenciesPending: false,
        fetchStageCompetenciesError: action.data.error,
      };

    case ROADMAP_FETCH_STAGE_COMPETENCIES_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        fetchStageCompetenciesError: null,
      };

    default:
      return state;
  }
}
