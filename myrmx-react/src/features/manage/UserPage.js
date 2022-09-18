import React, { useEffect, useState, useCallback } from 'react';
// import PropTypes from 'prop-types';
import { Link, useParams, useLocation } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import dayjs from 'dayjs'
import { faEnvelope, faPhone, faUser, faUsers, faHandsHelping } from '@fortawesome/pro-solid-svg-icons';
import { faCalendarAlt } from '@fortawesome/pro-regular-svg-icons';
import { DesktopHeader, Header, Loader, UserAvatar, DesktopBackButton } from '../common';
import { useFetchAssignedUsers } from '../dashboard/redux/hooks';
import Roadmap from '../dashboard/components/Roadmap';
import { DesktopProfileHeader, ProfileCardItem, UsersCards } from '../user/components/ProfileView';
import { useFetchUser } from '../user/redux/hooks';
import { EditUserProfileModal } from './EditUserProfilePage';
import useEffectiveBackLink from '../common/useEffectiveBackLinkHook';
import Linkify from 'react-linkify';

export default function UserPage() {
  const { fetchAssignedUsers, assignedUsers } = useFetchAssignedUsers()

  const [user, setUser] = useState(null)

  const params = useParams()

  const location = useLocation()

  const userId = Number(params.userId)

  const { user: userInfo, replaceStringWithSynonyms } = useFetchUser()

  const userGroups = userInfo ? userInfo.groups : []

  const canEditAssign = (userInfo ? !!userInfo.features.coach_can_assign_roadmaps : false) || userGroups.includes('Admin');

  const canEditUserProfile = userGroups.includes('Admin')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    fetchAssignedUsers({ userId })
  }, [fetchAssignedUsers, userId])

  useEffect(() => {
    if (assignedUsers) {
      setUser(assignedUsers.results.find(u => u.id === userId))
    }
  }, [assignedUsers, userId])

  const [showEditUserProfileModal, setShowEditUserProfileModal] = useState(false);

  const handleEditUserRoadmapModalHide = useCallback((saved) => {
    setShowEditUserProfileModal(false);
    if (typeof saved === "boolean" && saved) fetchAssignedUsers({ userId });
  }, [ fetchAssignedUsers, userId ]);

  const defaultBackLink =  !!user ? (
      userGroups.includes('Admin') ? '/manage/accounts' : '/dashboard/coach'
    ) : '/dashboard'
  

  const effectiveBackLink = useEffectiveBackLink(defaultBackLink)

  if (!user) {
    return <Loader />
  }

  const fullName = `${user.first_name} ${user.last_name}`;
  const groupNames = replaceStringWithSynonyms(user.groups.join(', '));
  const cohortNames = user.cohort.length > 0 ? user.cohort.map(t => t.text).join(', ') : 'None';
  const userLastLogin = user.last_login ? dayjs(user.last_seen).fromNow() : "Never";



  
  
  return (
    <div className="manage-user-page common-profile-view">
      <div className="desktop-view-container d-none d-lg-block">
        <DesktopHeader />
        <Container>
          <DesktopBackButton className="mrm-mt-2" defaultBackLink={effectiveBackLink} />
          <div className="profile-card theme-card">
            <Col>
              <Row>
                <Col>
                  <DesktopProfileHeader user={user}/>
                  {canEditUserProfile &&
                    <Link className="edit-profile-button" to={{
                        pathname: `/manage/user/${user.id}/edit-profile`,
                      }}>
                      <Button variant="gray">
                        Edit Account
                      </Button>
                    </Link>
                  }
                </Col>
              </Row>
              <Row className="mrm-mt-3">
                <Col lg={6}>
                  <ProfileCardItem icon={faUsers} label="Group" value={cohortNames} />
                  <ProfileCardItem icon={faUser} label="Account Type" value={groupNames} />
                  <ProfileCardItem icon={faEnvelope} label="Email" value={user.email} />
                </Col>
                <Col lg={6}>
                  <ProfileCardItem icon={faPhone} label="Phone" value={user.phone_number ? user.phone_number : 'N/A'} />
                  <ProfileCardItem icon={faCalendarAlt} label="Date joined" value={dayjs(user.date_joined).format('MMM D, YYYY')} />
                  <ProfileCardItem icon={faCalendarAlt} label="Last login" value={userLastLogin} />
                </Col>
              </Row>
            </Col>
          </div>
          {user.groups.includes('User') && <div className="profile-card theme-card mrm-p-1 position-relative">
            <h1 className="header theme-text-secondary">
              {replaceStringWithSynonyms('Coaches')}
            </h1>
            <div className="users-cards-container">
              <UsersCards users={user.coach} showMenu={false} />
            </div>
          </div>}
          {user.groups.includes('Coach') && <div className="profile-card theme-card mrm-p-1 position-relative">
            <h1 className="header theme-text-secondary">
              {replaceStringWithSynonyms('Students')}
            </h1>
            <div className="users-cards-container">
              <UsersCards users={user.students} showMenu={false} />
            </div>
          </div>}
          <div className="profile-card theme-card mrm-p-1 position-relative">
            <h1 className="header theme-text-secondary">Roadmaps</h1>
            {canEditAssign && (
                <Link to={{
                  pathname: `/manage/user/${user.id}/edit-roadmap`,
                  state: { backLink: location },
                }}>
                  <Button className="btn-edit-assigned-roadmaps" variant="white">
                    Edit Assigned Roadmaps
                  </Button>
                </Link>
            )}
            {user.roadmaps_info.length > 0
              ? user.roadmaps_info.map(roadmap => (
                <Roadmap
                  data={roadmap}
                  key={roadmap.id}
                  className="mrm-mt-1"
                />
              ))
              : <div className="no-roadmap">No Roadmaps</div>
            }
          </div>
        </Container>
        <EditUserProfileModal show={showEditUserProfileModal} onHide={handleEditUserRoadmapModalHide} userId={userId} />
      </div>
      <div className="mobile-view-container d-lg-none">
        <Header icon="back" defaultBackLink={effectiveBackLink} />
        <Card className="mrm-mx-1 profile-card">
          <Card.Body className="bg-white">
            <UserAvatar user={user} size="lg" className="avatar" />
            <div className="text-center mrm-mt-2 font-weight-bold font-size-large theme-text-normal">{fullName}</div>
            <Linkify componentDecorator={(decoratedHref, decoratedText, key) => ( <a target="blank" href={decoratedHref} key={key}> {decoratedText} </a> )}>
              <p className="text-center color-secondary font-size-smaller">{user.bio}</p>
            </Linkify>
            <hr />
            {user.roadmaps_info.length > 0
              ? user.roadmaps_info.map(roadmap => (
                <Roadmap
                  data={roadmap}
                  key={roadmap.id}
                  className="mrm-mt-1"
                />
              ))
              : <div className="no-roadmap">No Roadmaps</div>
            }
            {canEditAssign && (
              <div className="text-center mrm-mt-1">
                <Link to={{
                  pathname: `/manage/user/${user.id}/edit-roadmap`,
                  state: { backLink: location },
                }}>
                  <Button className="btn-edit-assigned-roadmaps" variant="white">
                    Edit Assigned Roadmaps
                  </Button>
                </Link>
              </div>
            )}
            {canEditUserProfile && (
              <div className="text-center mrm-mt-1">
                <Link to={{
                  pathname: `/manage/user/${user.id}/edit-profile`,
                  state: { backLink: location },
                }}>
                  <Button className="btn-edit-assigned-roadmaps" variant="white">
                    Edit Profile
                  </Button>
                </Link>
              </div>
            )}
            <hr />
            <ProfileCardItem icon={faUsers} label="Group" value={cohortNames} />
            <ProfileCardItem icon={faUser} label="Account Type" value={groupNames} />
            <ProfileCardItem
              icon={faHandsHelping}
              label={replaceStringWithSynonyms('Coaches')}
              value={user.coach.map(c => `${c.first_name} ${c.last_name}`).join(', ')}
            />
            <ProfileCardItem icon={faEnvelope} label="Email" value={user.email} />
            <ProfileCardItem icon={faPhone} label="Phone" value={user.phone_number ? user.phone_number : 'N/A'} />
            <ProfileCardItem icon={faCalendarAlt} label="Date joined" value={dayjs(user.date_joined).format('MMM D, YYYY')} />
            <ProfileCardItem icon={faCalendarAlt} label="Last login" value={userLastLogin} />
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

UserPage.propTypes = {};
UserPage.defaultProps = {};
