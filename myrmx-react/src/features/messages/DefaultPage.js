import React, { useCallback, useEffect, useRef, useState, useContext, useMemo, Fragment } from 'react';
// import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import _filter from 'lodash/filter';
import _some from 'lodash/some';
import clsx from 'clsx';
import dayjs from 'dayjs';

import { Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMap, faEdit, faChevronLeft, faUsers } from '@fortawesome/pro-regular-svg-icons';
import TextareaAutosize from 'react-textarea-autosize';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { faCommentAltLines, faCheckCircle } from '@fortawesome/pro-duotone-svg-icons';
import { faTimesCircle, faTrash } from '@fortawesome/pro-solid-svg-icons';
import { faCircle } from '@fortawesome/pro-light-svg-icons';

import { DesktopHeader, Header, Loader, SearchBar, UserAvatar } from '../common';
import { useUnauthorizedErrorHandler } from '../../common/apiHelpers';
import { useSetUnreadMessages } from '../common/redux/hooks';
import { AgoraClientContext, AgoraGroupChatUpdatesChannelContext } from '../common/agoraHelpers';
import useTimeout from '../common/useTimeoutHook';

import { useFetchUser } from '../user/redux/hooks';
import {
  useCreatePeerToPeerMessage,
  useFetchConversations,
  useCreateGroupChat, useCreateGroupChatMessage,
  useCreateUpdateGroupLastReadMessageTimestamp,
  useCreateUpdatePeerLastReadMessageTimestamp, useDeleteGroupChatMessage, useDeletePeerToPeerMessage,
  useFetchConversationMessages,
  useFetchGroupChatMessages, useFetchGroupChats,
  useFetchRecipients, useEditGroupChat, useGetGroupChat
} from '../messages/redux/hooks';
import { useFetchNotifications } from '../notifications/redux/hooks';
import useFollowNotification from '../common/useFollowNotificationHook';
import useFocusedInput from '../common/useFocusedInputHook';

import Linkify from 'react-linkify';


const commentedOnNotificationVerb = 'COMMENTED';

function EmptyMessagesList () {
  return <div className="no-messages text-center mrm-mb-4">
    <FontAwesomeIcon icon={faCommentAltLines} size="4x" />
    <p className='theme-text'>No messages</p>
  </div>;
}

function SendMessageForm ({ onSendMessage }) {
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const messageFormRef = useRef();
  const { formInputRef, inputFocused } = useFocusedInput();

  const handleUpdateSubmitState = (e) => {
    const value = e.target.value
    setSubmitDisabled(!value)
  }

  const handleSubmit = useCallback(event => {
    event.preventDefault();
    event.stopPropagation();

    const form = messageFormRef.current;
    if (form.checkValidity()) {
      onSendMessage(form.elements.message.value);
      form.elements.message.value = '';
      setSubmitDisabled(true)
    }
  }, [onSendMessage])

  const handleMessageInputKeyDown = useCallback(e => {
    if (e.which === 13) {
      handleSubmit(e)
    }
  }, [handleSubmit])

  return (<Form
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
  </Form>);
}

function ConfirmDeleteMessageModal ({ show, onHide, onConfirm }) {
  return (<Modal
    centered
    show={show}
    onHide={onHide}
  >
    <Modal.Header>
      <Modal.Title className="w-100">
        <h1>Are you sure you want to delete this message?</h1>
      </Modal.Title>
    </Modal.Header>
    <Button variant="destructive" onClick={onConfirm}>Confirm</Button>
    <div className="border-thin" />
    <Button className="btn-menu-item" variant="" onClick={onHide}>Cancel</Button>
  </Modal>);
}

