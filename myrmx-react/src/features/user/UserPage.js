import React, { useCallback, useEffect, useState, Fragment, useMemo } from 'react';
import clsx from 'clsx';
// import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faBell } from '@fortawesome/pro-light-svg-icons';
import { faLifeRing, faUserPlus, faLock, faFileAlt, faSignOut, faChevronRight } from '@fortawesome/pro-regular-svg-icons';
import { faUser, faUsers, faMap } from '@fortawesome/pro-regular-svg-icons';
import { Header, UserAvatar, SwitchActiveCompanyModal, Loader } from '../common';
import { useLogout } from '../common/redux/hooks';
import { useFetchUser } from './redux/hooks';
import { useFetchAuthToken } from '../home/redux/hooks';
import InviteCoachModal from './components/InviteCoachModal';

const adminTiles = [
  { icon: faMap, label: 'Edit Roadmaps', link: '/manage/roadmaps' },
  { icon: faUser, label: 'Edit Accounts', link: '/manage/accounts' },
  { icon: faUsers, label: 'Edit Groups', link: '/manage/groups' },
]

const coachTiles = [
  // TODO: Uncomment the tile when it'll make sense
  // faDuoCheckCircle = faCheckCircle as faDuoCheckCircle from '@fortawesome/pro-duotone-svg-icons'
  // { icon: faDuoCheckCircle, label: 'My Action Items', link: ''},
]

function MenuItems({ items, chevron = true, useBlank = false }) {
  return <>
    {items.map((mi, key) => (
      <Fragment key={key}>
        <hr className={clsx({'invisible': key !== 0})} />
        <Link
          target={mi.onClick ? undefined : useBlank ? "_blank" : undefined }
          to={{ pathname: mi.link }}
          rel="noopener noreferrer"
          className="theme-text-primary"
        >
          <Row noGutters className="align-items-center user-page-item" onClick={mi.onClick}>
            <Col xs={1}>
              <FontAwesomeIcon icon={mi.icon} />
            </Col>
            <Col xs={10}>
              <span className="mrm-ml-0_5">{mi.label}</span>
            </Col>
            {chevron && <Col xs={1} className="text-right">
              <FontAwesomeIcon icon={faChevronRight} />
            </Col>}
          </Row>
        </Link>
      </Fragment>
    ))}
  </>;
}

export default function UserPage() {
  const { userApproved } = useFetchAuthToken();
  const { user, replaceStringWithSynonyms } = useFetchUser();
  const { logout } = useLogout();
  const history = useHistory();

  const [showSwitchActiveCompanyModal, setShowSwitchActiveCompanyModal] = useState(false);

  const handleSwitchOpen = () => setShowSwitchActiveCompanyModal(true);

  const handleSwitchClose = () => setShowSwitchActiveCompanyModal(false);

  const [showInviteCoachModal, setShowInviteCoachModal] = useState(false);

  const handleInviteCoachClick = useCallback(() => setShowInviteCoachModal(true), []);

  const handleInviteCoachModalHide = useCallback(() => setShowInviteCoachModal(false), []);

  const handleGotoNotificationsSettings = useCallback(() => {
    history.push('/user/notifications-settings');
  }, [history]);

  const handleLogOut = useCallback(() => {
    logout();
    history.push('/');
  }, [logout, history]);

  const tiles = useMemo(() => {
    const result = [];
    if (user) {
      if (user.groups.includes('Admin')) result.push(...adminTiles);
      if (user.groups.includes('Coach')) result.push(...coachTiles);
    }
    return result;
  }, [user]);

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (!user) {
    return <Loader />
  }

  const fullName = `${user.first_name} ${user.last_name}`;

  const mainMenuItems = [
    { icon: faBell, label: 'Notifications', onClick: handleGotoNotificationsSettings },
    { icon: faFileAlt, label: 'Terms of Service', link: 'https://www.myroadmap.io/#/terms-of-service'  },
    { icon: faLock, label: 'Privacy Policy', link: 'https://www.myroadmap.io/#/privacy-statement' },
    { icon: faLifeRing, label: 'Help', link: 'https://www.myroadmap.io/#/support' },
  ]

  const logoutMenuItems = [
    { icon: faSignOut, label: 'Log Out', onClick: handleLogOut },
  ]

  if (user.features.can_assign_coach && userApproved) {
    mainMenuItems.splice(0, 0, {
      icon: faUserPlus,
      label: replaceStringWithSynonyms('Invite a Coach'),
      onClick: handleInviteCoachClick,
    });
  }

  const renderDropDownMenu = () => (
    <div className="d-flex justify-content-center align-items-center">
      <h1 onClick={handleSwitchOpen}>{user.company_name}</h1>
      <div onClick={handleSwitchOpen} className="header-down-menu ml-2">
        <FontAwesomeIcon icon={faAngleDown}/>
      </div>
    </div>
  )

  return (
    <div className="user-user-page">
      <Header
        border
        title={user.company_name}
        dropDownMenu={user.all_companies.length > 1 && renderDropDownMenu}
      />
      <Container>
        <Row>
          <Col>
            <Row className="user-page-header">
              <Col xs={'auto'}>
                <UserAvatar user={user} />
              </Col>
              <Col className="user-name pl-0" xs={'auto'}>
                <p className="theme-text-primary">{fullName}</p>
                <p className="mb-0">
                  <Link to="/user/profile" className="theme-text-secondary font-weight-bold">View profile</Link>
                </p>
              </Col>
            </Row>
            {tiles.length > 0 && <MenuItems items={tiles} />}
            <MenuItems items={mainMenuItems} useBlank={true} />
            <MenuItems items={logoutMenuItems} chevron={false} />
            <SwitchActiveCompanyModal
              show={showSwitchActiveCompanyModal}
              onHide={handleSwitchClose}
            />
            <InviteCoachModal
              show={showInviteCoachModal}
              onHide={handleInviteCoachModalHide}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

UserPage.propTypes = {};
UserPage.defaultProps = {};
