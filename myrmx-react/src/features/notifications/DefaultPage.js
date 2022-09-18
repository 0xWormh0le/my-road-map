import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH } from '@fortawesome/pro-regular-svg-icons';

import { Header, Loader } from '../common';
import { useUnauthorizedErrorHandler } from '../../common/apiHelpers';
import { useFetchUpdates } from '../common/redux/hooks';
import { useFetchUser } from '../user/redux/hooks';
import usePagination from '../common/usePagination';

import { useFetchNotifications, useMarkAllRead } from './redux/hooks';
import NotificationsList from './components/DefaultPage/NotificationsList';

const MarkAllAsReadModal = ({ show, onHide, onMark }) => (
  <Modal className="mark-all-as-read-modal modal-mobile-slide-from-bottom" show={show} onHide={onHide} >
    <Modal.Body className="text-center p-0">
      <div className="bg-white border-rounded">
        <Button className="btn-menu-item w-100" variant="white" onClick={onMark}>
          Mark all as read
        </Button>
      </div>
      <div className="bg-white mrm-mt-0_75 border-rounded">
        <Button className="btn-menu-item w-100" variant="white" onClick={onHide}>
          Cancel
        </Button>
      </div>
    </Modal.Body>
  </Modal>
)

export default function DefaultPage() {
  const { user } = useFetchUser();
  const { notifications, fetchNotifications, fetchNotificationsPending } = useFetchNotifications();
  const { markAllRead } = useMarkAllRead();
  const { fetchUpdates } = useFetchUpdates();
  const unauthorizedErrorHandler = useUnauthorizedErrorHandler();
  const [showMarkAllAsRead, setShowMarkAllAsRead] = useState(false);

  const { resetPage } = usePagination({
    fetchAction: fetchNotifications,
    requestNextPage: () => notifications && notifications.next && !fetchNotificationsPending
  });

  const handleMarkAllReadMenu = () => setShowMarkAllAsRead(true);
  const handleMarkAllAsReadHide = () => setShowMarkAllAsRead(false);
  
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (!user) return;
    // TODO: Add another .catch to handle rest of errors
    fetchNotifications().catch(unauthorizedErrorHandler);
  }, [user, fetchNotifications, unauthorizedErrorHandler]);

  function markAllAsRead() {
    markAllRead()
      .catch(unauthorizedErrorHandler)
      .then(() => {
        resetPage();
        fetchNotifications().catch(unauthorizedErrorHandler);
        fetchUpdates().catch(unauthorizedErrorHandler);
        setShowMarkAllAsRead(false);
      });
  }

  function unreadCount() {
    return notifications.results.filter(n => !n.read).length;
  }
  
  if (!notifications) {
    return <Loader />
  }

  const renderMarkAllReadMenu = () => (
    <div onClick={handleMarkAllReadMenu} className="d-sm-none d-block">
      <FontAwesomeIcon icon={faEllipsisH} />
    </div>
  );

  return (
    <div className="notifications-default-page">
      <Header 
        title="Notifications" 
        colSizes={[2,8,2]}
        renderThirdColumn={unreadCount() > 0 && renderMarkAllReadMenu}
        border
      />
      <Container>
        <NotificationsList notifications={notifications} />
        <MarkAllAsReadModal
          show={showMarkAllAsRead}
          onHide={handleMarkAllAsReadHide}
          onMark={markAllAsRead}
        />
      </Container>
    </div>
  );
}

DefaultPage.propTypes = {};
DefaultPage.defaultProps = {};
