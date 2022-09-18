import React, { useCallback, useState, useEffect } from 'react';
import { useHistory, useParams, Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import TextareaAutosize from 'react-textarea-autosize';

import { useFetchUser } from '../user/redux/hooks';
import { Header, DesktopHeader } from '../common';
import useEffectiveBackLink from '../common/useEffectiveBackLinkHook';
import { useAddNote, useUpdateNote, useDeleteNote, useFetchCompetencyNotes } from './redux/hooks';
import { useUnauthorizedErrorHandler } from '../../common/apiHelpers';

export default function NotePage() {
  const history = useHistory();
  const { roadmapId, stageId, competencyId, noteId } = useParams();
  const { user } = useFetchUser()
  const [ note, setNote ] = useState('');
  const { notes, fetchCompetencyNotes } = useFetchCompetencyNotes();
  const { addNote } = useAddNote();
  const { updateNote } = useUpdateNote();
  const { deleteNote } = useDeleteNote();
  const unauthorizedErrorHandler = useUnauthorizedErrorHandler();
  const defaultBackLink = `/roadmap/${roadmapId}/stage/${stageId}/competency/${competencyId}`;
  const effectiveBackLink = useEffectiveBackLink(defaultBackLink);

  useEffect(() => {
    if (!noteId) return;
    fetchCompetencyNotes({
      roadmapId,
      stageId,
      competencyId,
      noteId,
    }).catch(unauthorizedErrorHandler);
  }, [
    fetchCompetencyNotes,
    roadmapId,
    stageId,
    competencyId,
    noteId,
    unauthorizedErrorHandler,
  ]);

  useEffect(() => {
    if (!notes || notes.length === 0) return;
    setNote(notes[0].text);
  }, [notes]);

  const handleSaveClick = useCallback(() => {
    const commonArgs = {
      roadmapId,
      stageId,
      competencyId,
    }
    let actionPromise;
    if (noteId) {
      if (note === '') {
        actionPromise = deleteNote({
          ...commonArgs,
          noteId,
        })
      } else {
        actionPromise = updateNote({
          ...commonArgs,
          noteId,
          noteText: note,
        })
      }
    } else {
      if (!user || !note) {
        return
      }
      actionPromise = addNote({
        ...commonArgs,
        student: user.id,
        note
      })
    }
    actionPromise.catch(unauthorizedErrorHandler).then(() => history.push(effectiveBackLink));
  }, [
    history,
    roadmapId,
    stageId,
    competencyId,
    note,
    user,
    addNote,
    effectiveBackLink,
    deleteNote,
    updateNote,
    noteId,
    unauthorizedErrorHandler,
  ]);

  const renderBackLink = useCallback((effectiveBackLink) => (
    <Link to={effectiveBackLink}>
      <Button className="btn-cancel" variant="white">
        Cancel
      </Button>
    </Link>
  ), []);

  const renderSaveButton = useCallback(() => (
    <Button className="btn-save" variant="white" onClick={handleSaveClick}>
      Save
    </Button>
  ), [handleSaveClick])

  return (
    <div className="roadmap-note-page">
    <Header
      icon="back"
      title='Notes/journal'
      renderThirdColumn={renderSaveButton}
      thirdColumnClass="text-right"
      colSizes={[3, 6, 3]}
      border
      renderBackLink={renderBackLink}
      defaultBackLink={effectiveBackLink}
    />
    <DesktopHeader showPrimaryContent={false}>
      <Container>
        <Row className="desktop-page-secondary-header-wrapper mrm-mb-1 mrm-py-1">
          <Col xs={1}>
            <Link to={effectiveBackLink}>
              <Button variant="gray">
                Cancel
              </Button>
            </Link>
          </Col>
          <Col xs={10}>
            <h1 className="text-center">Notes/journal</h1>
          </Col>
          <Col xs={1}>            
            {renderSaveButton()}
          </Col>
        </Row>
      </Container>
    </DesktopHeader>
      <Container>
        <Row>
          <Col>
            <Form className="mrm-mt-1" noValidate onSubmit={handleSaveClick}>
              <Form.Group controlId="formNotes">
                <Form.Control 
                  as={TextareaAutosize}
                  minRows={3}
                  maxRows={14}
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Add your thoughts..."
                  className="theme-card">
                </Form.Control>
              </Form.Group>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

NotePage.propTypes = {};
NotePage.defaultProps = {};
