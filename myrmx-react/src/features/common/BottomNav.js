import React, { useCallback } from 'react';
// import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Badge from 'react-bootstrap/Badge';

import { useFetchUpdates, useUpdateUnreadMessages } from './redux/hooks';
import { useFetchAuthToken } from '../home/redux/hooks';
import homeIcon from '../../images/icons/home.svg';
import homeIconActive from '../../images/icons/home-active.svg';
import messagesIcon from '../../images/icons/messages.svg';
import messagesIconActive from '../../images/icons/messages-active.svg';
import notificationsIcon from '../../images/icons/notifications.svg';
import notificationsIconActive from '../../images/icons/notifications-active.svg';
import menuIcon from '../../images/icons/menu.svg';
import menuIconActive from '../../images/icons/menu-active.svg';

export const appSections = {
  home: 'home',
  messages: 'messages',
  notifications: 'notifications',
  menu: 'menu',
};


export default function BottomNav({ activeSection }) {
  const history = useHistory();
  const { updates } = useFetchUpdates();
  const { unreadMessagesCount } = useUpdateUnreadMessages();
  const { userApproved } = useFetchAuthToken();
  const menuItems = [
    { to: userApproved? '/dashboard' : '/user-not-approved', section: appSections.home, icon: homeIcon, activeIcon: homeIconActive },
    { to: '/messages/default', section: appSections.messages, icon: messagesIcon, activeIcon: messagesIconActive },
    { to: '/notifications/default', section: appSections.notifications, icon: notificationsIcon, activeIcon: notificationsIconActive },
    { to: '/user', section: appSections.menu, icon: menuIcon, activeIcon: menuIconActive },
  ];

  const redirectTo = useCallback(mi => () => {
    if (mi.section === appSections.messages && window.location.pathname==='/messages/default') {
      history.go(0);
    } else {
      history.push(mi.to);
    }
  }, [history])

  return (
    <div className="common-bottom-nav d-lg-none">
      <Navbar fixed="bottom">
        <Nav fill className="w-100" activeKey={activeSection}>
          {menuItems.map((mi, i) => (
            <Nav.Item key={i}>
              <Nav.Link eventKey={mi.section} onClick={redirectTo(mi)}>
                <img src={activeSection === mi.section ? mi.activeIcon : mi.icon} alt="" />
              </Nav.Link>
              {i === 1 && unreadMessagesCount > 0 && (
                <Badge pill variant="danger" className="transparent-badge">
                  {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                </Badge>
              )}
              {i === 2 && updates && updates.unread_notifications_count > 0 && (
                <Badge pill variant="danger">
                  {updates.unread_notifications_count > 9 ? '9+' : updates.unread_notifications_count}
                </Badge>
              )}
            </Nav.Item>
          ))}
        </Nav>
      </Navbar>
    </div>
  );
}

BottomNav.propTypes = {};
BottomNav.defaultProps = {};