function P2pConversationMessages (props) {
  const {
    messages,
    onLeaveConversation,
    onSendMessage,
    onUpdatePeerLastReadMessageTimestamp,
    peerLastReadMessageTimestamp,
    peerUser,
    onMessageRemoval,
    setChildrenCallbacks,
  } = props;

  const [effectiveMessages, setEffectiveMessages] = useState([]);
  const [previousPageLastMessageTs, setPreviousPageLastMessageTs] = useState(undefined);
  const [messageToDeleteId, setMessageToDeleteId] = useState(null);

  const { createUpdatePeerLastReadMessageTimestamp } = useCreateUpdatePeerLastReadMessageTimestamp();
  const unauthorizedErrorHandler = useUnauthorizedErrorHandler();
  const { conversationMessages, fetchConversationMessages, overwriteConversationMessages } = useFetchConversationMessages();
  const { deletePeerToPeerMessage } = useDeletePeerToPeerMessage();

  useEffect(() => {
    fetchConversationMessages({ peerId: peerUser.username }).catch(unauthorizedErrorHandler);
  }, [fetchConversationMessages, peerUser.username, unauthorizedErrorHandler]);

  useEffect(() => {
    const oldestRecentMessageTimestamp = messages.length > 0 ? messages[0].timestamp : Number.MAX_SAFE_INTEGER;
    const updatedEms = [
      ...((conversationMessages[peerUser.username] || {}).messages || []).filter(m => m.timestamp < oldestRecentMessageTimestamp),
      ...messages,
    ];
    setEffectiveMessages(updatedEms);
  }, [messages, conversationMessages, peerUser.username]);

  useEffect(() => {
    if (messagesListAnchorRef.current) {
      messagesListAnchorRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [effectiveMessages]);

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

  const removeMessageCallback = useCallback((peerId, messageId) => {
    if (peerId !== peerUser.username) return;
    const peerMessages = (conversationMessages[peerUser.username] || {}).messages || [];
    const messageIndex = peerMessages.findIndex(m => m.id === messageId);
    if (messageIndex < 0) return;
    const updatedMessages = [...peerMessages];
    updatedMessages.splice(messageIndex, 1);
    overwriteConversationMessages(peerId, updatedMessages);
  }, [peerUser, conversationMessages, overwriteConversationMessages]);

  useEffect(() => setChildrenCallbacks(cbs => {
    const updatedCbs = Object.assign({}, cbs);
    updatedCbs.removeMessage = removeMessageCallback;
    return updatedCbs;
  }), [setChildrenCallbacks, removeMessageCallback]);

  const messagesListAnchorRef = useRef();

  const showLoadMore = !!(conversationMessages[peerUser.username] || {}).next;

  const onLoadMore = () => {
    setPreviousPageLastMessageTs(effectiveMessages.length > 0 ? effectiveMessages[0].timestamp : undefined);
    fetchConversationMessages({ peerId: peerUser.username, fetchNextPage: true }).catch(unauthorizedErrorHandler);
  };

  let loadMoreAnchorIndex = undefined;
  if (previousPageLastMessageTs) {
    const previousPageLastMessageIndex = effectiveMessages.findIndex(m => m.timestamp === previousPageLastMessageTs);
    if (previousPageLastMessageIndex > 0) loadMoreAnchorIndex = previousPageLastMessageIndex - 1;
  }

  const renderBackLink = useCallback(() => (
    <Button variant="link" onClick={onLeaveConversation}>
      <FontAwesomeIcon icon={faChevronLeft} />
    </Button>
  ), [onLeaveConversation]);

  const onDeleteMessageConfirm = useCallback(() => {
    const messageId = messageToDeleteId;
    setMessageToDeleteId(null);
    deletePeerToPeerMessage({ peerId: peerUser.username, messageId })
      .then(() => {
        let currentMessages = (conversationMessages[peerUser.username] || {}).messages || [];
        const messageIndex = currentMessages.findIndex(m => m.id === messageId);
        if (messageIndex >= 0) {
          const updatedMessages = [...currentMessages];
          updatedMessages.splice(messageIndex, 1);
          overwriteConversationMessages(peerUser.username, updatedMessages);
          currentMessages = updatedMessages;
        }
        onMessageRemoval(peerUser.username, messageId, currentMessages.length > 0 ? currentMessages[currentMessages.length - 1] : undefined);
      })
      .catch(unauthorizedErrorHandler);
  }, [
    messageToDeleteId,
    deletePeerToPeerMessage,
    peerUser.username,
    conversationMessages,
    overwriteConversationMessages,
    onMessageRemoval,
    unauthorizedErrorHandler,
  ]);

  return <>
    <Header
      border
      icon="back"
      title={`${peerUser.first_name} ${peerUser.last_name}`}
      renderBackLink={renderBackLink}
    />
    <Container className="msg-room">
      <div className="msg-list">
        {showLoadMore && <Row className="justify-content-center">
          <Button variant="link" onClick={onLoadMore}>Load older messages</Button>
        </Row>}
        {effectiveMessages.map((msg, index) => {
          const moreRowProps = {};
          if (loadMoreAnchorIndex && loadMoreAnchorIndex === index) {
            moreRowProps.ref = messagesListAnchorRef;
          }
          const currentUserMessage = msg.user.username !== peerUser.username;
          return (
            <div key={index} className="msg-list-row" {...moreRowProps}>
              <Col>
                <UserAvatar user={msg.user} size='sm' />
                <div className="msg-detail">
                  <div className="user-info">
                    <h5 className="theme-text-primary">{msg.user.first_name} {msg.user.last_name}</h5>
                    <span className="theme-text-secondary">{dayjs(msg.timestamp).fromNow()}</span>
                  </div>
                  <div className="d-flex">
                    <div className={'msg-text ' + (currentUserMessage ? 'mine' : 'card')}>
                      <Linkify componentDecorator={(decoratedHref, decoratedText, key) => (<a target="blank" href={decoratedHref} key={key}> {decoratedText} </a>)} >
                        <p className="mb-0">{msg.text}</p>
                      </Linkify>
                    </div>
                    {currentUserMessage && <Button className="delete-comment-message-icon" variant="" onClick={() => setMessageToDeleteId(msg.id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>}
                  </div>
                </div>
              </Col>
            </div>
          );
        })}
        {!loadMoreAnchorIndex && <div className="msg-list-end-anchor" ref={messagesListAnchorRef} />}
      </div>
      {!messageToDeleteId && <SendMessageForm onSendMessage={onSendMessage} />}
      <ConfirmDeleteMessageModal
        show={!!messageToDeleteId}
        onHide={() => setMessageToDeleteId(null)}
        onConfirm={onDeleteMessageConfirm}
      />
    </Container>
  </>;
}

function GroupConversationMessages (props) {
  const {
    chatInfo,
    currentUser,
    messages,
    onLeaveConversation,
    onSendMessage,
    onUpdateGroupLastReadMessageTimestamp,
    groupLastReadMessageTimestamp,
    onMessageRemoval,
    setChildrenCallbacks,
  } = props;

  const [effectiveMessages, setEffectiveMessages] = useState([]);
  const [previousPageLastMessageTs, setPreviousPageLastMessageTs] = useState(undefined);
  const [messageToDeleteId, setMessageToDeleteId] = useState(null);

  const { createUpdateGroupLastReadMessageTimestamp } = useCreateUpdateGroupLastReadMessageTimestamp();
  const unauthorizedErrorHandler = useUnauthorizedErrorHandler();
  const { groupChatMessages, fetchGroupChatMessages, overwriteGroupChatMessages } = useFetchGroupChatMessages();
  const { deleteGroupChatMessage } = useDeleteGroupChatMessage();

  useEffect(() => {
    fetchGroupChatMessages({ chatId: chatInfo.id }).catch(unauthorizedErrorHandler);
  }, [fetchGroupChatMessages, chatInfo.id, unauthorizedErrorHandler]);

  useEffect(() => {
    const oldestRecentMessageTimestamp = messages.length > 0 ? messages[0].timestamp : Number.MAX_SAFE_INTEGER;
    const updatedEms = [
      ...((groupChatMessages[chatInfo.id] || {}).messages || []).filter(m => m.timestamp < oldestRecentMessageTimestamp),
      ...messages,
    ];
    setEffectiveMessages(updatedEms);
  }, [messages, groupChatMessages, chatInfo]);

  useEffect(() => {
    if (messagesListAnchorRef.current) {
      messagesListAnchorRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [effectiveMessages]);

  useTimeout(() => setPreviousPageLastMessageTs(undefined), previousPageLastMessageTs ? 1000 : undefined);

  useEffect(() => {
    if (effectiveMessages.length === 0) return;
    const lastMessageTimestamp = effectiveMessages[effectiveMessages.length - 1].timestamp;
    if (lastMessageTimestamp <= groupLastReadMessageTimestamp) return;
    const args = { group_chat: chatInfo.id, timestamp: lastMessageTimestamp };
    createUpdateGroupLastReadMessageTimestamp(args)
      .catch(unauthorizedErrorHandler)
      .then(() => onUpdateGroupLastReadMessageTimestamp(args));
  }, [
    effectiveMessages,
    groupLastReadMessageTimestamp,
    createUpdateGroupLastReadMessageTimestamp,
    chatInfo.id,
    unauthorizedErrorHandler,
    onUpdateGroupLastReadMessageTimestamp,
  ]);

  const removeMessageCallback = useCallback((chatId, messageId) => {
    if (chatId !== chatInfo.id) return;
    const chatMessages = (groupChatMessages[chatInfo.id] || {}).messages || [];
    const messageIndex = chatMessages.findIndex(m => m.id === messageId);
    if (messageIndex < 0) return;
    const updatedMessages = [...chatMessages];
    updatedMessages.splice(messageIndex, 1);
    overwriteGroupChatMessages(chatId, updatedMessages);
  }, [chatInfo, groupChatMessages, overwriteGroupChatMessages]);

  useEffect(() => setChildrenCallbacks(cbs => {
    const updatedCbs = Object.assign({}, cbs);
    updatedCbs.removeMessage = removeMessageCallback;
    return updatedCbs;
  }), [setChildrenCallbacks, removeMessageCallback]);

  const messagesListAnchorRef = useRef();

  const showLoadMore = !!(groupChatMessages[chatInfo.id] || {}).next;

  const onLoadMore = () => {
    setPreviousPageLastMessageTs(effectiveMessages.length > 0 ? effectiveMessages[0].timestamp : undefined);
    fetchGroupChatMessages({ chatId: chatInfo.id, fetchNextPage: true }).catch(unauthorizedErrorHandler);
  };

  let loadMoreAnchorIndex = undefined;
  if (previousPageLastMessageTs) {
    const previousPageLastMessageIndex = effectiveMessages.findIndex(m => m.timestamp === previousPageLastMessageTs);
    if (previousPageLastMessageIndex > 0) loadMoreAnchorIndex = previousPageLastMessageIndex - 1;
  }

  const conversationTitle = chatInfo.name || chatInfo.participants.map(p => p.first_name).join(", ");

  const renderBackLink = useCallback(() => (
    <Button variant="link" onClick={onLeaveConversation}>
      <FontAwesomeIcon icon={faChevronLeft} />
    </Button>
  ), [onLeaveConversation]);

  const onDeleteMessageConfirm = useCallback(() => {
    const messageId = messageToDeleteId;
    setMessageToDeleteId(null);
    deleteGroupChatMessage({ chatId: chatInfo.id, messageId })
      .then(() => {
        let currentMessages = (groupChatMessages[chatInfo.id] || {}).messages || [];
        const messageIndex = currentMessages.findIndex(m => m.id === messageId);
        if (messageIndex >= 0) {
          const updatedMessages = [...currentMessages];
          updatedMessages.splice(messageIndex, 1);
          overwriteGroupChatMessages(chatInfo.id, updatedMessages);
          currentMessages = updatedMessages;
        }
        onMessageRemoval(chatInfo.id, messageId, currentMessages.length > 0 ? currentMessages[currentMessages.length - 1] : undefined);
      })
      .catch(unauthorizedErrorHandler);
  }, [
    messageToDeleteId,
    deleteGroupChatMessage,
    chatInfo.id,
    groupChatMessages,
    overwriteGroupChatMessages,
    onMessageRemoval,
    unauthorizedErrorHandler,
  ]);

  return <>
    <Header
      border
      icon="back"
      title={conversationTitle}
      renderBackLink={renderBackLink}
    />
    <Container className="msg-room">
      <div className="msg-list">
        {showLoadMore && <Row className="justify-content-center">
          <Button variant="link" onClick={onLoadMore}>Load older messages</Button>
        </Row>}
        {effectiveMessages.map((msg, index) => {
          const moreRowProps = {};
          if (loadMoreAnchorIndex && loadMoreAnchorIndex === index) {
            moreRowProps.ref = messagesListAnchorRef;
          }
          const currentUserMessage = msg.user.username === currentUser.username;
          return (
            <div key={index} className="msg-list-row" {...moreRowProps}>
              <Col>
                <UserAvatar user={msg.user} size='sm' />
                <div className="msg-detail">
                  <div className="user-info">
                    <h5 className="theme-text-primary">{msg.user.first_name} {msg.user.last_name}</h5>
                    <span className="theme-text-secondary">{dayjs(msg.timestamp).fromNow()}</span>
                  </div>
                  <div className="d-flex">
                    <div className={'msg-text ' + (currentUserMessage ? 'mine' : 'card')}>
                      <Linkify componentDecorator={(decoratedHref, decoratedText, key) => (<a target="blank" href={decoratedHref} key={key}> {decoratedText} </a>)} >
                        <p className="mb-0">{msg.text}</p>
                      </Linkify>
                    </div>
                    {currentUserMessage && <Button className="delete-comment-message-icon" variant="" onClick={() => setMessageToDeleteId(msg.id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>}
                  </div>
                </div>
              </Col>
            </div>
          );
        })}
        {!loadMoreAnchorIndex && <div className="msg-list-end-anchor" ref={messagesListAnchorRef} />}
      </div>
      {!messageToDeleteId && <SendMessageForm onSendMessage={onSendMessage} />}
      <ConfirmDeleteMessageModal
        show={!!messageToDeleteId}
        onHide={() => setMessageToDeleteId(null)}
        onConfirm={onDeleteMessageConfirm}
      />
    </Container>
  </>;
}

const newGroupFormSchema = yup.object().shape({
  groupName: yup.string()
})

function NewMessageModal (props) {
  const {
    loading,
    onCreateNewGroup,
    onHide,
    onP2pConversationSelect,
    onRecipientsSearch,
    recipients,
    recipientsSearchText,
    show,
  } = props;

  const [newGroupMessageStep, setNewGroupMessageStep] = useState(0);
  const [newGroupParticipants, setNewGroupParticipants] = useState([]);
  const { user } = useFetchUser();

  const recipientsSearchEnabled = typeof onRecipientsSearch === 'function';

  const modalTitle = useMemo(() => {
    switch (newGroupMessageStep) {
      case 0: return "New Message";
      case 1: return "Add Participants";
      case 2: return "New Group";
      default: return undefined;
    }
  }, [newGroupMessageStep]);

  const backButtonLabel = useMemo(() => {
    switch (newGroupMessageStep) {
      case 0: case 1: return "Cancel";
      case 2: return "Back";
      default: return undefined;
    }
  }, [newGroupMessageStep]);

  const backButtonOnClick = useCallback(() => {
    switch (newGroupMessageStep) {
      case 0: onHide(); break;
      case 1:
        setNewGroupParticipants([]);
        setNewGroupMessageStep(newGroupMessageStep - 1);
        break;
      case 2:
        setNewGroupMessageStep(newGroupMessageStep - 1);
        break;
      default: break;
    }
  }, [onHide, newGroupMessageStep]);

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(newGroupFormSchema)
  });

  const handleNewGroupCreation = useCallback(({ groupName }) => {
    onCreateNewGroup(newGroupParticipants, groupName);
  }, [newGroupParticipants, onCreateNewGroup]);

  const nextButtonLabel = useMemo(() => {
    switch (newGroupMessageStep) {
      case 0: return undefined;
      case 1: return "Next";
      case 2: return "Create";
      default: return undefined;
    }
  }, [newGroupMessageStep]);

  const nextButtonOnClick = useCallback(() => {
    switch (newGroupMessageStep) {
      case 0: case 1: setNewGroupMessageStep(newGroupMessageStep + 1); break;
      case 2: handleSubmit(handleNewGroupCreation)(); break;
      default: break;
    }
  }, [handleNewGroupCreation, handleSubmit, newGroupMessageStep]);

  const nextButtonDisabled = useMemo(() => {
    switch (newGroupMessageStep) {
      case 0: return false;
      case 1: case 2: return newGroupParticipants.length === 0;
      default: return undefined;
    }
  }, [newGroupMessageStep, newGroupParticipants]);

  const addParticipant = useCallback(p => () => {
    if (_some(newGroupParticipants, i => i.id === p.id)) return;
    setNewGroupParticipants([...newGroupParticipants, p]);
  }, [newGroupParticipants]);

  const removeParticipant = useCallback(p => () => {
    setNewGroupParticipants([..._filter(newGroupParticipants, i => i.id !== p.id)]);
  }, [newGroupParticipants]);

  const currentUserIsCoachOrAdmin = user && (user.groups.includes('Admin') || user.groups.includes('Coach'));

  return (<Modal
    centered
    dialogClassName="new-message-modal"
    show={show}
    onHide={onHide}
    className="modal-mobile-slide-from-bottom"
  >
    {loading && <Loader />}
    {!loading && <>
      <Modal.Header>
        <Modal.Title>
          {modalTitle}
          <Button className="cancel-btn" variant="link" onClick={backButtonOnClick}>{backButtonLabel}</Button>
          {!!nextButtonLabel && <Button
            disabled={nextButtonDisabled}
            className="next-btn"
            variant="link"
            onClick={nextButtonOnClick}
          >
            {nextButtonLabel}
          </Button>}
        </Modal.Title>
      </Modal.Header>
      {newGroupMessageStep !== 2 &&
        <div className="search-bar-container">
          {recipientsSearchEnabled && <SearchBar
            value={recipientsSearchText}
            onSearch={onRecipientsSearch}
          />}
        </div>
      }
      {newGroupMessageStep === 2 &&
        <Form className="border-bottom">
          <Form.Group controlId='groupName'>
            <Form.Control
              name='groupName'
              defaultValue={undefined}
              isInvalid={errors.title}
              ref={register}
              placeholder="Group Name (optional)"
            />
          </Form.Group>
        </Form>
      }
      {newGroupMessageStep !== 0 &&
        <div>
          <div className="selected-participants d-flex flex-row justify-content-start flex-wrap">
            {newGroupParticipants.map(p => (
              <>
                <div className="participant" key={p.id}>
                  <UserAvatar user={p} size='sm' />
                  <span className="participant-name">{p.first_name}</span>
                  <span className="participant-remove-btn" onClick={removeParticipant(p)}>
                    <FontAwesomeIcon icon={faTimesCircle} />
                  </span>
                </div>
              </>
            ))}
          </div>
        </div>
      }
      {newGroupMessageStep === 0 && currentUserIsCoachOrAdmin && <div className="group-message-link-container">
        <Button className="w-100 text-left" variant="link" onClick={nextButtonOnClick}>+ Group Message</Button>
      </div>}
      <Modal.Body>
        {recipients && <>
          {newGroupMessageStep === 0 && recipients.map(user => (
            <div key={user.id} className="user-row" onClick={() => {
              onP2pConversationSelect(user.username);
              onHide();
            }}>
              <UserAvatar user={user} size='sm' />
              <h5 className="user-name">
                {user.first_name} {user.last_name}
              </h5>
            </div>
          ))}
          {newGroupMessageStep !== 0 && <div className="group-participants">
            {newGroupMessageStep === 1 && recipients.map(user => {
              const recipientSelected = _some(newGroupParticipants, p => p.id === user.id);
              return (<Fragment key={user.id}>
                <div className="user-row" onClick={addParticipant(user)}>
                  <UserAvatar user={user} size='sm' />
                  <h5 className="user-name">
                    {user.first_name} {user.last_name}
                  </h5>
                  <FontAwesomeIcon
                    className={clsx({ 'selected': recipientSelected })}
                    icon={recipientSelected ? faCheckCircle : faCircle}
                  />
                </div>
              </Fragment>);
            })}
          </div>}
        </>}
      </Modal.Body>
    </>}
  </Modal>);
}

const editGroupFormSchema = yup.object().shape({
  groupName: yup.string()
})

function EditGroupModal (props) {
  const {
    loading,
    errorMessage,
    dismissEditGroupChatError,
    onEditGroup,
    onHide,
    onRecipientsSearch,
    groupChat,
    recipients,
    recipientsSearchText,
    show,
  } = props;

  const { participants } = groupChat
  const [editGroupMessageStep, setEditGroupMessageStep] = useState(1);
  const [editGroupParticipants, setEditGroupParticipants] = useState([]);


  useMemo(() => {
    if (participants) {
      console.log("participants passed:", participants)
      setEditGroupParticipants(participants)
    }
  }, [participants])

  useEffect(() => {
    dismissEditGroupChatError()
  }, [dismissEditGroupChatError, editGroupMessageStep])

  const recipientsSearchEnabled = typeof onRecipientsSearch === 'function';

  const modalTitle = useMemo(() => {
    switch (editGroupMessageStep) {
      case 1: return "Edit Participants";
      case 2: return "Edit Group Name";
      default: return undefined;
    }
  }, [editGroupMessageStep]);

  const backButtonLabel = useMemo(() => {
    switch (editGroupMessageStep) {
      case 1: return "Cancel";
      case 2: return "Back";
      default: return undefined;
    }
  }, [editGroupMessageStep]);

  const backButtonOnClick = useCallback(() => {
    switch (editGroupMessageStep) {
      case 1: onHide(); break;
      case 2:
        setEditGroupMessageStep(editGroupMessageStep - 1);
        break;
      default: break;
    }
  }, [onHide, editGroupMessageStep]);

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(editGroupFormSchema)
  });

  const handleEditGroup = useCallback(({ groupName }) => {
    onEditGroup(editGroupParticipants, groupName);
  }, [editGroupParticipants, onEditGroup]);

  const nextButtonLabel = useMemo(() => {
    switch (editGroupMessageStep) {
      case 1: return "Next";
      case 2: return "Save";
      default: return undefined;
    }
  }, [editGroupMessageStep]);

  const nextButtonOnClick = useCallback(() => {
    switch (editGroupMessageStep) {
      case 1: setEditGroupMessageStep(editGroupMessageStep + 1); break;
      case 2: handleSubmit(handleEditGroup)(); break;
      default: break;
    }
  }, [handleEditGroup, handleSubmit, editGroupMessageStep]);

  const nextButtonDisabled = useMemo(() => {
    switch (editGroupMessageStep) {
      case 1: case 2: return editGroupParticipants.length === 0;
      default: return undefined;
    }
  }, [editGroupMessageStep, editGroupParticipants]);

  const addParticipant = useCallback(p => () => {
    if (_some(editGroupParticipants, i => i.id === p.id)) return;
    setEditGroupParticipants([...editGroupParticipants, p]);
  }, [editGroupParticipants]);

  const removeParticipant = useCallback(p => () => {
    setEditGroupParticipants([..._filter(editGroupParticipants, i => i.id !== p.id)]);
  }, [editGroupParticipants]);

  return (<Modal
    centered
    dialogClassName="new-message-modal"
    show={show}
    onHide={onHide}
    className="modal-mobile-slide-from-bottom"
  >
    {loading && <Loader />}
    {!loading && <>
      <Modal.Header>
        <Modal.Title>
          {modalTitle}
          <Button className="cancel-btn" variant="link" onClick={backButtonOnClick}>{backButtonLabel}</Button>
          {!!nextButtonLabel && <Button
            disabled={nextButtonDisabled}
            className="next-btn"
            variant="link"
            onClick={nextButtonOnClick}
          >
            {nextButtonLabel}
          </Button>}
        </Modal.Title>
      </Modal.Header>
      {editGroupMessageStep !== 2 &&
        <div className="search-bar-container">
          {recipientsSearchEnabled && <SearchBar
            value={recipientsSearchText}
            onSearch={onRecipientsSearch}
          />}
        </div>
      }
      {editGroupMessageStep === 2 &&
        <Form className="border-bottom">
          <Form.Group controlId='groupName'>
            <Form.Control
              name='groupName'
              defaultValue={groupChat.name}
              isInvalid={errors.title}
              ref={register}
              placeholder="Group Name (optional)"
            />
          </Form.Group>
        </Form>
      }
      {editGroupMessageStep !== 0 &&
        <div>
          <div className="selected-participants d-flex flex-row justify-content-start flex-wrap">
            {editGroupParticipants.map(p => (
              <div className="participant" key={p.id}>
                <UserAvatar user={p} size='sm' />
                <span className="participant-name">{p.first_name}</span>
                <span className="participant-remove-btn" onClick={removeParticipant(p)}>
                  <FontAwesomeIcon icon={faTimesCircle} />
                </span>
              </div>
            ))}
          </div>
        </div>
      }
      <Modal.Body>
        {errorMessage &&
          <Alert variant="danger">{errorMessage}</Alert>
        }
        {recipients && <>

          {editGroupMessageStep !== 0 && <div className="group-participants">
            {editGroupMessageStep === 1 && recipients.map(user => {
              const recipientSelected = _some(editGroupParticipants, p => p.id === user.id);
              return (<Fragment key={user.id}>
                <div className="user-row" onClick={addParticipant(user)}>
                  <UserAvatar user={user} size='sm' />
                  <h5 className="user-name">
                    {user.first_name} {user.last_name}
                  </h5>
                  <FontAwesomeIcon
                    className={clsx({ 'selected': recipientSelected })}
                    icon={recipientSelected ? faCheckCircle : faCircle}
                  />
                </div>
              </Fragment>);
            })}
          </div>}
        </>}
      </Modal.Body>
    </>}
  </Modal>);
}
const conversationTypes = {
  p2p: 'p2p',
  group: 'group',
  comment: 'comment',
}

function getConversationTimestamp (convType, convData) {
  if (convType === conversationTypes.group) {
    return convData.last_message ? convData.last_message.timestamp : convData.created;
  }
  return convType === conversationTypes.p2p ? convData.timestamp : convData.unix_timestamp;
}

function ConversationsList (props) {
  const {
    commentsNotifications,
    createNewGroup,
    onConversationSelect,
    onMessageSearch,
    peerLastReadMessageTimestamps,
    peerMessages,
    recipients,
    usersInfo,
    messagesSearchText,
    onRecipientsSearch,
    recipientsSearchText,
    groupChats,
    groupChatMessages,
    groupLastReadMessageTimestamps,
  } = props;

  const [showRecipientModal, setShowRecipientModal] = useState(false);
  const [recipientModalLoading, setRecipientModalLoading] = useState(false);

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
    Object.entries(groupChats).map(([chatId, chatInfo]) => [conversationTypes.group, chatId, chatInfo]),
  );
  conversations.sort((a, b) => {
    const aTs = getConversationTimestamp(a[0], a[2]);
    const bTs = getConversationTimestamp(b[0], b[2]);
    return bTs - aTs;  // We'd like reverse chronological order
  });

  function hideRecipientModal () {
    setShowRecipientModal(false);
  }

  function onNewMessage () {
    setShowRecipientModal(true);
  }

  const renderNewMessageButton = () => (
    <div className="d-flex justify-content-center">
      <div className="new-msg-btn" onClick={() => onNewMessage()}>
        <FontAwesomeIcon icon={faEdit} />
      </div>
    </div>
  )

  return <>
    <Header
      title="Messages"
      border
      colSizes={[2, 8, 2]}
      renderThirdColumn={renderNewMessageButton}
    >
      <div className="mb-2" />
      <SearchBar
        value={messagesSearchText}
        onSearch={onMessageSearch}
      />
    </Header>
    <Container>
      {conversations.map(([convType, peerIdOrChatId, data]) => {
        if (convType !== conversationTypes.group && !usersInfo[peerIdOrChatId]) return null;

        let hasUnreadMessages = false;
        let conversationIcon;
        let conversationTitle;
        let timestamp;
        let formattedMessage;
        let itemKey;

        if (convType === conversationTypes.p2p) {
          const user = usersInfo[peerIdOrChatId];
          const userMessages = peerMessages[peerIdOrChatId].filter(m => m.user.username === user.username);
          if (userMessages.length > 0) {
            if (peerIdOrChatId in peerLastReadMessageTimestamps) {
              const lastReadTimestamp = peerLastReadMessageTimestamps[peerIdOrChatId];
              hasUnreadMessages = userMessages.filter(m => m.timestamp > lastReadTimestamp).length > 0;
            }
            else {
              hasUnreadMessages = true;
            }
          }
          conversationTitle = `${user.first_name} ${user.last_name}`;
          conversationIcon = <UserAvatar user={user} className="conversation-avatar" />;
          timestamp = data.timestamp;
          const effectiveText = data.text.length > 90 ? `${data.text.substring(0, 90)}…` : data.text;
          formattedMessage = <p className="last-msg theme-text-secondary">{effectiveText}</p>;
          itemKey = `${convType}-${peerIdOrChatId}`;
        } else if (convType === conversationTypes.comment) {
          hasUnreadMessages = !data.read;
          const user = usersInfo[peerIdOrChatId];
          conversationTitle = `${user.first_name} ${user.last_name}`;
          conversationIcon = (<UserAvatar user={user} className="conversation-avatar">
            <span className="message-roadmap-icon">
              <FontAwesomeIcon icon={faMap} className="text-white" size='xs' />
            </span>
          </UserAvatar>);
          timestamp = data.unix_timestamp;
          const competency = data.target.competency;
          formattedMessage = <p className="last-msg theme-text-secondary">
            New comment on <strong>{competency.stage_title} - {competency.title}</strong>
          </p>;
          itemKey = `${convType}-${data.target_object_id}`;
        } else if (convType === conversationTypes.group) {
          const chatMessages = groupChatMessages[peerIdOrChatId] || [];
          if (chatMessages.length > 0) {
            if (peerIdOrChatId in groupLastReadMessageTimestamps) {
              const lastReadTimestamp = groupLastReadMessageTimestamps[peerIdOrChatId];
              hasUnreadMessages = chatMessages.filter(m => m.timestamp > lastReadTimestamp).length > 0;
            }
            else {
              hasUnreadMessages = true;
            }
          }
          conversationTitle = data.name || data.participants.map(p => p.first_name).join(", ");
          conversationIcon = (<div className="conversation-avatar">
            <span className="message-group-icon">
              <FontAwesomeIcon icon={faUsers} className="text-white" size='1x' />
            </span>
          </div>);
          timestamp = data.last_message ? data.last_message.timestamp : data.created;
          const effectiveText = data.last_message
            ? (data.last_message.text.length > 90 ? `${data.last_message.text.substring(0, 90)}…` : data.last_message.text)
            : "No messages yet";
          formattedMessage = <p className="last-msg theme-text-secondary">{effectiveText}</p>;
          itemKey = `${convType}-${peerIdOrChatId}`;
        } else {
          // Unexpected/unsupported conversation type
          return null;
        }

        return (<div
          key={itemKey}
          className='chat-list-row d-flex'
          onClick={() => onConversationSelect(convType, peerIdOrChatId, data)}
        >
          {hasUnreadMessages && <span className="dot float-left" />}
          {conversationIcon}
          <Col className="chat-list-item">
            <div className="chat-info">
              <h5 className="theme-text-primary">{conversationTitle}</h5>
              <span className="theme-text-secondary">{dayjs(timestamp).fromNow()}</span>
            </div>
            {formattedMessage}
          </Col>
        </div>
        );
      })}
    </Container>
    <NewMessageModal
      loading={recipientModalLoading}
      onCreateNewGroup={(participants, groupName) => {
        setRecipientModalLoading(true);
        createNewGroup(participants, groupName).then(() => {
          setRecipientModalLoading(false);
          hideRecipientModal();
        });
      }}
      onHide={hideRecipientModal}
      onP2pConversationSelect={(username) => onConversationSelect(conversationTypes.p2p, username)}
      onRecipientsSearch={onRecipientsSearch}
      recipients={recipients}
      recipientsSearchText={recipientsSearchText}
      show={showRecipientModal}
    />
    {conversations.length === 0 && <EmptyMessagesList />}
  </>;
}

function updatePeerMessages (pms, peerId, message) {
  const updatedPms = Object.assign({}, pms);
  updatedPms[peerId] = [...(peerId in updatedPms ? updatedPms[peerId] : []), message];
  return updatedPms;
}

function updateGroupChatMessages (gcms, chatId, message) {
  const updatedGcms = Object.assign({}, gcms);
  updatedGcms[chatId] = [...(chatId in updatedGcms ? updatedGcms[chatId] : []), message];
  return updatedGcms;
}

function updateGroupChatsWithLastMessage (gcs, chatId, lastMessage) {
  if (!(chatId in gcs)) return gcs;
  const updatedGcs = Object.assign({}, gcs);
  updatedGcs[chatId] = Object.assign({}, gcs[chatId], { last_message: lastMessage });
  return updatedGcs;
}

function removeGroupChatMessage (gcms, chatId, messageId) {
  const removedMessageIndex = (gcms[chatId] || []).findIndex(m => m.id === messageId);
  if (removedMessageIndex < 0) return gcms;
  const updatedGcms = Object.assign({}, gcms);
  const chatMessages = [...gcms[chatId]];
  chatMessages.splice(removedMessageIndex, 1);
  updatedGcms[chatId] = chatMessages;
  return updatedGcms;
}

// TODO: Split this code file into separate components when it'll be feasible
// It's likely that the most appropriate time will be after desktop version will be ready
export default function DefaultPage () {
  const [usersInfo, setUsersInfo] = useState({});
  const [peerMessages, setPeerMessages] = useState({});
  const [peerLastReadMessageTimestamps, setPeerLastReadMessageTimestamps] = useState({});
  const [selectedConversation, setSelectedConversation] = useState(undefined);
  const [messagesSearchText, setMessagesSearchText] = useState('');
  const [recipientsSearchText, setRecipientsSearchText] = useState('');
  const [recipientsTotalCount, setRecipientsTotalCount] = useState(0);
  const [groupChatsInfo, setGroupChatsInfo] = useState({});
  const [groupChatMessages, setGroupChatMessages] = useState({});
  const [groupLastReadMessageTimestamps, setGroupLastReadMessageTimestamps] = useState({});
  const [childrenCallbacks, setChildrenCallbacks] = useState({});

  const { unreadMessagesCount, setUnreadMessages } = useSetUnreadMessages();
  const { user } = useFetchUser();
  const { recipients, fetchRecipients } = useFetchRecipients();
  const unauthorizedErrorHandler = useUnauthorizedErrorHandler();
  const { createPeerToPeerMessage } = useCreatePeerToPeerMessage();
  const { conversations, fetchConversations } = useFetchConversations();
  const { notifications, fetchNotifications } = useFetchNotifications();
  const followNotification = useFollowNotification();
  const { groupChats, fetchGroupChats } = useFetchGroupChats();
  const { createGroupChat } = useCreateGroupChat();
  const { editGroupChat, editGroupChatPending, editGroupChatError, dismissEditGroupChatError } = useEditGroupChat();
  const { getGroupChat } = useGetGroupChat();
  const { createGroupChatMessage } = useCreateGroupChatMessage();

  const [selectedGroupChat, setSelectedGroupChat] = useState([])
  useEffect(() => {
    if (!user) return;
    fetchRecipients().catch(unauthorizedErrorHandler).then(res => setRecipientsTotalCount(res.data.count));
    fetchNotifications({ verb: commentedOnNotificationVerb }).catch(unauthorizedErrorHandler);
  }, [
    user,
    fetchRecipients,
    fetchNotifications,
    unauthorizedErrorHandler,
  ]);

  useEffect(() => {
    fetchConversations({ page: 0, search: '' });
    fetchGroupChats({ page: 0, search: '' });
  }, [fetchConversations, fetchGroupChats]);

  useEffect(() => {
    if (!recipients) return;
    setUsersInfo(ui => {
      const updatedUi = Object.assign({}, ui);
      recipients.forEach(r => {
        updatedUi[r.username] = r;
      });
      return updatedUi;
    });
  }, [recipients]);

  useEffect(() => {
    if (!notifications) return;
    setUsersInfo(ui => {
      const updatedUi = Object.assign({}, ui);
      notifications.results.filter(n => n.verb === commentedOnNotificationVerb && !!n.sender).forEach(n => {
        updatedUi[n.sender.username] = n.sender;
      });
      return updatedUi;
    });
  }, [notifications]);

  useEffect(() => {
    if (!user || !conversations) {
      return
    }

    setUsersInfo(ui => {
      const updatedUi = Object.assign({}, ui);
      conversations.results.forEach(c => {
        updatedUi[c.receiver.username] = c.receiver;
        updatedUi[c.sender.username] = c.sender;
      });
      return updatedUi;
    });
    setPeerMessages(() => {
      const updatedPms = {};
      conversations.results.forEach(c => {
        const peerId = (c.sender.username === user.username ? c.receiver : c.sender).username;
        const message = Object.assign({}, { id: c.message_id, text: c.text, timestamp: c.timestamp });
        message.user = c.sender;
        updatedPms[peerId] = [message];
      });
      return updatedPms;
    });
    setPeerLastReadMessageTimestamps(plrms => {
      const updatedPlrms = Object.assign({}, plrms);
      conversations.results.filter(c => !!c.last_read_msg_timestamp).forEach(c => {
        const peerId = (c.sender.username === user.username ? c.receiver : c.sender).username;
        updatedPlrms[peerId] = c.last_read_msg_timestamp;
      });
      return updatedPlrms;
    });
  }, [user, conversations]);

  useEffect(() => {
    if (!groupChats) return;

    setGroupChatsInfo(() => {
      const updatedGcs = {};
      groupChats.results.forEach(gc => updatedGcs[gc.id] = gc);
      return updatedGcs;
    });
    setGroupChatMessages(() => {
      const updatedGcms = {};
      groupChats.results.filter(c => !!c.last_message).forEach(c => {
        updatedGcms[c.id] = [c.last_message];
      });
      return updatedGcms;
    });
    setGroupLastReadMessageTimestamps(glrms => {
      const updatedGlrms = Object.assign({}, glrms);
      groupChats.results.filter(c => !!c.last_read_msg_timestamp).forEach(c => {
        updatedGlrms[c.id] = c.last_read_msg_timestamp;
      });
      return updatedGlrms;
    });
  }, [groupChats]);

  const debouncedMessagesSearch = useCallback(
    debounce(q => {
      // resetMessagesPage();
      setSelectedConversation(undefined);
      fetchConversations({ search: q, page: 0 });
      fetchGroupChats({ search: q, page: 0 });
    }, 500),
    [fetchConversations, fetchGroupChats]
  );

  const onMessageSearch = useCallback(e => {
    setMessagesSearchText(e.target.value);
    debouncedMessagesSearch(e.target.value);
  }, [debouncedMessagesSearch]);

  const debouncedRecipientsSearch = useCallback(
    debounce(q => fetchRecipients({ search: q }), 500),
    [fetchRecipients],
  );

  const onRecipientsSearch = useCallback(e => {
    setRecipientsSearchText(e.target.value);
    debouncedRecipientsSearch(e.target.value);
  }, [debouncedRecipientsSearch]);

  const peerMessageHandler = useCallback(({ text }, peerId) => {
    const jsonMessage = JSON.parse(text);
    if (jsonMessage.action === 'new-message') {
      setUsersInfo(ui => {
        const updatedUi = Object.assign({}, ui);
        updatedUi[peerId] = jsonMessage.user;
        return updatedUi;
      });
      setPeerMessages(pms => updatePeerMessages(pms, peerId, jsonMessage));
    } else if (jsonMessage.action === 'message-removed') {
      if (!(peerId in peerMessages)) return;
      let refetchConversations = false;
      setPeerMessages(pms => {
        const removedMessageIndex = pms[peerId].findIndex(m => m.id === jsonMessage.messageId);
        if (removedMessageIndex < 0) return pms;
        const updatedPms = Object.assign({}, pms);
        const peerMessages = [...pms[peerId]];
        peerMessages.splice(removedMessageIndex, 1);
        if (peerMessages.length === 0) {
          delete updatedPms[peerId];
          refetchConversations = true;
        } else {
          updatedPms[peerId] = peerMessages;
        }
        return updatedPms;
      });
      if (refetchConversations) fetchConversations({ search: messagesSearchText, page: 0 });
      if (typeof childrenCallbacks.removeMessage === "function") {
        childrenCallbacks.removeMessage(peerId, jsonMessage.messageId);
      }
    }
  }, [
    peerMessages,
    fetchConversations,
    messagesSearchText,
    childrenCallbacks,
  ]);

  const agoraClient = useContext(AgoraClientContext);
  const agoraGroupChatUpdatesChannel = useContext(AgoraGroupChatUpdatesChannelContext);

  const groupChatUpdatesChannelMessageHandler = useCallback(function ({ text }) {
    const jsonUpdate = JSON.parse(text);
    if (jsonUpdate.action === "new-group-chat") {
      // Current user isn't a participant of the new chat, ignore it
      if (!_some(jsonUpdate.participants, p => p.id === user.id)) return;
      setGroupChatsInfo(gcs => {
        const updatedGcs = Object.assign({}, gcs);
        updatedGcs[jsonUpdate.chatId] = jsonUpdate;
        return updatedGcs;
      });
    } else if (jsonUpdate.action === "new-message-in-group-chat") {
      // Current user isn't a participant of the chat new message was sent to, ignore it
      if (Object.keys(groupChatsInfo).indexOf(jsonUpdate.chatId.toString()) < 0) return;
      setGroupChatMessages(gcms => updateGroupChatMessages(gcms, jsonUpdate.chatId, jsonUpdate.message));
      setGroupChatsInfo(gcs => updateGroupChatsWithLastMessage(gcs, jsonUpdate.chatId, jsonUpdate.message));
    } else if (jsonUpdate.action === "message-removed-from-group-chat") {
      // Current user isn't a participant of the chat new message was sent to, ignore it
      if (Object.keys(groupChatsInfo).indexOf(jsonUpdate.chatId.toString()) < 0) return;
      let chatMessages;
      setGroupChatMessages(gcms => {
        const updatedGcms = removeGroupChatMessage(gcms, jsonUpdate.chatId, jsonUpdate.messageId);
        chatMessages = updatedGcms[jsonUpdate.chatId] || [];
        return updatedGcms;
      });
      if (groupChatsInfo[jsonUpdate.chatId]?.last_message?.id === jsonUpdate.messageId) {
        let newLastMessage;
        let refetchGroupChats = false;
        if (chatMessages.length > 0) {
          newLastMessage = chatMessages[chatMessages.length - 1];
        } else {
          newLastMessage = undefined;
          refetchGroupChats = true;
        }
        setGroupChatsInfo(gcs => updateGroupChatsWithLastMessage(gcs, jsonUpdate.chatId, newLastMessage));
        if (refetchGroupChats) fetchGroupChats({ search: messagesSearchText, page: 0 });
      }
      if (typeof childrenCallbacks.removeMessage === "function") {
        childrenCallbacks.removeMessage(jsonUpdate.chatId, jsonUpdate.messageId);
      }
    }
  }, [user, groupChatsInfo, fetchGroupChats, messagesSearchText, childrenCallbacks]);

  useEffect(() => {
    if (!agoraClient) return;
    agoraClient.on('MessageFromPeer', peerMessageHandler);
    return () => agoraClient.off('MessageFromPeer', peerMessageHandler);
  }, [agoraClient, peerMessageHandler]);

  useEffect(() => {
    if (!agoraGroupChatUpdatesChannel) return;
    agoraGroupChatUpdatesChannel.on('ChannelMessage', groupChatUpdatesChannelMessageHandler);
    return () => agoraGroupChatUpdatesChannel.off('ChannelMessage', groupChatUpdatesChannelMessageHandler);
  }, [agoraGroupChatUpdatesChannel, groupChatUpdatesChannelMessageHandler]);

  useEffect(() => {
    if (!user || !agoraClient) return;
    const unreadPeerMessages = Object.entries(peerMessages).map(([peerId, msgList]) => {
      const lastReadTimestamp = peerLastReadMessageTimestamps[peerId] || 0;
      const unreadPeerMessages = (msgList || []).filter(m => m.user.username === peerId).filter(m => m.timestamp > lastReadTimestamp);
      return unreadPeerMessages.length;
    }).reduce((sum, v) => sum + v, 0);
    const unreadGroupChatMessages = Object.entries(groupChatMessages).map(([chatId, msgList]) => {
      const lastReadTimestamp = groupLastReadMessageTimestamps[chatId] || 0;
      const unreadChatMessages = (msgList || []).filter(m => m.timestamp > lastReadTimestamp);
      return unreadChatMessages.length;
    }).reduce((sum, v) => sum + v, 0);
    let unreadCommentNotifications = 0;
    if (notifications) {
      unreadCommentNotifications = notifications.results.filter(n => n.verb === commentedOnNotificationVerb && !n.read).length;
    }
    setUnreadMessages(unreadPeerMessages + unreadGroupChatMessages + unreadCommentNotifications);
  }, [
    user,
    agoraClient,
    peerMessages,
    peerLastReadMessageTimestamps,
    groupChatMessages,
    groupLastReadMessageTimestamps,
    notifications,
    setUnreadMessages,
  ]);

  const onUpdatePeerLastReadMessageTimestamp = useCallback(({ peer_id, timestamp }) => {
    setPeerLastReadMessageTimestamps(plrms => {
      const updatedPlrms = Object.assign({}, plrms);
      updatedPlrms[peer_id] = timestamp;
      return updatedPlrms;
    });
  }, []);

  const onUpdateGroupLastReadMessageTimestamp = useCallback(({ group_chat, timestamp }) => {
    setGroupLastReadMessageTimestamps(glrms => {
      const updatedGlrms = Object.assign({}, glrms);
      updatedGlrms[group_chat] = timestamp;
      return updatedGlrms;
    });
  }, []);

  const createNewGroup = useCallback((participants, groupName) => {
    return createGroupChat({
      name: groupName,
      created: dayjs().valueOf(),
      participants: [...participants.map(p => p.id), user.id],
    }).then(newChat => {
      setGroupChatsInfo(gcs => Object.assign({}, gcs, { [newChat.id]: newChat }));
      if (!agoraGroupChatUpdatesChannel) return;
      const message = {
        text: JSON.stringify({
          action: 'new-group-chat',
          name: newChat.groupName,
          participants: newChat.participants,
          id: newChat.id,
          created: newChat.created,
        }),
      };
      agoraGroupChatUpdatesChannel.sendMessage(message);
    });
  }, [createGroupChat, user, agoraGroupChatUpdatesChannel]);

  const editGroup = useCallback((participants, groupName) => {
    return editGroupChat({
      id: selectedGroupChat.id,
      name: groupName,
      participants: [...participants.map(p => p.id), user.id],
    }).then(editChat => {

      setGroupChatsInfo(gcs => Object.assign({}, gcs, { [editChat.id]: editChat }));
      if (!agoraGroupChatUpdatesChannel) return;
      const message = {
        text: JSON.stringify({
          action: 'edit-group-chat',
          name: editChat.groupName,
          participants: editChat.participants,
          id: editChat.id,
          created: editChat.created,
        }),
      };
      agoraGroupChatUpdatesChannel.sendMessage(message);
      setSelectedGroupChat(editChat)
      setShowEditGroupModal(false)
    })
  }, [selectedGroupChat.id, editGroupChat, user, agoraGroupChatUpdatesChannel]);

  const onP2pMessageRemoval = useCallback((peerId, messageId, messageBeforeRemoved) => {
    setPeerMessages(pms => {
      const removedMessageIndex = (pms[peerId] || []).findIndex(m => m.id === messageId);
      if (removedMessageIndex < 0) return pms;
      const updatedPms = Object.assign({}, pms);
      const peerMessages = [...pms[peerId]];
      peerMessages.splice(removedMessageIndex, 1);
      if (peerMessages.length === 0) {
        if (messageBeforeRemoved) {
          peerMessages.push(messageBeforeRemoved);
          updatedPms[peerId] = peerMessages;
        }
        else {
          delete updatedPms[peerId];
        }
      } else {
        updatedPms[peerId] = peerMessages;
      }
      return updatedPms;
    });
    const realTimeUpdate = {
      action: 'message-removed',
      messageId,
    }
    agoraClient.sendMessageToPeer(
      { text: JSON.stringify(realTimeUpdate) }, // An RtmMessage object.
      peerId, // The user ID of the remote user.
    ).then(sendResult => {
      if (sendResult.hasPeerReceived) {
        /* Your code for handling the event that the remote user receives the message. */
      } else {
        /* Your code for handling the event that the message is received by the server but the remote user cannot be reached. */
      }
    }).catch(() => {
      /* Your code for handling the event of a message send failure. */
    });
  }, [agoraClient]);

  const onGroupChatMessageRemoval = useCallback((chatId, messageId, messageBeforeRemoved) => {
    let chatMessages;
    setGroupChatMessages(gcms => {
      const updatedGcms = removeGroupChatMessage(gcms, chatId, messageId);
      chatMessages = updatedGcms[chatId] || [];
      return updatedGcms;
    });
    if (chatId in groupChatsInfo && groupChatsInfo[chatId]?.last_message?.id === messageId) {
      let newLastMessage;
      if (chatMessages.length > 0) {
        newLastMessage = chatMessages[chatMessages.length - 1];
      } else if (messageBeforeRemoved) {
        newLastMessage = messageBeforeRemoved;
      } else {
        newLastMessage = undefined;
      }
      setGroupChatsInfo(gcs => updateGroupChatsWithLastMessage(gcs, chatId, newLastMessage));
    }
    const agoraMessage = {
      text: JSON.stringify({
        action: 'message-removed-from-group-chat',
        chatId,
        messageId,
      }),
    };
    agoraGroupChatUpdatesChannel.sendMessage(agoraMessage);
  }, [groupChatsInfo, agoraGroupChatUpdatesChannel]);

  const [showRecipientModal, setShowRecipientModal] = useState(false);
  const [recipientModalLoading, setRecipientModalLoading] = useState(false);

  const [showEditGroupModal, setShowEditGroupModal] = useState(false);

  function setSelectedChatId() {} 

  useEffect(() => window.scrollTo(0, 0), []);

  if (!user || !agoraClient || !conversations || !agoraGroupChatUpdatesChannel) {
    return <Loader />
  }

  function onConversationSelect (convType, peerIdOrChatId, data) {
    if (convType === conversationTypes.p2p) {
      setSelectedConversation({
        type: conversationTypes.p2p,
        peerId: peerIdOrChatId,
      });
    } else if (convType === conversationTypes.group) {
      setSelectedConversation({
        type: conversationTypes.group,
        chatId: peerIdOrChatId,
      });
      getGroupChat({ chatId: peerIdOrChatId }).then(res => {
        console.log("res.data:", res.data)
        setSelectedGroupChat(res)
      })
    } else if (convType === conversationTypes.comment) {
      if (!data.read) setUnreadMessages(unreadMessagesCount - 1);
      followNotification(data);
    } else {
      console.warn(`Unsupported/unexpected conversation type: ${convType}`);
    }
  }

  function onSendPeerMessage (message) {
    const peerId = selectedConversation.peerId;
    createPeerToPeerMessage({
      receiver_username: peerId,
      timestamp: Date.now(),
      text: message,
    }).then(newMsg => {
      const jsonMessagePayload = {
        action: 'new-message',
        user: newMsg.sender,
        timestamp: newMsg.timestamp,
        text: newMsg.text,
        id: newMsg.message_id,
      };
      setPeerMessages(pms => updatePeerMessages(pms, peerId, jsonMessagePayload));
      agoraClient.sendMessageToPeer(
        { text: JSON.stringify(jsonMessagePayload) }, // An RtmMessage object.
        peerId, // The user ID of the remote user.
      ).then(sendResult => {
        if (sendResult.hasPeerReceived) {
          /* Your code for handling the event that the remote user receives the message. */
        } else {
          /* Your code for handling the event that the message is received by the server but the remote user cannot be reached. */
        }
      }).catch(() => {
        /* Your code for handling the event of a message send failure. */
      });
    }).catch(unauthorizedErrorHandler);
  }

  function onSendGroupMessage (message) {
    const chatId = selectedConversation.chatId;
    createGroupChatMessage({
      chatId,
      timestamp: Date.now(),
      text: message,
    }).then(newMsg => {
      const jsonMessagePayload = {
        user: newMsg.user,
        timestamp: newMsg.timestamp,
        text: newMsg.text,
        id: newMsg.id,
      };
      setGroupChatMessages(gcms => updateGroupChatMessages(gcms, chatId, jsonMessagePayload));
      setGroupChatsInfo(gcs => updateGroupChatsWithLastMessage(gcs, chatId, jsonMessagePayload));
      const agoraMessage = {
        text: JSON.stringify({
          action: 'new-message-in-group-chat',
          chatId: Number(chatId),
          message: jsonMessagePayload,
        }),
      };
      agoraGroupChatUpdatesChannel.sendMessage(agoraMessage);
    }).catch(unauthorizedErrorHandler);
  }

  function hideRecipientModal () {
    setShowRecipientModal(false);
  }

  function onNewMessage () {
    setShowRecipientModal(true);
  }

  function openGroupModal (chatId) {
    setSelectedChatId(chatId)
    setShowEditGroupModal(true);
  }

  function hideEditGroupModal () {
    setShowEditGroupModal(false);
  }

  const peerUser = selectedConversation ? usersInfo[selectedConversation.peerId] : undefined;

  function leaveConversation () {
    setSelectedConversation(undefined);
    setChildrenCallbacks({});
  }

  let contentComponent;
  if (!selectedConversation) {
    contentComponent = (<ConversationsList
      commentsNotifications={notifications}
      createNewGroup={createNewGroup}
      editGroup={editGroup}
      onConversationSelect={onConversationSelect}
      onMessageSearch={onMessageSearch}
      peerLastReadMessageTimestamps={peerLastReadMessageTimestamps}
      peerMessages={peerMessages}
      recipients={recipients}
      usersInfo={usersInfo}
      messagesSearchText={messagesSearchText}
      onRecipientsSearch={recipientsTotalCount < 7 ? undefined : onRecipientsSearch}
      recipientsSearchText={recipientsSearchText}
      groupChats={groupChatsInfo}
      groupChatMessages={groupChatMessages}
      groupLastReadMessageTimestamps={groupLastReadMessageTimestamps}
    />);
  } else if (selectedConversation.type === conversationTypes.p2p) {
    contentComponent = (<P2pConversationMessages
      messages={peerMessages[selectedConversation.peerId] || []}
      onLeaveConversation={leaveConversation}
      onSendMessage={onSendPeerMessage}
      onUpdatePeerLastReadMessageTimestamp={onUpdatePeerLastReadMessageTimestamp}
      peerUser={usersInfo[selectedConversation.peerId]}
      peerLastReadMessageTimestamp={peerLastReadMessageTimestamps[selectedConversation.peerId] || 0}
      onMessageRemoval={onP2pMessageRemoval}
      setChildrenCallbacks={setChildrenCallbacks}
    />);
  } else if (selectedConversation.type === conversationTypes.group) {
    contentComponent = (<GroupConversationMessages
      chatInfo={groupChatsInfo[selectedConversation.chatId]}
      currentUser={user}
      messages={groupChatMessages[selectedConversation.chatId] || []}
      onLeaveConversation={leaveConversation}
      onSendMessage={onSendGroupMessage}
      onUpdateGroupLastReadMessageTimestamp={onUpdateGroupLastReadMessageTimestamp}
      groupLastReadMessageTimestamp={groupLastReadMessageTimestamps[selectedConversation.chatId] || 0}
      onMessageRemoval={onGroupChatMessageRemoval}
      setChildrenCallbacks={setChildrenCallbacks}
    />);
  } else {
    // Unexpected/unsupported conversation type
    contentComponent = null;
  }

  const currentUserIsCoachOrAdmin = user && (user.groups.includes('Admin') || user.groups.includes('Coach'));

  return (
    <div className="messages-default-page">
      <div className="mobile-page-wrapper d-lg-none">
        {contentComponent}
      </div>
      <div className="d-none d-lg-block">
        <DesktopHeader />
        <Container>
          <div className="desktop-page-container">
            <Row noGutters>
              <Col lg={4} className="conversations-list-wrapper">
                <div className="conversations-list-header">
                  <Button className="float-right new-msg-btn" variant="link" onClick={() => onNewMessage()}>
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                  <h2>Messages</h2>
                </div>
                <hr />
                <SearchBar
                  value={messagesSearchText}
                  onSearch={onMessageSearch}
                />
                <ConversationsList
                  commentsNotifications={notifications}
                  createNewGroup={createNewGroup}
                  onConversationSelect={onConversationSelect}
                  onMessageSearch={onMessageSearch}
                  peerLastReadMessageTimestamps={peerLastReadMessageTimestamps}
                  peerMessages={peerMessages}
                  recipients={recipients}
                  usersInfo={usersInfo}
                  messagesSearchText={messagesSearchText}
                  onRecipientsSearch={recipientsTotalCount < 7 ? undefined : onRecipientsSearch}
                  recipientsSearchText={recipientsSearchText}
                  groupChats={groupChatsInfo}
                  groupChatMessages={groupChatMessages}
                  groupLastReadMessageTimestamps={groupLastReadMessageTimestamps}
                  selectedPeerIdOrChatId={selectedConversation && selectedConversation.peerIdOrChatId}
                />
              </Col>
              <Col lg={8} className="conversation-messages-wrapper">
                <div className="conversation-messages-header">
                  {selectedConversation ? (
                    <>
                      {selectedConversation.type === conversationTypes.p2p &&
                        <>
                          <UserAvatar user={peerUser} size='sm' />
                          <h3>{`${peerUser.first_name} ${peerUser.last_name}`}</h3>
                        </>
                      }
                      {selectedConversation.type === conversationTypes.group &&
                        <>
                            <div className="chat-list-row mt-n3">
                              <div className="conversation-avatar">
                                <span className="message-group-icon">
                                  <FontAwesomeIcon icon={faUsers} className="text-white" size='1x' />
                                </span>
                              </div>
                            </div>
                          <h3>{groupChatsInfo[selectedConversation.chatId].name ? groupChatsInfo[selectedConversation.chatId].name : "Group Chat"}</h3>
                          {currentUserIsCoachOrAdmin &&
                            <Button className="float-right new-msg-btn" variant="link" onClick={() => openGroupModal(selectedConversation.chatId)}>
                              <FontAwesomeIcon icon={faEdit} />
                            </Button>
                          }
                        </>
                      }
                    </>
                  ) : (
                    <h2>Select conversation on the left</h2>
                  )}
                </div>
                <hr />
                {selectedConversation && selectedConversation.type === conversationTypes.p2p &&
                  <P2pConversationMessages
                    messages={peerMessages[selectedConversation.peerId] || []}
                    onLeaveConversation={leaveConversation}
                    onSendMessage={onSendPeerMessage}
                    onUpdatePeerLastReadMessageTimestamp={onUpdatePeerLastReadMessageTimestamp}
                    peerUser={usersInfo[selectedConversation.peerId]}
                    peerLastReadMessageTimestamp={peerLastReadMessageTimestamps[selectedConversation.peerId] || 0}
                    onMessageRemoval={onP2pMessageRemoval}
                    setChildrenCallbacks={setChildrenCallbacks}
                  />
                }
                {selectedConversation && selectedConversation.type === conversationTypes.group &&
                  <GroupConversationMessages
                    chatInfo={groupChatsInfo[selectedConversation.chatId]}
                    currentUser={user}
                    messages={groupChatMessages[selectedConversation.chatId] || []}
                    onLeaveConversation={leaveConversation}
                    onSendMessage={onSendGroupMessage}
                    onUpdateGroupLastReadMessageTimestamp={onUpdateGroupLastReadMessageTimestamp}
                    groupLastReadMessageTimestamp={groupLastReadMessageTimestamps[selectedConversation.chatId] || 0}
                    onMessageRemoval={onGroupChatMessageRemoval}
                    setChildrenCallbacks={setChildrenCallbacks}
                  />
                }
              </Col>
            </Row>
          </div>
        </Container>
      </div>
      <NewMessageModal
        loading={recipientModalLoading}
        onCreateNewGroup={(participants, groupName) => {
          setRecipientModalLoading(true);
          createNewGroup(participants, groupName).then(() => {
            setRecipientModalLoading(false);
            hideRecipientModal();
          });
        }}
        onHide={hideRecipientModal}
        onP2pConversationSelect={(username) => onConversationSelect(conversationTypes.p2p, username)}
        onRecipientsSearch={onRecipientsSearch}
        recipients={recipients}
        recipientsSearchText={recipientsSearchText}
        show={showRecipientModal}
      />
      { showEditGroupModal &&
        <EditGroupModal
          loading={editGroupChatPending}
          errorMessage={editGroupChatError}
          dismissEditGroupChatError={dismissEditGroupChatError}
          onEditGroup={(participants, groupName) => {
            editGroup(participants, groupName).then(() => {
              hideEditGroupModal();
            })
          }}
          onHide={hideEditGroupModal}
          onRecipientsSearch={onRecipientsSearch}
          groupChat={selectedGroupChat}
          recipients={recipients}
          recipientsSearchText={recipientsSearchText}
          show={showEditGroupModal}
        />
      }
    </div>
  );
}

DefaultPage.propTypes = {};
DefaultPage.defaultProps = {};
