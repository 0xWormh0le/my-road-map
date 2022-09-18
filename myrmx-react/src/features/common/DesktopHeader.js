import React, { useCallback, useEffect, useState, useRef } from 'react';
// import PropTypes from 'prop-types';
import { Link, NavLink, useHistory } from 'react-router-dom';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faEnvelope, faLifeRing, faSyncAlt, faUserCircle, faUser, faUsers, faMap } from '@fortawesome/pro-regular-svg-icons';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';

import dashboardIcon from '../../images/icons/dashboard.svg';

import { useFetchUpdates } from './redux/hooks';
import { useFetchUser } from '../user/redux/hooks';
import { useLogout } from './redux/hooks';
import { Loader, SwitchActiveCompanyModal, UserAvatar } from './index';
import { NotificationsList } from '../notifications';
import { useFetchNotifications, useMarkAllRead } from '../notifications/redux/hooks';
import { useUnauthorizedErrorHandler } from '../../common/apiHelpers';
import usePagination from './usePagination';
import defaultLogo from '../../images/mrm-logo.png'

const AdminMenuItem = React.forwardRef(({ children, onClick }, ref) => {
  return <div
    className="menu-item-container"
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    <Link className="menu-item" onClick={undefined}>
      Admin 
      <FontAwesomeIcon icon={faCaretDown} />
    </Link>
  </div>;
});

const NotificationsMenuItem = React.forwardRef(({ children, onClick }, ref) => {
  const { updates } = useFetchUpdates();
  return <div
    className="menu-item-container"
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    <FontAwesomeIcon icon={faBell} />
    {updates && updates.unread_notifications_count > 0 && (
      <Badge pill variant="danger">
        {updates.unread_notifications_count > 9 ? '9+' : updates.unread_notifications_count}
      </Badge>
    )}
  </div>;
});

const NotificationsDropdownMenu = React.forwardRef(
  ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
    const { user } = useFetchUser();
    const { notifications, fetchNotifications, fetchNotificationsPending } = useFetchNotifications();
    const { updates } = useFetchUpdates();
    const unauthorizedErrorHandler = useUnauthorizedErrorHandler();
    const { markAllRead } = useMarkAllRead();
    const scrollRef = useRef(null);

    const { resetPage } = usePagination({
      fetchAction: fetchNotifications,
      requestNextPage: () => notifications && notifications.next && !fetchNotificationsPending,
      scrollRef: scrollRef.current,
    });

    const onMarkAllRead = useCallback(() => markAllRead()
        .catch(unauthorizedErrorHandler)
        .then(() => {
          resetPage();
          fetchNotifications().catch(unauthorizedErrorHandler);
        }),
      [
        markAllRead,
        resetPage,
        fetchNotifications,
        unauthorizedErrorHandler,
      ]
    )

    useEffect(() => {
      if (!user) return;
      fetchNotifications().catch(unauthorizedErrorHandler);
    }, [user, fetchNotifications, unauthorizedErrorHandler]);

    return (
      <div
        ref={ref}
        style={style}
        className={clsx("notifications-dropdown-menu", className)}
        aria-labelledby={labeledBy}
      >
        <div className="notifications-list-wrapper" ref={scrollRef}>
          {!notifications && <Loader />}
          {!!notifications && <>
            <div className="notifications-list-header mrm-mt-0_5">
              {notifications.results.length > 0 && updates.unread_notifications_count > 0 &&
                <Button variant="gray" size="sm" className="float-right" onClick={onMarkAllRead}>
                  Mark all read
                </Button>
              }
              <h2>Notifications</h2>        
            </div>
            <NotificationsList notifications={notifications} showSeparators={true} />
          </>}
        </div>
      </div>
    );
  }
);

const UserAvatarMenuItem = React.forwardRef(({ children, onClick }, ref) => {
  const { user } = useFetchUser();

  return <div
    className="menu-item-container"
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    <UserAvatar user={user} size='sm' />
  </div>;
});

