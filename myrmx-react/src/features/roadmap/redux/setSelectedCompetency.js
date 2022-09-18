import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ROADMAP_SET_SELECTED_COMPETENCY } from './constants';

export function setSelectedCompetency(data) {
  return {
    type: ROADMAP_SET_SELECTED_COMPETENCY,
    data,
  };
}

export function useSetSelectedCompetency() {
  const dispatch = useDispatch();
  const selectedCompetency = useSelector(state => state.roadmap.selectedCompetency);
  const boundAction = useCallback((...params) => dispatch(setSelectedCompetency(...params)), [
    dispatch,
  ]);
  return { selectedCompetency, setSelectedCompetency: boundAction };
}

export function reducer(state, action) {
  switch (action.type) {
    case ROADMAP_SET_SELECTED_COMPETENCY:
      return {
        ...state,
        selectedCompetency: action.data,
      };

    default:
      return state;
  }
}
