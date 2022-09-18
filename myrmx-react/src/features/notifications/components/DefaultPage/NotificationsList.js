import React, { Fragment } from 'react';
// import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/pro-duotone-svg-icons';

import { getUserInitials } from '../../../common/uiHelpers';
import useFollowNotification from '../../../common/useFollowNotificationHook';

const nonCompetencyNotificationVerbs = [
  'NEW_FILE_ATTACHED',
  'COMMENTED',
];

function renderNotificationMessage(n) {
  switch (n.verb) {
    case "COACH_ASSIGNED_STUDENT_TO_ROADMAP":
      return <Fragment>
        <strong>{n.sender.first_name} {n.sender.last_name}</strong>&nbsp;
        <span>{n.verb_display}</span>&nbsp;{n.target.title}
      </Fragment>;
    default:
      let competency = n.target ? (
        nonCompetencyNotificationVerbs.indexOf(n.verb) >= 0 ? n.target.competency : n.target
      ) : null;
      return (
        <Fragment>
          {n.sender && (
            <strong>{n.sender.first_name} {n.sender.last_name}</strong>
          )}
          &nbsp;
          <span>{n.verb_display}</span>&nbsp;
          {competency ? <strong>{competency.stage_title} - {competency.title}</strong> : null}
        </Fragment>
      )
  }
}

export default function NotificationsList({notifications, showSeparators = false}) {
  const followNotification = useFollowNotification();

  return (
    <div className="notifications-components-default-page-notifications-list">
      {notifications.results.length === 0 &&
      <div className="no-notifications theme-text">
        <FontAwesomeIcon icon={faBell} size="4x" /> No notifications
      </div>
      }
      {notifications.results.length > 0 && notifications.results.filter(n => !n.target_is_missing).map((n, idx) => {
        const senderInitials = getUserInitials(n.sender);

        return (<Fragment key={n.id}>
          {showSeparators && idx !== 0 && <hr />}
          <Row
            className="notification-row"

            noGutters
            onClick={() => followNotification(n)}
          >
            {!n.read && <span className="unread-marker" />}
            <div className="initials md mrm-mr-1">
              <span>{senderInitials}</span>
            </div>
            <Col className="d-flex flex-column justify-content-around">
              <p className="theme-text-primary">{renderNotificationMessage(n)}</p>
              <p className="theme-text-secondary">{dayjs(n.timestamp).fromNow()}</p>
            </Col>
          </Row>
        </Fragment>);
      })}
    </div>
  );
}

NotificationsList.propTypes = {};
NotificationsList.defaultProps = {};
