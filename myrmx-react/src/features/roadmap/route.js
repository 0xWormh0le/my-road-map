import { RoadmapPage, CompetencyPage, ActionItemPage, EditAssignedCoachesPage, NotePage, AnswerPage } from './';
// This is the JSON way to define React Router rules in a Rekit app.
// Learn more from: http://rekit.js.org/docs/routing.html


export default {
  path: 'roadmap',
  childRoutes: [
    {
      path: ':roadmapId',
      childRoutes: [
        { path: '', component: RoadmapPage },
        { path: 'edit-assigned-coaches', component: EditAssignedCoachesPage },
        {
          path: 'stage/:stageId/competency/:competencyId',
          childRoutes: [
            { path: '', component: CompetencyPage },
            { path: 'action-item/:actionItemId', component: ActionItemPage },
            { path: 'note/add', component: NotePage },
            { path: 'note/:noteId', component: NotePage },
            { path: 'question/:questionId/answer/add', component: AnswerPage },
            { path: 'question/:questionId/answer/:answerId', component: AnswerPage },
          ]
        },
      ],
    },
  ],
};
