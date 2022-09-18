import _ from 'lodash';

import { App } from '../features/home';
import { PageNotFound } from '../features/common';
import { UserNotApproved } from '../features/common';
import homeRoute from '../features/home/route';
import userRoute from '../features/user/route';
import dashboardRoute from '../features/dashboard/route';
import roadmapRoute from '../features/roadmap/route';
import messagesRoute from '../features/messages/route';
import notificationsRoute from '../features/notifications/route';
import manageRoute from '../features/manage/route';

// NOTE: DO NOT CHANGE the 'childRoutes' name and the declaration pattern.
// This is used for Rekit cmds to register routes config for new features, and remove config when remove features, etc.
const childRoutes = [
  homeRoute,
  userRoute,
  dashboardRoute,
  roadmapRoute,
  messagesRoute,
  notificationsRoute,
  manageRoute,
];

const routes = [{
  path: '/',
  component: App,
  childRoutes: [
    ...childRoutes,
    { path: 'user-not-approved', name: 'User not approved', component: UserNotApproved },
    { path: '*', name: 'Page not found', component: PageNotFound },
  ].filter(r => r.component || (r.childRoutes && r.childRoutes.length > 0)),
}];

// Handle isIndex property of route config:
//  Dupicate it and put it as the first route rule.
function handleIndexRoute(route) {
  if (!route.childRoutes || !route.childRoutes.length) {
    return;
  }

  const indexRoute = _.find(route.childRoutes, (child => child.isIndex));
  if (indexRoute) {
    const first = { ...indexRoute };
    first.path = '';
    first.exact = true;
    first.autoIndexRoute = true; // mark it so that the simple nav won't show it.
    route.childRoutes.unshift(first);
  }
  route.childRoutes.forEach(handleIndexRoute);
}

routes.forEach(handleIndexRoute);
export default routes;
