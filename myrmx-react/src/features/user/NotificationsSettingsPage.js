import React, { Fragment, useEffect } from 'react';
// import PropTypes from 'prop-types';

import { faMobileAlt, faDesktopAlt } from '@fortawesome/pro-solid-svg-icons';
import { faEnvelope, faBell, faChevronRight } from '@fortawesome/pro-regular-svg-icons';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch } from 'react-redux';

import { Header } from '../common';
import { clearNotificationsSettings } from './redux/fetchNotificationsSettings';
import { useFetchUser } from './redux/fetchUser';

export default function NotificationsSettingsPage() {
  const dispatch = useDispatch();

  const menuItems = [
    { icon: faMobileAlt, label: 'Mobile push notifications', subPath: 'mobile-push' },
    { icon: faEnvelope, label: 'Email notifications', subPath: 'email' },
    { icon: faDesktopAlt, label: 'Desktop push notifications', subPath: 'desktop-push' },
  ]

  const { user } = useFetchUser();

  // Currently only coaches have tweakable in-app notifications
  // For other roles in-app section will be empty hence it's excluded by default
  if (user && user.groups.includes('Coach')) {
    menuItems.push({ icon: faBell, label: 'In app notifications', subPath: 'in-app' });
  }

  useEffect(() => {
    dispatch(clearNotificationsSettings());
  }, [dispatch]);

  return (
    <div className="user-notifications-settings-page">
      <Header
        border
        icon="back"
        title="Notifications"
        defaultBackLink="/user"
      />
      <Container>
        <Row>
          <Col>
            {menuItems.map((mi, key) => (
              <Fragment key={key}>
                <Link
                  to={{
                    back: 'user/notifications-settings',
                    pathname: `notifications-settings/${mi.subPath}`,
                    title: mi.label,
                  }}
                  className="theme-text-primary"
                >
                  <Row noGutters className="align-items-center notification-settings-page-row">
                    <Col xs={2}>
                      <FontAwesomeIcon icon={mi.icon} />
                    </Col>
                    <Col xs={9}>
                      <span>{mi.label}</span>
                    </Col>
                    <Col xs={1}>
                      <FontAwesomeIcon icon={faChevronRight} />
                    </Col>
                  </Row>
                </Link>
                <hr />
              </Fragment>
            ))}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

NotificationsSettingsPage.propTypes = {};
NotificationsSettingsPage.defaultProps = {};
