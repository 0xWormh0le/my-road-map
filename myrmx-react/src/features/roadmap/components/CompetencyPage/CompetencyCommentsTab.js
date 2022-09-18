import React, { useState, useCallback, useRef, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/pro-solid-svg-icons';
import TextareaAutosize from 'react-textarea-autosize';
import fp from 'lodash/fp';
import clsx from 'clsx';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc'; // dependent on utc plugin
import timezone from 'dayjs/plugin/timezone';
// import PropTypes from 'prop-types';

import useTimeout from '../../../common/useTimeoutHook';
import usePagination from '../../../common/usePagination';
import {
  useAddCompetencyComment,
  useDeleteCompetencyComment
} from '../../redux/hooks';
import { useUnauthorizedErrorHandler } from '../../../../common/apiHelpers';
import { useMarkCommentsRead } from '../../../notifications/redux/hooks';
import useFocusedInput from '../../../common/useFocusedInputHook';
import { UserAvatar } from '../../../common';

import Linkify from 'react-linkify';


dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

export default function CompetencyCommentsTab (props) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedComment, setSelectedComment] = useState();
  const { formInputRef, inputFocused } = useFocusedInput();
  const formRef = useRef()
  const {
    comments,
    competencyId,
    roadmapId,
    stageId,
    user,
    onAddNewComment,
    onDeleteComment,
    onLoadMoreComments,
    fetchCommentsPending,
    fetchUpdates,
    unseenComments,
    student,
  } = props;
  const {
    addCompetencyComment,
    addCompetencyCommentPending,
  } = useAddCompetencyComment();

  const {
    deleteCompetencyComment,
    deleteCompetencyCommentPending
  } = useDeleteCompetencyComment();

  const unauthorizedErrorHandler = useUnauthorizedErrorHandler();
  const { markCommentsRead } = useMarkCommentsRead();

  usePagination({
    scrollDirection: 'scrollup',
    fetchAction: onLoadMoreComments,
    actionArgs: {
      roadmapId, stageId, competencyId,
    },
    requestNextPage: () => comments && comments.next && !fetchCommentsPending
  })

  const markCommentsReadHandlingErrors = useCallback(() => {
    const commentIds = comments.results.filter(c => unseenComments.indexOf(c.id) >= 0).map(c => c.id);
    if (commentIds.length === 0) return;
    markCommentsRead(commentIds).then(() => {
      return fetchUpdates();
    }).catch(unauthorizedErrorHandler);
  }, [comments, unseenComments, markCommentsRead, fetchUpdates, unauthorizedErrorHandler]);

  useTimeout(markCommentsReadHandlingErrors, comments && unseenComments ? 1000 : undefined);

  const handleSubmit = useCallback(event => {
    event.preventDefault();
    event.stopPropagation();

    const form = formRef.current;
    if (form.checkValidity()) {
      const data = {
        user_id: user.id,
        text: form.elements.comment.value,
        competency: competencyId,
        student: student ? student.id : user.id,
        date: new Date().toISOString()
      };
      addCompetencyComment({ roadmapId, stageId, competencyId, data })
        .then(resp => {
          onAddNewComment(resp.data);
          setSubmitDisabled(true)
        })
        .catch(unauthorizedErrorHandler);
    }
  }, [
    unauthorizedErrorHandler,
    addCompetencyComment,
    onAddNewComment,
    competencyId,
    roadmapId,
    stageId,
    student,
    user
  ])

  const handleDeleteConfirm = () => {
    setShowDeleteModal(false);
    deleteCompetencyComment({ roadmapId, stageId, competencyId, commentId: selectedComment.id })
      .then(resp => {
        onDeleteComment(selectedComment);
        setSelectedComment(null);
      })
      .catch(unauthorizedErrorHandler);
  }

  const hideDeleteConfirm = () => {
    setSelectedComment(null);
    setShowDeleteModal(false);
  }

  const handleDelete = comment => {
    setSelectedComment(comment);
    setShowDeleteModal(true);
  }

  const handleCommentInputKeyDown = useCallback(e => {
    if (e.which === 13) {
      handleSubmit(e)
    }
  }, [handleSubmit])

  const commentsListAnchorRef = useRef();

  useEffect(() => window.scrollTo(0, 0), []);

  useEffect(() => {
    if (commentsListAnchorRef.current && formRef.current) {
      const anchorRect = commentsListAnchorRef.current.getBoundingClientRect();
      const formRect = formRef.current.getBoundingClientRect();
      if (anchorRect.top > formRect.top) {
        commentsListAnchorRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [comments]);

  const [submitDisabled, setSubmitDisabled] = useState(true);
  const handleUpdateSubmitState = (e) => {
    const value = e.target.value
    setSubmitDisabled(!value)
  }

  const [size, setSize] = useState({
    x: window.innerWidth,
    y: window.innerHeight
  })
  const updateSize = () =>
    setSize({
      x: window.innerWidth,
      y: window.innerHeight
    });

  useEffect(() => (window.onresize = updateSize), []);

  return (
    <div className="roadmap-components-competency-page-competency-comments-tab tab-container">
      <Row>
        {!comments || addCompetencyCommentPending || deleteCompetencyCommentPending || fetchCommentsPending ? (
          <Col className="text-center">
            <Spinner animation="border" role="status">
              <span className="sr-only">Submitting...</span>
            </Spinner>
          </Col>
        ) : (
          <Col className="comment-list mrm-pt-1">
            <p className="print-header">Comments</p>
            {comments.results.length > 0 ? fp.reverse(comments.results).map(comment => {
              const userFullname = `${comment.user.first_name} ${comment.user.last_name}`;
              return (
                <Row noGutters className="competency-comment" key={comment.id}>
                  <Col xs='auto'>
                    {unseenComments.indexOf(comment.id) >= 0 && <span className="dot float-left" />}
                    <UserAvatar user={comment.user} size="sm" />
                  </Col>
                  <Col className='px-2'>
                    <span className="user-name theme-text-primary">{userFullname}</span>
                    <span className="theme-text-secondary">{dayjs(comment.date).fromNow()}</span>
                    <Card className={comment.user.id === user.id && "mine"} key={comment.id}>
                      <Linkify componentDecorator={(decoratedHref, decoratedText, key) => ( <a target="blank" href={decoratedHref} key={key}> {decoratedText} </a> )}>
                        {comment.text}
                      </Linkify>
                    </Card>
                  </Col>
                  {comment.user.id === user.id &&
                    <Col xs='auto' className="delete-comment">
                      <div className="delete-comment-message-icon" onClick={() => handleDelete(comment)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </div>
                    </Col>
                  }
                </Row>
              )
            }) : (
              <div className="no-comments text-center theme-text-secondary">
                <p>No comments yet. Add one now!</p>
              </div>
            )}
            <div className="comments-anchor" ref={commentsListAnchorRef} />
            { size.x <= 991 && 
              <div className="d-lg-none mobile-page-container">
                <Form
                  className={clsx("d-flex align-items-center comment-form", { "focused-input": inputFocused })}
                  noValidate
                  ref={formRef}
                  onSubmit={handleSubmit}
                >
                  <Form.Group className="flex-fill mrm-mr-0_75" controlId="comment">
                    <Form.Control
                      required
                      maxRows={8}
                      as={TextareaAutosize}
                      onKeyDown={handleCommentInputKeyDown}
                      onChange={handleUpdateSubmitState}
                      maxLength={4096}
                      placeholder="Comment..."
                      ref={formInputRef}
                    />
                  </Form.Group>
                  <Button disabled={submitDisabled} variant="primary" type="submit" className="align-self-end">Submit</Button>        
                </Form>
              </div>
            }
            { size.x > 991 && 
              <div className="d-none d-lg-block desktop-page-container">
                <div className="bottom">
                  <Form
                    className={clsx("d-flex align-items-center comment-form sticky", { "focused-input": inputFocused })}
                    noValidate
                    ref={formRef}
                    onSubmit={handleSubmit}
                  >
                    <Form.Group className="flex-fill mrm-mr-0_75" controlId="comment">
                      <Form.Control
                        required
                        maxRows={8}
                        as={TextareaAutosize}
                        onKeyDown={handleCommentInputKeyDown}
                        onChange={handleUpdateSubmitState}
                        maxLength={4096}
                        placeholder="Comment..."
                        ref={formInputRef}
                      />
                    </Form.Group>
                    <Button disabled={submitDisabled} variant="primary" type="submit" className="align-self-end">Submit</Button>
                  </Form>
                </div>
              </div>
            }
          </Col>
        )}
      </Row>
      {<Modal
        centered
        show={showDeleteModal}
        className="confirmation-modal"
      >
        <Modal.Header>
          <Modal.Title className="w-100">
            <h1>Are you sure you want to delete this comment?</h1>
          </Modal.Title>
        </Modal.Header>
        <Button variant="destructive" onClick={handleDeleteConfirm}>Delete</Button>
        <div className="border-thin" />
        <Button className="btn-menu-item" variant="" onClick={hideDeleteConfirm}>Cancel</Button>
      </Modal>}
    </div>
  );
}


CompetencyCommentsTab.propTypes = {};
CompetencyCommentsTab.defaultProps = {};
