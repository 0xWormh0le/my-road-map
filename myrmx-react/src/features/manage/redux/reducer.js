// This is the root reducer of the feature. It is used for:
//   1. Load reducers from each action in the feature and process them one by one.
//      Note that this part of code is mainly maintained by Rekit, you usually don't need to edit them.
//   2. Write cross-topic reducers. If a reducer is not bound to some specific action.
//      Then it could be written here.
// Learn more from the introduction of this approach:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da.

import initialState from './initialState';
import { reducer as fetchUserRoadmapsReducer } from './fetchUserRoadmaps';
import { reducer as assignUserRoadmapReducer } from './assignUserRoadmap';
import { reducer as deleteUserRoadmapReducer } from './deleteUserRoadmap';
import { reducer as bulkAssignUserRoadmapsReducer } from './bulkAssignUserRoadmaps';
import { reducer as fetchCohortsReducer } from './fetchCohorts';
import { reducer as sendWelcomeEmailReducer } from './sendWelcomeEmail';
import { reducer as deleteUserReducer } from './deleteUser';
import { reducer as updateUserReducer } from './updateUser';
import { reducer as updateUserAvatarReducer } from './updateUserAvatar';
import { reducer as addUserReducer } from './addUser';
import { reducer as deleteCohortReducer } from './deleteCohort';
import { reducer as fetchCohortUsersReducer } from './fetchCohortUsers';
import { reducer as fetchUserAccountsReducer } from './fetchUserAccounts';
import { reducer as addRoadmapReducer } from './addRoadmap';
import { reducer as addCohortReducer } from './addCohort';
import { reducer as updateCohortReducer } from './updateCohort';
import { reducer as hideCompetencyReducer } from './hideCompetency';
import { reducer as addCompetencyReducer } from './addCompetency';
import { reducer as addStageReducer } from './addStage';
import { reducer as updateStageReducer } from './updateStage';
import { reducer as deleteRoadmapReducer } from './deleteRoadmap';
import { reducer as updateRoadmapReducer } from './updateRoadmap';
import { reducer as deleteStageReducer } from './deleteStage';
import { reducer as copyRoadmapReducer } from './copyRoadmap';
import { reducer as copyStageReducer } from './copyStage';
import { reducer as clearRoadmapAssessmentReducer } from './clearRoadmapAssessment';
import { reducer as reorderStageReducer } from './reorderStage';
import { reducer as reorderCompetencyReducer } from './reorderCompetency';
import { reducer as bulkAssignCohortsReducer } from './bulkAssignCohorts';
import { reducer as updateCompetencyReducer } from './updateCompetency';
import { reducer as deleteCompetencyReducer } from './deleteCompetency';
import { reducer as copyCompetencyReducer } from './copyCompetency';
import { reducer as addGlobalActionItemReducer } from './addGlobalActionItem';
import { reducer as updateGlobalActionItemReducer } from './updateGlobalActionItem';
import { reducer as deleteGlobalActionItemReducer } from './deleteGlobalActionItem';
import { reducer as fetchGlobalQuestionsReducer } from './fetchGlobalQuestions';
import { reducer as addGlobalQuestionReducer } from './addGlobalQuestion';
import { reducer as updateGlobalQuestionReducer } from './updateGlobalQuestion';
import { reducer as deleteGlobalQuestionReducer } from './deleteGlobalQuestion';
import { reducer as reorderActionItemsReducer } from './reorderActionItems';
import { reducer as reorderGlobalQuestionsReducer } from './reorderGlobalQuestions';

const reducers = [
  fetchUserRoadmapsReducer,
  assignUserRoadmapReducer,
  deleteUserRoadmapReducer,
  bulkAssignUserRoadmapsReducer,
  fetchCohortsReducer,
  sendWelcomeEmailReducer,
  deleteUserReducer,
  updateUserReducer,
  updateUserAvatarReducer,
  addUserReducer,
  deleteCohortReducer,
  fetchCohortUsersReducer,
  fetchUserAccountsReducer,
  addRoadmapReducer,
  addCohortReducer,
  updateCohortReducer,
  hideCompetencyReducer,
  addCompetencyReducer,
  addStageReducer,
  updateStageReducer,
  deleteRoadmapReducer,
  updateRoadmapReducer,
  deleteStageReducer,
  copyRoadmapReducer,
  copyStageReducer,
  clearRoadmapAssessmentReducer,
  reorderStageReducer,
  reorderCompetencyReducer,
  bulkAssignCohortsReducer,
  updateCompetencyReducer,
  deleteCompetencyReducer,
  copyCompetencyReducer,
  addGlobalActionItemReducer,
  updateGlobalActionItemReducer,
  deleteGlobalActionItemReducer,
  fetchGlobalQuestionsReducer,
  addGlobalQuestionReducer,
  updateGlobalQuestionReducer,
  deleteGlobalQuestionReducer,
  reorderActionItemsReducer,
  reorderGlobalQuestionsReducer,
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
