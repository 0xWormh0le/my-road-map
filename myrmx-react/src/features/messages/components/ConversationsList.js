import React from 'react';
// import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentAltLines } from '@fortawesome/pro-duotone-svg-icons';
import { faMap } from '@fortawesome/pro-regular-svg-icons';
import Col from 'react-bootstrap/Col';
import dayjs from 'dayjs';
import clsx from 'clsx';

import UserAvatar from '../../common/UserAvatar';

function EmptyMessagesList() {
  return <div className="no-messages text-center mrm-mb-4">
    <FontAwesomeIcon icon={faCommentAltLines} size="4x" />
    <p className='theme-text'>No messages</p>
  </div>;
}

export const commentedOnNotificationVerb = 'COMMENTED';

export const conversationTypes = {
  p2p: 'p2p',
  group: 'group',
  comment: 'comment',
}

export default function ConversationsList(
  {
    commentsNotifications,
    onConversationSelect,
    peerLastReadMessageTimestamps,
    peerMessages,
    usersInfo,
    messagesSearchText,
    selectedPeerId,
  }
) {
  const latestNotificationsPerTarget = commentsNotifications ? commentsNotifications.results
    .filter(n => n.verb === commentedOnNotificationVerb && !!n.sender && !!n.target)
    .filter(n => {
      if (!messagesSearchText) return true;

      const regex = new RegExp(messagesSearchText, 'i');
      return n.sender.first_name.match(regex) ||
        n.sender.last_name.match(regex) ||
        n.target.competency.title.match(regex) ||
        n.target.competency.stage_title.match(regex);
    })
    .reduce((result, n) => {
      if (!(n.target_object_id in result) || n.unix_timestamp > result[n.target_object_id].unix_timestamp) {
        result[n.target_object_id] = n;
      }
      return result;
    }, {}) : {};

  const conversations = [].concat(
    Object.entries(peerMessages).map(([peerId, msgList]) => [conversationTypes.p2p, peerId, msgList[msgList.length - 1]]),
    Object.entries(latestNotificationsPerTarget).map(([_, note]) => [conversationTypes.comment, note.sender.username, note]),
  );
  conversations.sort((a, b) => {
    const aTs = a[0] === conversationTypes.p2p ? a[2].timestamp : a[2].unix_timestamp;
    const bTs = b[0] === conversationTypes.p2p ? b[2].timestamp : b[2].unix_timestamp;
    return bTs - aTs;  // We'd like reverse chronological order
  });

  return (
    <div className="messages-components-conversations-list">
      {conversations.length === 0 && <EmptyMessagesList />}
      {conversations.filter(([, peerId, ]) => !!usersInfo[peerId]).map(([convType, peerId, data]) => {
        const user = usersInfo[peerId];
        let hasUnreadMessages = false;
        let timestamp;
        let formattedMessage;
        let roadmapIcon = false;
        let itemKey;
        if (convType === conversationTypes.p2p) {
          const userMessages = peerMessages[peerId].filter(m => m.user.username === user.username);
          if (userMessages.length > 0) {
            if (peerId in peerLastReadMessageTimestamps) {
              const lastReadTimestamp = peerLastReadMessageTimestamps[peerId];
              hasUnreadMessages = userMessages.filter(m => m.timestamp > lastReadTimestamp).length > 0;
            }
            else {
              hasUnreadMessages = true;
            }
          }
          timestamp = data.timestamp;
          const effectiveText = data.text.length > 90 ? `${data.text.substring(0, 90)}…` : data.text;
          formattedMessage = <p className="last-msg theme-text-secondary">{effectiveText}</p>;
          itemKey = `${convType}-${peerId}`;
        } else {
          hasUnreadMessages = !data.read;
          timestamp = data.unix_timestamp;
          const competency = data.target.competency;
          formattedMessage = <p className="last-msg theme-text-secondary">
            New comment on <strong>{competency.stage_title} - {competency.title}</strong>
          </p>;
          itemKey = `${convType}-${data.target_object_id}`;
          roadmapIcon = true;
        }
        return (
          <div
            key={itemKey}
            className={clsx(
              'chat-list-row d-flex',
              {'selected-chat': convType === conversationTypes.p2p && selectedPeerId === peerId},
            )}
            onClick={() => onConversationSelect(convType, peerId, data)}
          >
            {hasUnreadMessages && <span className="dot float-left" />}

            <UserAvatar user={user} className="conversation-avatar">
              {roadmapIcon && <span className="message-roadmap-icon">
              <FontAwesomeIcon icon={faMap} className="text-white" size='xs'/>
            </span>}
            </UserAvatar>

            <Col className="chat-list-item">
              <div className="chat-info">
                <h5 className="theme-text-primary">{user.first_name} {user.last_name}</h5>
                <span className="theme-text-secondary">{dayjs(timestamp).fromNow()}</span>
              </div>
              {formattedMessage}
            </Col>
          </div>
        );
      })}
    </div>
  );
};

ConversationsList.propTypes = {};
ConversationsList.defaultProps = {};
