import React, { useEffect, useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinnerThird } from '@fortawesome/pro-duotone-svg-icons';
import { useFetchCoachInvitation, useAcceptCoachInvitation } from './redux/hooks'
// import PropTypes from 'prop-types';
import Loader from '../common/Loader';

export default function AcceptCoachInvitePage() {
  const { uid, token } = useParams()
  const history = useHistory()

  const { acceptCoachInvitation, acceptCoachInvitationPending } = useAcceptCoachInvitation()
  const { fetchCoachInvitation, fetchCoachInvitationPending, coachInvitation  } = useFetchCoachInvitation()

  useEffect(() => {
    fetchCoachInvitation({ uid, token }).catch(err => {
      let message;
      if (err.response && err.response.status === 403) {
        message = 'Only coaches can accept invitations';
      } else {
        message = `Unknown error occurred. ${err.message}`;
      }
      alert(message);
      history.push('/');
    });
  }, [fetchCoachInvitation, uid, token, history])

  const handleAcceptInvitation = useCallback(() => {
    acceptCoachInvitation({ uid, token})
      .then(() => {
        alert(`Okay. You are now coaching ${coachInvitation.first_name} ${coachInvitation.last_name}.`);
        history.push(`/manage/user/${uid}`)
      })
      .catch(e => {
        alert(`Failed to accept invitation. ${e.message}`)
      })
  }, [acceptCoachInvitation, coachInvitation, history, uid, token])

  if (fetchCoachInvitationPending || !coachInvitation) {
    return <Loader />
  }

  return (
    <div className="home-accept-coach-invite-page mrm-p-3">
      <p>Would you like to accept the invitation to be a coach to {coachInvitation.first_name} {coachInvitation.last_name}?</p>

      <Button onClick={handleAcceptInvitation} disabled={acceptCoachInvitationPending}>
        {acceptCoachInvitationPending && (
          <FontAwesomeIcon icon={faSpinnerThird} className="mrm-mr-0_25" size="xs" spin />
        )}
        Accept Invitation
      </Button>
    </div>
  );
};

AcceptCoachInvitePage.propTypes = {};
AcceptCoachInvitePage.defaultProps = {};
