// This is the JSON way to define React Router rules in a Rekit app.
// Learn more from: http://rekit.js.org/docs/routing.html

import { DashboardPage, AdminPage, RoadmapsPage, RoadmapLibraryPage } from './';

export default {
  path: 'dashboard',
  component: DashboardPage,
  childRoutes: [
    { path: 'admin', component: AdminPage },
    { path: 'coach', component: AdminPage },
    { path: 'roadmaps', component: RoadmapsPage },
    { path: 'roadmap-library', component: RoadmapLibraryPage },
  ],
};
