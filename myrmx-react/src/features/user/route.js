// This is the JSON way to define React Router rules in a Rekit app.
// Learn more from: http://rekit.js.org/docs/routing.html

import {
  ProfilePage,
  UserPage,
  NotificationsSettingsPage,
  DeliveryTypeNotificationsSettingsPage,
} from './index';

export default {
  path: 'user',
  childRoutes: [
    { path: '', component: UserPage },
    { path: 'profile', component: ProfilePage },
    {
      path: 'notifications-settings',
      childRoutes: [
        { path: '', component: NotificationsSettingsPage },
        { path: 'mobile-push', component: DeliveryTypeNotificationsSettingsPage },
        { path: 'email', component: DeliveryTypeNotificationsSettingsPage },
        { path: 'desktop-push', component: DeliveryTypeNotificationsSettingsPage },
        { path: 'in-app', component: DeliveryTypeNotificationsSettingsPage },
      ],
    },
  ],
};
