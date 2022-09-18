import React, { useCallback, useEffect, useMemo } from 'react';
// import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useLocation } from 'react-router-dom';
import lodash from 'lodash';
import Switch from 'react-switch';
import Button from 'react-bootstrap/Button';

import { Header, Loader } from '../common';
import {
  useBulkSwitchNotificationsSettings,
  useFetchNotificationsSettings,
  useFetchUser,
  useUpdateNotificationsSettings,
} from './redux/hooks';
import { useUnauthorizedErrorHandler } from '../../common/apiHelpers';

const subPathToDeliveryType = {
  'email': 1,
  'in-app': 2,
  'mobile-push': 3,
  'desktop-push': 4,
};

const subPathToTitle = {
  'email': 'Email notifications',
  'in-app': 'In app notifications',
  'mobile-push': 'Mobile push notifications',
  'desktop-push': 'Desktop push notifications',
};

const notificationTypeToLabel = {
  6: 'Daily digest',
  7: 'New comment',
  8: 'New direct message',
  9: 'New message in group chat',
  10: 'Your student needs approval on an action item',
  11: 'Coach approved/rejected your action item',
  12: 'Action item due today for your student',
  13: 'Action item due today for you',
  14: 'Coach created a new action item for you',
  15: 'Your student added an action item',
  16: 'Coach approved/rejected a green assessment',
  17: 'Your student needs approval on a green assessment ',
  18: 'Coach assessed your competency',
  19: 'Your student completed an assessment',
  20: 'Your student assessed themself as red for a competency',
  21: 'New coach assigned to you',
  22: 'New student assigned to you',
  23: 'Someone invited you to be their coach',
  24: 'Someone accepted your invitation to coach you',
  25: 'Your student assigned you to coach them on a specific Roadmap',
  26: 'New competency added to your Roadmap',
  27: 'New user in your company',
  34: 'Your coach assigned you to a specific Roadmap'
};

export default function DeliveryTypeNotificationsSettingsPage() {
  const location = useLocation();

  const { user } = useFetchUser();
  const { notificationsSettings, fetchNotificationsSettings } = useFetchNotificationsSettings();
  const { updateNotificationsSettings } = useUpdateNotificationsSettings();
  const { bulkSwitchNotificationsSettings } = useBulkSwitchNotificationsSettings();

  const unauthorizedErrorHandler = useUnauthorizedErrorHandler();

  const subPath = lodash.last(location.pathname.split('/'));
  const allNotificationsDisabled = notificationsSettings ? lodash.every(notificationsSettings, n => !n.enabled) : false;

  const fetchNotificationsSettingsHandlingErrors = useCallback(() => {
    fetchNotificationsSettings({deliveryType: subPathToDeliveryType[subPath]}).catch(unauthorizedErrorHandler);
  }, [fetchNotificationsSettings, subPath, unauthorizedErrorHandler]);

  const updateNotificationsSettingsHandlingErrors = useCallback(args => {
    updateNotificationsSettings(args)
      .catch(unauthorizedErrorHandler)
      .then(fetchNotificationsSettingsHandlingErrors);
  }, [updateNotificationsSettings, unauthorizedErrorHandler, fetchNotificationsSettingsHandlingErrors]);

  const bulkSwitchNotificationsSettingsHandlingErrors = useCallback(enable => {
    const args = {
      delivery_type: subPathToDeliveryType[subPath],
      enabled: enable,
    };
    bulkSwitchNotificationsSettings(args)
      .catch(unauthorizedErrorHandler)
      .then(() => fetchNotificationsSettingsHandlingErrors());
  }, [
    subPath,
    bulkSwitchNotificationsSettings,
    unauthorizedErrorHandler,
    fetchNotificationsSettingsHandlingErrors,
  ]);

  useEffect(() => {
    if (!user) return;
    fetchNotificationsSettingsHandlingErrors();
  }, [user, fetchNotificationsSettingsHandlingErrors]);

  const orderedNotificationsSettings = useMemo(() => {
    if (!notificationsSettings) return [];
    return lodash.orderBy(notificationsSettings, ['notification_type']);
  }, [notificationsSettings]);

  if (!notificationsSettings) {
    return <Loader />
  }

  return (
    <div className="user-delivery-type-notifications-settings-page">
      <Header
        border
        icon="back"
        title={subPathToTitle[subPath]}
        defaultBackLink="/user/notifications-settings"
      />
      <Container>
        <Row>
          <Col>
            <Row noGutters>
              <Col className="button-container">
                <Button variant="white" onClick={() => bulkSwitchNotificationsSettingsHandlingErrors(allNotificationsDisabled)}>
                  {`Turn ${allNotificationsDisabled ? 'on' : 'off'} all`}
                </Button>
              </Col>
            </Row>
            {orderedNotificationsSettings.map(s => (
              <Row noGutters key={`${s.notification_type}-${s.delivery_type}`} className="notification-type-switch">
                <Col xs={9}>
                  {notificationTypeToLabel[s.notification_type]}
                </Col>
                <Col xs={3}>
                  <Switch
                    onChange={() => updateNotificationsSettingsHandlingErrors({
                      notification_type: s.notification_type,
                      delivery_type: s.delivery_type,
                      enabled: !s.enabled,
                    })}
                    checked={s.enabled}
                    onColor='#2f80ed'
                  />
                </Col>
              </Row>
            ))}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

DeliveryTypeNotificationsSettingsPage.propTypes = {};
DeliveryTypeNotificationsSettingsPage.defaultProps = {};
