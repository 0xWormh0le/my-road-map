import React, { useCallback, useState } from 'react';
// import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faUser, faUsers } from '@fortawesome/pro-solid-svg-icons';
import { faEllipsisH, faCalendarAlt } from '@fortawesome/pro-regular-svg-icons';
import dayjs from 'dayjs';

import { useFetchAuthToken } from '../../home/redux/hooks';
import { useFetchUser, useDeleteCoach } from '../redux/hooks';
import { ActionMenu, CustomDialog, DesktopHeader, Header, UserAvatar } from '../../common';
import InviteCoachModal from './InviteCoachModal';
import { Link, useLocation } from 'react-router-dom';
import Linkify from 'react-linkify';


function EditProfileButton({label, onClick}) {
  return (<Button
    variant="gray"
    type="button"
    size="sm"
    className="edit-profile-btn float-right btn-gray"
    onClick={onClick}
    >Edit Profile
  </Button>
  );
}

export function ProfileCardItem({icon, value, label}) {
  return (<Row className="profile-card-item" noGutters>
    <Col xs={2}>
      <FontAwesomeIcon icon={icon} size="lg" className="field" />
    </Col>
    <Col xs={10}>
      <p className="wrap theme-text-primary">{value}</p>
      <p className="theme-text-secondary">{label}</p>
    </Col>
  </Row>);
}

function InviteCoachButton({replaceStringWithSynonyms, onClick}) {
  return (<Button
    className="mx-auto mrm-mt-0_5 invite-coach"
    size="sm"
    type="button"
    variant="gray"
    onClick={onClick}
  >
    {replaceStringWithSynonyms('Invite a Coach')}
  </Button>);
}

const EllipsisMenuToggle = React.forwardRef(({ children, onClick }, ref) => {
  return <div
    className="more-btn-desktop"
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    <FontAwesomeIcon
      icon={faEllipsisH}
      size="sm"
    />
  </div>;
});

export function UsersCards({users, showMenu = true, onMenuOpen, renderDropdownItems}) {
  if (!users || users.length === 0) return <p>None</p>;

  return users.map(u => (
    <div className="coach-card" key={u.id}>
      <div className="card-in-card">
        <UserAvatar user={u} />
        <span>{`${u.first_name} ${u.last_name}`}</span>
      </div>
      {showMenu && (<>
        <Link onClick={typeof onMenuOpen === "function" ? onMenuOpen(u) : undefined} className="more-btn-desktop d-lg-none">
          <FontAwesomeIcon
            icon={faEllipsisH}
            size="sm"
          />
        </Link>
        <Dropdown className="d-none d-lg-block">
          <Dropdown.Toggle as={EllipsisMenuToggle} />
          <Dropdown.Menu align="right">
            {typeof renderDropdownItems === "function" && renderDropdownItems(u)}
          </Dropdown.Menu>
        </Dropdown>
      </>)}
    </div>
  ));
}

export function DesktopProfileHeader(
  {
    user,
    editButtonLabel,
    editButtonOnClick,
  }
) {
  const fullName = `${user.first_name} ${user.last_name}`;

  return (<div className="desktop-profile-header">
    <UserAvatar user={user} size="xl" className="avatar" />
    {typeof editButtonOnClick === "function" && <EditProfileButton onClick={editButtonOnClick} label={editButtonLabel} />}
    <div className="mrm-ml-8 mrm-pl-2">
      <h2 className="theme-text-primary font-size-largest">{fullName}</h2>
      <Linkify componentDecorator={(decoratedHref, decoratedText, key) => ( <a target="blank" href={decoratedHref} key={key}> {decoratedText} </a> )}>
        <p className="theme-text-secondary">{user.bio}</p>
      </Linkify>
    </div>
  </div>);
}

