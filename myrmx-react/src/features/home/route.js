import {
  WelcomePage,
  LogInPage,
  SignUpPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  UnsubscribePage,
  AcceptCoachInvitePage
} from './';

export default {
  path: '',
  childRoutes: [
    { path: 'welcome', component: WelcomePage, isIndex: true, noSignIn: true },
    { path: 'log-in', component: LogInPage, noSignIn: true },
    { path: 'sign-up', component: SignUpPage, noSignIn: true },
    { path: 'forgot-password', component: ForgotPasswordPage, noSignIn: true  },
    { path: 'reset-password/:uid/:token', component: ResetPasswordPage, noSignIn: true },
    { path: 'unsubscribe/:uid/:token', component: UnsubscribePage, noSignIn: true },
    { path: 'accept-coach-invite/:uid/:token', component: AcceptCoachInvitePage }
  ],
};
