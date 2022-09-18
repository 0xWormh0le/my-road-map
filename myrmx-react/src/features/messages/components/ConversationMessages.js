import React, { useCallback, useEffect, useRef, useState } from 'react';
// import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import dayjs from 'dayjs';
import Form from 'react-bootstrap/Form';
import TextareaAutosize from 'react-textarea-autosize';
import clsx from 'clsx';

import { UserAvatar } from '../../common';
import {
  useCreateUpdatePeerLastReadMessageTimestamp,
  useFetchConversationMessages,
} from '../redux/hooks';
import { useUnauthorizedErrorHandler } from '../../../common/apiHelpers';
import useTimeout from '../../common/useTimeoutHook';
import useFocusedInput from '../../common/useFocusedInputHook';

export default function ConversationMessages(
  {
    messages,
    onSendMessage,
    onUpdatePeerLastReadMessageTimestamp,
    peerLastReadMessageTimestamp,
    peerUser,
  }
) {
  const [ effectiveMessages, setEffectiveMessages ] = useState([]);
  const [ previousPageLastMessageTs, setPreviousPageLastMessageTs ] = useState(undefined);
  const [ submitDisabled, setSubmitDisabled ] = useState(true);

  const { createUpdatePeerLastReadMessageTimestamp } = useCreateUpdatePeerLastReadMessageTimestamp();
  const unauthorizedErrorHandler = useUnauthorizedErrorHandler();
  const { conversationMessages, fetchConversationMessages } = useFetchConversationMessages();

  useEffect(() => {
    if (!peerUser.username) return;
    fetchConversationMessages({ peerId: peerUser.username }).catch(unauthorizedErrorHandler);
  }, [ fetchConversationMessages, peerUser.username, unauthorizedErrorHandler ]);

  useEffect(() => {
    const oldestRecentMessageTimestamp = messages.length > 0 ? messages[0].timestamp : 0;
    const updatedEms = [
      ...((conversationMessages[peerUser.username] || {}).messages || []).filter(m => m.timestamp < oldestRecentMessageTimestamp),
      ...messages,
    ];
    setEffectiveMessages(updatedEms);
  }, [ messages, conversationMessages, peerUser.username ]);

  useEffect(() => {
    if (messagesListAnchorRef.current && typeof messagesListAnchorRef.current.scrollIntoView === "function") {
      messagesListAnchorRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [ effectiveMessages ]);

  useTimeout(() => setPreviousPageLastMessageTs(undefined), previousPageLastMessageTs ? 1000 : undefined);

  useEffect(() => {
    const peerMessages = effectiveMessages.filter(m => m.user.username === peerUser.username);
    if (peerMessages.length === 0) return;
    const lastMessageTimestamp = peerMessages[peerMessages.length - 1].timestamp;
    if (lastMessageTimestamp <= peerLastReadMessageTimestamp) return;
    const args = { peer_id: peerUser.username, timestamp: lastMessageTimestamp };
    createUpdatePeerLastReadMessageTimestamp(args)
      .catch(unauthorizedErrorHandler)
      .then(() => onUpdatePeerLastReadMessageTimestamp(args));
  }, [
    effectiveMessages,
    peerLastReadMessageTimestamp,
    createUpdatePeerLastReadMessageTimestamp,
    peerUser.username,
    unauthorizedErrorHandler,
    onUpdatePeerLastReadMessageTimestamp,
  ]);

  const messagesListAnchorRef = useRef();

  const messageFormRef = useRef();

  const handleUpdateSubmitState = (e) => {
    const value = e.target.value
    setSubmitDisabled(!value)
  };

  const handleSubmit = useCallback(event => {
    event.preventDefault();
    event.stopPropagation();

    const form = messageFormRef.current;
    if (form.checkValidity()) {
      onSendMessage(form.elements.message.value);
      form.elements.message.value = '';
      setSubmitDisabled(true);
    }
  }, [onSendMessage])

  const showLoadMore = !!(conversationMessages[peerUser.username] || {}).next;

  const onLoadMore = () => {
    setPreviousPageLastMessageTs(effectiveMessages.length > 0 ? effectiveMessages[0].timestamp : undefined);
    fetchConversationMessages({ peerId: peerUser.username, fetchNextPage: true }).catch(unauthorizedErrorHandler);
  };

  const handleMessageInputKeyDown = useCallback(e => {
    if (e.which === 13) {
      handleSubmit(e)
    }
  }, [handleSubmit])

  let loadMoreAnchorIndex = undefined;
  if (previousPageLastMessageTs) {
    const previousPageLastMessageIndex = effectiveMessages.findIndex(m => m.timestamp === previousPageLastMessageTs);
    if (previousPageLastMessageIndex > 0) loadMoreAnchorIndex = previousPageLastMessageIndex - 1;
  }

  const { formInputRef, inputFocused } = useFocusedInput();

  return (
    <div className="messages-components-conversation-messages">
      <div className="msg-list">
        {showLoadMore && <Row className="justify-content-center">
          <Button variant="link" onClick={onLoadMore}>Load older messages</Button>
        </Row>}
        {effectiveMessages.map((msg, index) => {
          const moreRowProps = {};
          if (loadMoreAnchorIndex && loadMoreAnchorIndex === index) {
            moreRowProps.ref = messagesListAnchorRef;
          }
          return (
            <Row key={index} className="msg-list-row" {...moreRowProps}>
              <Col>
                <UserAvatar user={msg.user} size='sm' />
                <div className="msg-detail">
                  <div className="user-info">
                    <h5 className="theme-text-primary">{msg.user.first_name} {msg.user.last_name}</h5>
                    <span className="theme-text-secondary">{dayjs(msg.timestamp).fromNow()}</span>
                  </div>
                  <div className={'msg-text ' + (msg.user.username !== peerUser.username ? 'mine' : 'card')}>
                    <p className="mb-0">{msg.text}</p>
                  </div>
                </div>
              </Col>
            </Row>
          );
        })}
        {!loadMoreAnchorIndex && <div className="msg-list-end-anchor" ref={messagesListAnchorRef} />}
      </div>
      <Form
        className={clsx("msg-form", { "focused-input": inputFocused })}
        noValidate
        onSubmit={handleSubmit}
        ref={messageFormRef}
      >
        <Form.Group className="flex-fill mrm-mr-0_75 mb-0" controlId="message">
          <Form.Control
            required
            maxRows={8}
            as={TextareaAutosize}
            onKeyDown={handleMessageInputKeyDown}
            onChange={handleUpdateSubmitState}
            placeholder="Message..."
            maxLength={4096}
            ref={formInputRef}
          />
        </Form.Group>
        <Button disabled={submitDisabled} variant="primary" type="submit">Send</Button>
      </Form>
    </div>
  );
};

ConversationMessages.propTypes = {};
ConversationMessages.defaultProps = {};