export default function ProfileView({ user, onEdit }) {
  const { userApproved } = useFetchAuthToken();

  const { replaceStringWithSynonyms } = useFetchUser()

  const { deleteCoach } = useDeleteCoach()

  const [coachMenu, setCoachMenu] = useState(null)

  const [studentMenu, setStudentMenu] = useState(null)

  const [coachDelete, setCoachDelete] = useState(null)

  const [inviteCoachModal, setInviteCoachModal] = useState(null)

  const handleCoachDetailClick = useCallback(coach => () => setCoachMenu(coach.id), [])

  const handleStudentDetailClick = useCallback(student => () => setStudentMenu(student), [])

  const handleCoachMenuHide = useCallback(() => setCoachMenu(null), [])

  const handleStudentMenuHide = useCallback(() => setStudentMenu(null), [])

  const handleCoachDeleteHide = useCallback(() => setCoachDelete(null), [])

  const handleInviteCoachClick = useCallback(() => setInviteCoachModal(true), [])

  const handleInviteCoachModalHide = useCallback(() => setInviteCoachModal(false), [])

  const handleRemoveCoachYes = useCallback(() => {
    setCoachDelete(null)
    deleteCoach(coachDelete)
  }, [coachDelete, deleteCoach])

  const handleRemoveCoach = useCallback(() => {
    setCoachDelete(coachMenu)
    setCoachMenu(null)
  }, [coachMenu])

  const location = useLocation()

  const fullName = `${user.first_name} ${user.last_name}`;
  const groupNames = replaceStringWithSynonyms(user.groups.join(', '));
  const cohortNames = user.cohort.length > 0 ? user.cohort.join(', ') : 'None';

  const studentMenuItems = [];
  if (studentMenu) {
    studentMenuItems.push({ user: studentMenu });
    studentMenuItems.push({
      label: 'View Profile',
      to: { pathname: `/manage/user/${studentMenu.id}`, state: { backLink: location } },
    });
    if (user && user.features.coach_can_assign_roadmaps) {
      studentMenuItems.push({
        label: 'Edit Assigned Roadmaps',
        to: { pathname: `/manage/user/${studentMenu.id}/edit-roadmap`, state: { backLink: location } },
      });
    }
  }

  const renderCoachDropdownItems = useCallback(coach => (<>
    <Dropdown.Item onClick={() => setCoachDelete(coach.id)}>
      {replaceStringWithSynonyms('Remove Coach')}
    </Dropdown.Item>
  </>), [replaceStringWithSynonyms]);

  const renderStudentDropdownItems = useCallback(student => (<>
    <Dropdown.Item as={Link} to={`/manage/user/${student.id}`}>
      View Profile
    </Dropdown.Item>
    {user && user.features.coach_can_assign_roadmaps && <Dropdown.Item
      as={Link}
      to={{ pathname: `/manage/user/${student.id}/edit-roadmap`, back: 'user/profile' }}
    >
      Edit Assigned Roadmaps
    </Dropdown.Item>}
  </>), [user]);

  return (
    <div className="user-components-profile-view common-profile-view">
      <div className="desktop-view-container d-none d-lg-block">
        <DesktopHeader />
        <Container>
          <div className="profile-card theme-card">
            <Col>
              <Row>
                <Col>
                  <DesktopProfileHeader user={user} editButtonOnClick={onEdit} editButtonLabel="Edit My Profile" />
                </Col>
              </Row>
              <Row className="mrm-mt-4">
                <Col lg={6}>
                  <ProfileCardItem icon={faUsers} label="Group" value={cohortNames} />
                  <ProfileCardItem icon={faUser} label="Account Type" value={groupNames} />
                  <ProfileCardItem icon={faEnvelope} label="Email" value={user.email} />
                </Col>
                <Col lg={6}>
                  <ProfileCardItem icon={faPhone} label="Phone" value={user.phone_number ? user.phone_number : 'None'} />
                  <ProfileCardItem icon={faCalendarAlt} label="Date joined" value={dayjs(user.date_joined).format('MMM D, YYYY')} />
                </Col>
              </Row>
            </Col>
          </div>
          {user.groups.includes('User') && <div className="profile-card theme-card mrm-p-1 position-relative">
            <h1 className="header theme-text-secondary">
              {replaceStringWithSynonyms('My Coaches')}
            </h1>
            {user.features.can_invite_coach && userApproved && <InviteCoachButton
              replaceStringWithSynonyms={replaceStringWithSynonyms}
              onClick={handleInviteCoachClick}
            />}
            <div className="users-cards-container">
              <UsersCards
                users={user.coaches}
                showMenu={user.features.can_assign_coach && userApproved}
                renderDropdownItems={renderCoachDropdownItems}
              />
            </div>
          </div>}
          {user.groups.includes('Coach') && <div className="profile-card theme-card mrm-p-1 position-relative">
            <h1 className="header theme-text-secondary">
              {replaceStringWithSynonyms('My Students')}
            </h1>
            <div className="users-cards-container">
              <UsersCards
                users={user.students}
                renderDropdownItems={renderStudentDropdownItems}
              />
            </div>
          </div>}
        </Container>
      </div>
      <div className="mobile-view-container d-lg-none">
        <Header icon="back" defaultBackLink="/user" />
        <Container>
          <div className="profile-card theme-card">
            <Col>
              <Row>
                <Col>
                  <UserAvatar user={user} size="lg" className="avatar" />
                  <EditProfileButton onClick={onEdit} />
                </Col>
              </Row>
              <Row className="profile-card-header text-center" noGutters>
                <Col>
                  <p className="font-weight-bold theme-text-primary">{fullName}</p>
                  <Linkify componentDecorator={(decoratedHref, decoratedText, key) => ( <a target="blank" href={decoratedHref} key={key}> {decoratedText} </a> )}>
                    <p className="theme-text-secondary font-size-smaller">{user.bio}</p>
                  </Linkify>
                </Col>
              </Row>
              <hr />
              <ProfileCardItem icon={faUsers} label="Group" value={cohortNames} />
              <ProfileCardItem icon={faUser} label="Account Type" value={groupNames} />
              <ProfileCardItem icon={faEnvelope} label="Email" value={user.email} />
              <ProfileCardItem icon={faPhone} label="Phone" value={user.phone_number ? user.phone_number : 'None'} />
              <ProfileCardItem icon={faCalendarAlt} label="Date joined" value={dayjs(user.date_joined).format('MMM D, YYYY')} />
              {user.groups.includes('User') && (
                <>
                  <hr />
                  <Row className="profile-card-item" noGutters>
                    <Col xs={12}>
                      <h1 className="header theme-text-secondary">
                        {replaceStringWithSynonyms('My Coaches')}
                      </h1>
                      {user.features.can_invite_coach && userApproved && <InviteCoachButton
                        replaceStringWithSynonyms={replaceStringWithSynonyms}
                        onClick={handleInviteCoachClick}
                      />}
                      <UsersCards
                        users={user.coaches}
                        showMenu={user.features.can_assign_coach && userApproved}
                        onMenuOpen={handleCoachDetailClick}
                      />
                    </Col>
                  </Row>
                </>
              )}
              {user.groups.includes('Coach') && (
                <>
                  <hr />
                  <Row className="profile-card-item" noGutters>
                    <Col xs={12}>
                      <h1 className="header theme-text-secondary">
                        {replaceStringWithSynonyms('My Students')}
                      </h1>
                      <UsersCards
                        users={user.students}
                        onMenuOpen={handleStudentDetailClick}
                      />
                    </Col>
                  </Row>
                </>
              )}
            </Col>
          </div>

          <ActionMenu
            show={!!coachMenu}
            onHide={handleCoachMenuHide}
            items={[{ label: replaceStringWithSynonyms('Remove Coach'), onClick: handleRemoveCoach }]}
          />

          {studentMenu && (
            <ActionMenu
              show={!!studentMenu}
              onHide={handleStudentMenuHide}
              items={studentMenuItems}
            />
          )}
        </Container>
      </div>

      <InviteCoachModal
        show={inviteCoachModal}
        onHide={handleInviteCoachModalHide}
      />

      <CustomDialog
        show={!!coachDelete}
        onHide={handleCoachDeleteHide}
        onYes={handleRemoveCoachYes}
        text={{
          caption: replaceStringWithSynonyms('Removing your coach will make is so they no longer have access to your account.'),
          yes: replaceStringWithSynonyms('Remove my coach')
        }}
      />
    </div>
  );
};

ProfileView.propTypes = {};
ProfileView.defaultProps = {};
