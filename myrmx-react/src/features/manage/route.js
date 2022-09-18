// This is the JSON way to define React Router rules in a Rekit app.
// Learn more from: http://rekit.js.org/docs/routing.html

import {
  UserPage,
  EditUserRoadmapPage,
  EditUserProfilePage,
  GroupsPage,
  GroupViewPage,
  GroupEditPage,
  AccountsPage,
  RoadmapsPage,
  AddRoadmapPage,
  EditRoadmapPage,
  EditRoadmapDetailsPage,
  AddStageCompetencyPage,
  AddStagePage,
  RenameStagePage,
  AddStageDescriptionPage,
  AddStageCoachNotesPage,
  CompetencyPage,
  AddCompetencyCoachNotesPage,
  AddCompetencyIntroContentPage,
  AddCompetencyActionItemPage,
  RenameCompetencyPage,
  AddCompetencyGlobalQuestionsPage,
  AddCompetencySupplementalContentPage
} from './';

export default {
  path: 'manage',
  childRoutes: [
    { path: 'user/add-profile', component: EditUserProfilePage },
    { path: 'user/:userId', component: UserPage },
    { path: 'user/:userId/edit-roadmap', component: EditUserRoadmapPage },
    { path: 'user/:userId/edit-profile', component: EditUserProfilePage },
    { path: 'groups', component: GroupsPage },
    { path: 'groups/add', component: GroupEditPage },
    { path: 'groups/:groupId', component: GroupViewPage },
    { path: 'groups/:groupId/edit', component: GroupEditPage },
    { path: 'accounts', component: AccountsPage },
    { path: 'roadmaps', component: RoadmapsPage },
    { path: 'roadmaps/add-roadmap', component: AddRoadmapPage },
    { path: 'roadmaps/:roadmapId', component: EditRoadmapPage },
    { path: 'roadmaps/:roadmapId/edit', component: EditRoadmapDetailsPage },
    { path: 'roadmaps/:roadmapId/stages/add', component: AddStagePage },
    { path: 'roadmaps/:roadmapId/stages/:stageId/rename', component: RenameStagePage },
    { path: 'roadmaps/:roadmapId/stages/:stageId/add-description', component: AddStageDescriptionPage },
    { path: 'roadmaps/:roadmapId/stages/:stageId/add-notes', component: AddStageCoachNotesPage },
    { path: 'roadmaps/:roadmapId/stages/:stageId/competencies/add', component: AddStageCompetencyPage },
    { path: 'roadmaps/:roadmapId/stages/:stageId/competencies/:competencyId', component: CompetencyPage },
    { path: 'roadmaps/:roadmapId/stages/:stageId/competencies/:competencyId/rename', component: RenameCompetencyPage },
    { path: 'roadmaps/:roadmapId/stages/:stageId/competencies/:competencyId/add-notes', component: AddCompetencyCoachNotesPage },
    { path: 'roadmaps/:roadmapId/stages/:stageId/competencies/:competencyId/add-intro', component: AddCompetencyIntroContentPage },
    { path: 'roadmaps/:roadmapId/stages/:stageId/competencies/:competencyId/ai/add-ai', component: AddCompetencyActionItemPage },
    { path: 'roadmaps/:roadmapId/stages/:stageId/competencies/:competencyId/ai/:actionItemId', component: AddCompetencyActionItemPage },
    { path: 'roadmaps/:roadmapId/stages/:stageId/competencies/:competencyId/questions/add', component: AddCompetencyGlobalQuestionsPage },
    { path: 'roadmaps/:roadmapId/stages/:stageId/competencies/:competencyId/questions/:questionId', component: AddCompetencyGlobalQuestionsPage },
    { path: 'roadmaps/:roadmapId/stages/:stageId/competencies/:competencyId/supplemental/add-content', component: AddCompetencySupplementalContentPage },
  ],
};