export default function DesktopHeader({ children, showPrimaryContent = true, replacePrimaryContent = false }) {
  const { user, replaceStringWithSynonyms } = useFetchUser();
  const { logout } = useLogout();
  const history = useHistory();

  const handleLogOut = useCallback(() => {
    logout();
    history.push('/log-in');
  }, [logout, history]);

  const [showSwitchActiveCompanyModal, setShowSwitchActiveCompanyModal] = useState(false);

  const handleSwitchOpen = () => setShowSwitchActiveCompanyModal(true);

  const handleSwitchClose = () => setShowSwitchActiveCompanyModal(false);

  function renderHeader() {
    const userCompany = user?.all_companies?.filter(c => c.id === user.company_id)[0];
    const userCompanyLogo = userCompany?.logo;

    return <div className="common-desktop-header">
      {showPrimaryContent && <div className="top-menu-container">
        {replacePrimaryContent && children}
        {!replacePrimaryContent && <Container>
          <Row>
            <Col className="left-menu d-flex align-items-center pl-0">
              {userCompanyLogo ? 
                <Link className="company-logo" to={"/dashboard/roadmaps"}><img src={userCompanyLogo} alt="Company logo" /></Link> : 
                (<Link className="company-logo" to={"/dashboard/roadmaps"}><img src={defaultLogo} alt="Company logo" /></Link>)}
              {user && user.groups && user.groups.includes('User') && <NavLink activeClassName="active" to={"/dashboard/roadmaps"}>My Roadmaps</NavLink>}
            </Col>
            <Col className="right-menu d-flex align-items-center justify-content-end pr-0">
              {user && user.groups && user.groups.includes('Coach') && <NavLink
                activeClassName="active"
                to="/dashboard/coach"
                className="menu-item"
              >
                {replaceStringWithSynonyms('Coaching')}
              </NavLink>}
              {user && user.groups && user.groups.includes('Admin') && <Dropdown className="menu-item">
                <Dropdown.Toggle as={AdminMenuItem} />
                <Dropdown.Menu className="admin-dropdown-menu" align="right">
                  <Dropdown.Item as={Link} to="/dashboard/admin">
                    <img src={dashboardIcon} alt="" />
                    Dashboard
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item as={Link} to="/manage/roadmaps">
                    <FontAwesomeIcon icon={faMap} />
                    Edit Roadmaps
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/manage/accounts">
                    <FontAwesomeIcon icon={faUser} />
                    Edit Accounts
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/manage/groups">
                    <FontAwesomeIcon icon={faUsers} />
                    Edit Groups
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>}
              <NavLink activeClassName="active" to={"/messages/default"} className="menu-item">
                <FontAwesomeIcon icon={faEnvelope} />
              </NavLink>
              <Dropdown className="menu-item">
                <Dropdown.Toggle as={NotificationsMenuItem} />
                <Dropdown.Menu as={NotificationsDropdownMenu} align="right" />
              </Dropdown>
              <Dropdown className="menu-item">
                <Dropdown.Toggle as={UserAvatarMenuItem} />
                <Dropdown.Menu className="profile-dropdown-menu" align="right">
                  <Dropdown.Item as={Link} to="/user/profile">
                    <FontAwesomeIcon icon={faUserCircle} />
                    Profile
                  </Dropdown.Item>
                  {user?.all_companies?.length > 1 && <Dropdown.Item onClick={handleSwitchOpen}>
                    <FontAwesomeIcon icon={faSyncAlt} />
                    Switch Company
                  </Dropdown.Item>}
                  <Dropdown.Item
                    href="https://www.myroadmap.io/#/support"
                    target="_blank"
                  >
                    <FontAwesomeIcon icon={faLifeRing} />
                    Help
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogOut}>Log Out</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>
        </Container>}
      </div>}
      {!replacePrimaryContent && children}
    </div>;
  }

  return (
    <div className="common-desktop-header-container d-none d-lg-block">
      <div className="static-placeholder">
        {renderHeader()}
      </div>
      <div className="fixed-actual-header">
        {renderHeader()}
      </div>
      <SwitchActiveCompanyModal
        show={showSwitchActiveCompanyModal}
        onHide={handleSwitchClose}
      />
    </div>
  );
};

DesktopHeader.propTypes = {};
DesktopHeader.defaultProps = {};
