// This is the root reducer of the feature. It is used for:
//   1. Load reducers from each action in the feature and process them one by one.
//      Note that this part of code is mainly maintained by Rekit, you usually don't need to edit them.
//   2. Write cross-topic reducers. If a reducer is not bound to some specific action.
//      Then it could be written here.
// Learn more from the introduction of this approach:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da.

import initialState from './initialState';
import { reducer as fetchRoadmapStagesReducer } from './fetchRoadmapStages';
import { reducer as fetchStageCompetenciesReducer } from './fetchStageCompetencies';
import { reducer as fetchCompetencyCommentsReducer } from './fetchCompetencyComments';
import { reducer as fetchCompetencyAssessmentsReducer } from './fetchCompetencyAssessments';
import { reducer as fetchCompetencyGlobalActionItemsReducer } from './fetchCompetencyGlobalActionItems';
import { reducer as fetchCompetencyActionItemAssessmentsReducer } from './fetchCompetencyActionItemAssessments';
import { reducer as setCompetencyAssessmentReducer } from './setCompetencyAssessment';
import { reducer as setActionItemDetailsReducer } from './setActionItemDetails';
import { reducer as fetchRoadmapReducer } from './fetchRoadmap';
import { reducer as addCompetencyCommentReducer } from './addCompetencyComment';
import { reducer as deleteCompetencyCommentReducer } from './deleteCompetencyComment';
import { reducer as setSelectedCompetencyReducer } from './setSelectedCompetency';
import { reducer as fetchRecentCompetencyReducer } from './fetchRecentCompetency';
import { reducer as submitRecentCompetencyReducer } from './submitRecentCompetency';
import { reducer as addActionItemReducer } from './addActionItem';
import { reducer as deleteActionItemReducer } from './deleteActionItem';
import { reducer as addActionItemAttachmentReducer } from './addActionItemAttachment';
import { reducer as deleteActionItemAttachmentReducer } from './deleteActionItemAttachment';
import { reducer as addCompetencyAttachmentReducer } from './addCompetencyAttachment';
import { reducer as deleteCompetencyAttachmentReducer } from './deleteCompetencyAttachment';
import { reducer as fetchRoadmapCoachesReducer } from './fetchRoadmapCoaches';
import { reducer as bulkAssignRoadmapCoachesReducer } from './bulkAssignRoadmapCoaches';
import { reducer as addNoteReducer } from './addNote';
import { reducer as fetchCompetencyNotesReducer } from './fetchCompetencyNotes';
import { reducer as setActionItemAssessmentReducer } from './setActionItemAssessment';
import { reducer as approveCompetencyAssessmentReducer } from './approveCompetencyAssessment';
import { reducer as updateCompetencyAttachmentReducer } from './updateCompetencyAttachment';
import { reducer as fetchQuestionAnswersReducer } from './fetchQuestionAnswers';
import { reducer as addQuestionAnswerReducer } from './addQuestionAnswer';
import { reducer as updateQuestionAnswerReducer } from './updateQuestionAnswer';
import { reducer as updateNoteReducer } from './updateNote';
import { reducer as deleteNoteReducer } from './deleteNote';

const reducers = [
  fetchRoadmapStagesReducer,
  fetchStageCompetenciesReducer,
  fetchCompetencyCommentsReducer,
  fetchCompetencyAssessmentsReducer,
  fetchCompetencyGlobalActionItemsReducer,
  fetchCompetencyActionItemAssessmentsReducer,
  setCompetencyAssessmentReducer,
  setActionItemDetailsReducer,
  fetchRoadmapReducer,
  addCompetencyCommentReducer,
  deleteCompetencyCommentReducer,
  setSelectedCompetencyReducer,
  fetchRecentCompetencyReducer,
  submitRecentCompetencyReducer,
  addActionItemReducer,
  deleteActionItemReducer,
  addActionItemAttachmentReducer,
  deleteActionItemAttachmentReducer,
  addCompetencyAttachmentReducer,
  deleteCompetencyAttachmentReducer,
  fetchRoadmapCoachesReducer,
  bulkAssignRoadmapCoachesReducer,
  addNoteReducer,
  fetchCompetencyNotesReducer,
  setActionItemAssessmentReducer,
  approveCompetencyAssessmentReducer,
  updateCompetencyAttachmentReducer,
  fetchQuestionAnswersReducer,
  addQuestionAnswerReducer,
  updateQuestionAnswerReducer,
  updateNoteReducer,
  deleteNoteReducer,
];

export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    // Handle cross-topic actions here
    default:
      newState = state;
      break;
  }
  return reducers.reduce((s, r) => r(s, action), newState);
}
