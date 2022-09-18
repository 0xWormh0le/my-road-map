import React, { useEffect, useCallback, useState } from 'react';
// import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMap } from '@fortawesome/pro-light-svg-icons';
import { faChevronRight, faPlus } from '@fortawesome/pro-regular-svg-icons';

import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { useUnauthorizedErrorHandler } from '../../common/apiHelpers';
import { useFetchUpdates } from '../common/redux/hooks';
import usePagination from '../common/usePagination';

import { useFetchRoadmaps } from './redux/hooks';
import { useFetchUser } from '../user/redux/hooks';
import { useFetchAuthToken } from '../home/redux/hooks';
import { InviteCoachModal } from '../user';
import { DesktopHeader, Loader, UserAvatar } from '../common';

const Roadmap = ({ data, unseenRoadmaps, ...other }) => (
  <Card className="mrm-mb-1 mrm-p-0_75" {...other} >
    <Row className="align-items-center" noGutters>
      {/* roadmap.icon */}
      {data.icon ? (
        <Card.Img alt={data.title} src={data.icon} />
      ) : (
        <FontAwesomeIcon className="default-roadmap-thumbnail mrm-p-0_75" icon={faMap} />
      )}
      <Col>
        <Card.Body>
          {/* roadmap.title */}
          {unseenRoadmaps?.indexOf(data.id) >= 0 && (
            <div>
              <span className="dot" />
              <span className="small"> New unseen activity</span>
            </div>
          )}
          <Card.Title>{data.title}</Card.Title>
          <Card.Text as="div">
            {/* roadmap.stats.total_progress */}
            {data.stats.total_progress > 0 && (
              <div className="progress">
                <div
                  style={{ width: `${data.stats.total_progress}%` }}
                  role="progressbar"
                  className="progress-bar"
                />
              </div>
            )}

            {data.stats.total_progress > 0 && (
              <span className="progress-text">{data.stats.total_progress.toFixed()}% complete</span>
            )}

            {data.stats.total_progress === 0 && (
              <span className="start-roadmap">Start Roadmap</span>
            )}

            <div className="assigned-coaches">
              {data.assigned_coaches.map(ar => (
                <UserAvatar size='xs' user={ar} key={ar.id} className="mrm-mr-0_25" />
              ))}
            </div>
          </Card.Text>
        </Card.Body>
      </Col>
      <FontAwesomeIcon icon={faChevronRight} size='sm' className="d-lg-none" />
    </Row>
  </Card>
)

const GreetingMessage = ({userApproved, roadmaps, user}) => {
  const message = useCallback(() => {
    if (!userApproved) {
      return 'Your account is not approved Contact your admin if you think this is in error.'
    } else if (roadmaps.results.length === 1) {
      return 'Get started on your Roadmap.'
    } else if (roadmaps.results.length > 1) {
      return 'What would you like to focus on today?'
    } else if (user.coaches.length === 0) {
      if (!user.features.can_assign_coach) {
        return 'You don\'t have a coach. Contact your admin to get access to one.'
      } else if (user.features.can_assign_roadmaps) {
        return 'Check back in when your coach has been assigned.'
      } else {
        return 'You don\'t have a coach. Invite one now.'
      }
    } else if (!user.features.can_assign_rodmaps) {
      return 'You don\'t have a Roadmap. Contact your admin or coach to get access to one.'
    } else if (user.features.can_assign_coach) {
      return 'Contact your admin or coach to start your first roadmap'
    } else {
      return 'You don\'t have a Roadmp. Add additional roadmaps.'
    }
  }, [userApproved, user, roadmaps])

  return <>
    <h2>Hey {user.first_name},</h2>
    <h3 className="mrm-mb-2">
      {message()}
    </h3>
  </>
}

export default function RoadmapsPage() {
  const { roadmaps, fetchRoadmapsPending, fetchRoadmaps } = useFetchRoadmaps();
  const { user } = useFetchUser();
  const { userApproved } = useFetchAuthToken();
  const { updates } = useFetchUpdates();
  const unauthorizedErrorHandler = useUnauthorizedErrorHandler();

  usePagination({
    fetchAction: fetchRoadmaps,
    actionArgs: {
      assignedCoaches: true,
      asStudent: true,
    },
    requestNextPage: () => roadmaps && roadmaps.next && !fetchRoadmapsPending
  })

  // Initial render
  useEffect(() => {
    fetchRoadmaps({ assignedCoaches: true, asStudent: true }).catch(unauthorizedErrorHandler);
  }, [fetchRoadmaps, unauthorizedErrorHandler]);

  const showInviteCoachButton = userApproved && roadmaps && roadmaps.length < 1 &&
    user && user.coaches.length === 0 && user.features.can_assign_coach && !user.features.can_assign_roadmaps;

  const [showInviteCoachModal, setShowInviteCoachModal] = useState(false);

  const handleInviteCoachClick = useCallback(() => setShowInviteCoachModal(true), []);

  const handleInviteCoachModalHide = useCallback(() => setShowInviteCoachModal(false), []);

  if (!roadmaps || !user) {
    return <Loader />
  }

  return (
    <div className="dashboard-roadmaps-page welcome container">
      <DesktopHeader />
      <Row>
        <Col xs={12} className="d-lg-none">
          <GreetingMessage
            userApproved={userApproved}
            roadmaps={roadmaps}
            user={user}
          />
        </Col>
        <Col xs={12} className="text-center d-none d-lg-block desktop-welcome">
          <GreetingMessage
            userApproved={userApproved}
            roadmaps={roadmaps}
            user={user}
          />
        </Col>
        <Col xs={12}>
          {showInviteCoachButton && <Button variant="primary" className="btn-100" onClick={handleInviteCoachClick}>
            Invite a Coach
          </Button>}
          {roadmaps.results.map(r => (
            <Link to={`/roadmap/${r.id}`} key={r.id} className="no-format">
              <Roadmap data={r} unseenRoadmaps={updates?.unseen_activity?.[user.id]?.roadmaps} />
            </Link>
          ))}
        </Col>
      </Row>
      {user.features.can_assign_roadmaps && <Row className="justify-content-center">
        <Col className="add-roadmap" xs={12} lg={4}>
          <Link to='/dashboard/roadmap-library'>
            <Button variant={roadmaps.length === 0 ? 'primary' : 'white' } className="btn-100">
              <FontAwesomeIcon icon={faPlus} className="mrm-mr-0_25" size='sm' />
              {roadmaps.length === 0 ? 'Add A Roadmap' : 'Add Additional Roadmaps' }
            </Button>
          </Link>
        </Col>
      </Row>}
      <InviteCoachModal
        show={showInviteCoachModal}
        onHide={handleInviteCoachModalHide}
      />
    </div>
  );
}

RoadmapsPage.propTypes = {};
RoadmapsPage.defaultProps = {};
