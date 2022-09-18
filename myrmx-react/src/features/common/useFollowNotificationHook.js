import { useHistory, useLocation } from 'react-router-dom';

import { useUnauthorizedErrorHandler } from '../../common/apiHelpers';
import { useMarkNotificationRead } from '../notifications/redux/hooks';
import { useFetchUpdates } from './redux/hooks';
import { useFetchUser } from '../user/redux/hooks';

const coachNotificationVerbs = [
  'NEEDS_APPROVAL',
  'AI_NEEDS_APPROVAL',
  'AI_RESPONSE_UPDATED',
];

const mutualNotificationVerbs = [
  'NEW_FILE_ATTACHED',
  'COMMENTED',
];

function useFollowNotification() {
  const history = useHistory();
  const location = useLocation();

  const { markNotificationRead } = useMarkNotificationRead();
  const { fetchUpdates } = useFetchUpdates();
  const unauthorizedErrorHandler = useUnauthorizedErrorHandler();
  const { user } = useFetchUser();

  function followNotificationLink(n) {
    let url;
    let state = { backLink: location };
    if (n.verb === 'NEW_USER') url = '/manage/accounts';
    else if (n.verb === 'COACH_ASSIGNED_STUDENT_TO_ROADMAP') url = '/dashboard/roadmaps';
    else if (n.target) {
      const isMutualNotification = mutualNotificationVerbs.indexOf(n.verb) >= 0;
      const competency = isMutualNotification ? n.target.competency : n.target;
      url = `/roadmap/${competency.roadmap_id}/stage/${competency.stage_id}/competency/${competency.id}`;
      const queryParams = [];
      if (coachNotificationVerbs.indexOf(n.verb) >= 0 ||
        (isMutualNotification && user && n.target.student_id !== user.id))
      {
        queryParams.push(`user=${n.sender.id}`);
      }
      if (n.verb === 'COMMENTED') queryParams.push('tab=comments');
      if (queryParams.length > 0) url = `${url}?${queryParams.join('&')}`;
    } else {
      // Fallback: nowhere to go
      url = '/notifications/default';
      state = undefined;
    }
    history.push(url, state);
  }

  function followNotification(n) {
    if (n.read) {
      followNotificationLink(n);
    } else {
      markNotificationRead({ notificationId: n.id })
        .catch(unauthorizedErrorHandler)
        .then(() => {
          fetchUpdates().catch(unauthorizedErrorHandler);
          followNotificationLink(n);
        });
    }
  }

  return followNotification;
}

export default useFollowNotification;
