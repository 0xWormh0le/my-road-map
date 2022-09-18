import initialState from './initialState';
import { reducer as fetchAuthTokenReducer } from './fetchAuthToken';
import { reducer as resetPasswordReducer } from './resetPassword';
import { reducer as confirmResetPasswordReducer } from './confirmResetPassword';
import { reducer as registerAccountReducer } from './registerAccount';
import { reducer as unsubscribeUserReducer } from './unsubscribeUser';
import { reducer as acceptCoachInvitationReducer } from './acceptCoachInvitation';
import { reducer as fetchCoachInvitationReducer } from './fetchCoachInvitation';

const reducers = [
  fetchAuthTokenReducer,
  resetPasswordReducer,
  confirmResetPasswordReducer,
  registerAccountReducer,
  unsubscribeUserReducer,
  acceptCoachInvitationReducer,
  fetchCoachInvitationReducer,
];

export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    // Handle cross-topic actions here
    default:
      newState = state;
      break;
  }
  /* istanbul ignore next */
  return reducers.reduce((s, r) => r(s, action), newState);
}
