import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
// import PropTypes from 'prop-types';
import { useHistory, useParams } from 'react-router-dom';
import dayjs from "dayjs";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import { faSpinnerThird } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faRedo, faTimes } from '@fortawesome/pro-regular-svg-icons';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import TextareaAutosize from 'react-textarea-autosize';


import {Header, DesktopHeader, DesktopBackButton} from '../common';
import { useUnauthorizedErrorHandler } from '../../common/apiHelpers';
import AttachmentModal, { AttachmentList, useUploadStatus, UPLOAD_STATUS, UploadProgressBar } from './components/ActionItemPage/Attachment';
import Loader from '../common/Loader';
import EditMenu from './components/ActionItemPage/EditMenu';

import {
  useSetActionItemDetails,
  useFetchCompetencyActionItemAssessments,
  useAddActionItemAttachment,
  useDeleteActionItemAttachment,
  useSetActionItemAssessment
} from './redux/hooks';
import { useFetchUser } from '../user/redux/hooks';
import { useFetchUpdates } from '../common/redux/fetchUpdates';
import useEffectiveBackLink from '../common/useEffectiveBackLinkHook';

function InputResponse({ setShowInputResponse, notes, onNotesUpdate, updateActionItem }) {
  const [validated, setValidated] = useState(false);

  const handleSubmit = event => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;
    if (form.checkValidity()) {
      const updatedNotes = form.elements.formNotes.value;
      updateActionItem({ notes: updatedNotes }).then(() => {
        onNotesUpdate(updatedNotes);
        setShowInputResponse(false);
      });
    }

    setValidated(true);
  };

  return (
    <Row>
      <Col>
        <Form className="mrm-mb-1" noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group controlId="formNotes">
            <Form.Control 
              as={TextareaAutosize} 
              minRows={5}
              maxRows={14}
              placeholder="Add your thoughts..."
              defaultValue={notes} 
              autoFocus />
          </Form.Group>
          <Button variant="primary" type="submit">
            Save
          </Button>
          <Button
            onClick={() => setShowInputResponse(false)}
            variant="secondary"
          >
            Cancel
          </Button>
        </Form>
      </Col>
    </Row>
  );
}

const actionButtonResolutions = [
  'mark_complete',
  'input_text',
  'attach_screen_recording',
];

function ActionButton({
  setShowInputResponse,
  resolution,
  markedDone,
  notes,
  updateActionItem,
  setShowScreenCapture,
  backLink,
}) {
  const [ showConfirmModal, setShowConfirmModal ] = useState(false);

  const { replaceStringWithSynonyms } = useFetchUser()

  const history = useHistory();

  function toggleItemComplete() {
    updateActionItem({
      marked_done: !markedDone,
      date_marked_done: markedDone ? null : dayjs().format('YYYY-MM-DD'),
    }).then(() => history.push(backLink));
  }

  function hideConfirmModal() {
    setShowConfirmModal(false);
  }

  let text = '';
  let action = null;

  switch (resolution) {
    case actionButtonResolutions[0]:
      text = markedDone ? 'Unmark Done' : 'Mark Complete';
      action = markedDone ? () => setShowConfirmModal(true) : toggleItemComplete;
      break;
    case actionButtonResolutions[1]:
      text = notes ? 'Edit Response' : 'Add Response';
      action = () => setShowInputResponse(true);
      break;
    case actionButtonResolutions[2]:
      text = 'Add Screen Recording';
      action = () => setShowScreenCapture(true);
      break;
    default:
      break;
  }

  return (
    <>
      <Modal
        centered
        show={showConfirmModal}
        onHide={hideConfirmModal}
      >
        <Modal.Header>
          <Modal.Title>
            <h1>Unmark Item Done?</h1>
            <p>{replaceStringWithSynonyms('This will erase your approved status and your coach will have to reapprove it.')}</p>
          </Modal.Title>
        </Modal.Header>
          <Button variant="destructive" onClick={toggleItemComplete}>Confirm</Button>
          <div className="border-thin" />
          <Button variant="secondary" onClick={hideConfirmModal}>Cancel</Button>
      </Modal>
      <Button onClick={action} variant="white" className="w-100">
        {text}
      </Button>
    </>
  );
}

const screenCaptureFileSchema = yup.object().shape({
  filename: yup.string().required()
})

function ScreenCapture({ addActionItemAttachmentFromData, children, setShowScreenCapture }) {
  const [captureStream, setCaptureStream] = useState(null);
  const [captureError, setCaptureError] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const [recordingCountdown, setRecordingCountdown] = useState(undefined);

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(screenCaptureFileSchema)
  });

  useEffect(() => {
    if (!!captureError) setShowScreenCapture(false);
  }, [captureError, setShowScreenCapture]);

  useEffect(() => {
    if (typeof recordingCountdown === 'undefined') return;
    const timeoutHandle = setTimeout(() => {
      const newCountdown = recordingCountdown - 1;
      if (newCountdown <= 0) {
        mediaRecorder.start()
        setRecordingCountdown(undefined);
      } else {
        setRecordingCountdown(newCountdown);
      }
    }, 1000);
    return () => clearTimeout(timeoutHandle);
  }, [recordingCountdown, mediaRecorder]);

  const stopRecording = () => {
    try {
      setIsRecording(false);
      mediaRecorder.stop();
      captureStream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      setCaptureError(e);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia(
        {
          video: {
            width: 1280,
            height: 720,
          },
        },
      );
      const mic = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.addTrack(mic.getTracks()[0]);
      setIsRecording(true);
      stream.getTracks().forEach((track) => {
        track.onended = stopRecording;
      });
      setCaptureStream(stream);
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (event) => {
        setRecording(event.data);
      };
      setMediaRecorder(recorder);
      setRecordingCountdown(5);
    } catch (e) {
      setIsRecording(false);
      setCaptureError(e);
    }
  };

  const toggleRecording = () => isRecording ? stopRecording() : startRecording();

  const handleSaveClick = useCallback(({ filename }) => {
    const data = new FormData();
    data.append('attachment', new File([recording], filename + ".webm", { type: "video/webm" }));
    data.append('file_category', 'SCREEN');
    addActionItemAttachmentFromData(data).then(() => setShowScreenCapture(false));
  }, [recording, addActionItemAttachmentFromData, setShowScreenCapture]);

  return (
    <Row>
      <Col className="text-center">
        {children && <>
          <p>Uploading...</p>
          {children}
          <div>
            <Button variant="secondary" onClick={() => setShowScreenCapture(false)}>
              <FontAwesomeIcon icon={faTimes} className='mr-2' size='xs' />
              Cancel
            </Button>
          </div>
        </>}
        {!children && <>
          <p>
            {recordingCountdown ? `Recording starting in ${recordingCountdown}...`
              : isRecording ? <>
                  <FontAwesomeIcon icon={faSpinnerThird} className='mr-2' size='xs' spin />
                  Recording in progress
                </>
              : !!recording ? "Recording done"
              : "Recording inactive"}
          </p>
          {(!recording || isRecording) && <div>
            <Button variant="primary" onClick={toggleRecording} disabled={!!recordingCountdown}>
              {isRecording && !recordingCountdown ? "Stop Recording" : "Start Recording"}
            </Button>
            <Button variant="secondary" onClick={() => setShowScreenCapture(false)}>
              <FontAwesomeIcon icon={faTimes} className='mr-2' size='xs' />
              Cancel
            </Button>
          </div>}
          {!!recording && !isRecording && <div>
            <video src={recording && URL.createObjectURL(recording)} controls width={320} />
            <Form className='p-3'>
              <Form.Group controlId='filename'>
                <Form.Label>File Name</Form.Label>
                <Form.Control
                  name='filename'
                  defaultValue={undefined}
                  isInvalid={errors.filename}
                  ref={register}
                />
              </Form.Group>
              <Button variant="primary" onClick={handleSubmit(handleSaveClick)}>
                Save
              </Button>
              <Button variant="secondary" onClick={() => setRecording(null)}>
                <FontAwesomeIcon icon={faRedo} className='mr-2' size='xs' />
                Redo Recording
              </Button>
            </Form>
          </div>}
        </>}
      </Col>
    </Row>
  );
}

const resolutions = [
  ['attach_screen_recording', 'Add Screen Recording'],
  ['attach_audio_recording', 'Add Audio Recording'],
  ['attach_file', 'Add File'],
  ['input_text', '_'],
  ['mark_complete', '_']
]

export default function ActionItemPage() {
  const [showInputResponse, setShowInputResponse] = useState(false);
  const [showScreenCapture, setShowScreenCapture] = useState(false);
  const [attachment, setAttachment] = useState(null);

  const history = useHistory();
  const fileEl = useRef({});
  const { roadmapId, stageId, competencyId, actionItemId } = useParams();

  const { user } = useFetchUser()
  const unauthorizedErrorHandler = useUnauthorizedErrorHandler();
  const {
    addActionItemAttachment,
    addActionItemAttachmentPending,
    addActionItemAttachmentReset,
    addActionItemAttachmentProgress,
    addActionItemAttachmentError
  } = useAddActionItemAttachment();
  const { setActionItemAssessment, setActionItemAssessmentPending } = useSetActionItemAssessment()
  const { actionItems, fetchCompetencyActionItemAssessments } = useFetchCompetencyActionItemAssessments();
  const { deleteActionItemAttachment } = useDeleteActionItemAttachment();
  const { setActionItemDetails } = useSetActionItemDetails();
  const { fetchUpdates } = useFetchUpdates();
  const defaultBackLink = `/roadmap/${roadmapId}/stage/${stageId}/competency/${competencyId}`;
  const effectiveBackLink = useEffectiveBackLink(defaultBackLink);

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  
  const fetchActionItemHandlingErrors = useCallback(() => {
    fetchCompetencyActionItemAssessments({ roadmapId, stageId, competencyId, actionItemId, attachment: true })
      .catch(unauthorizedErrorHandler)
      .catch(err => {
        if (err.response && err.response.status === 404) {
          history.push('/dashboard/roadmaps');
        } else {
          throw err;
        }
      });
  }, [
    fetchCompetencyActionItemAssessments,
    roadmapId,
    stageId,
    competencyId,
    actionItemId,
    unauthorizedErrorHandler,
    history,
  ]);

  const updateActionItem = useCallback(data => {
    const args = { roadmapId, stageId, competencyId, actionItemId, data };
    return setActionItemDetails(args).catch(unauthorizedErrorHandler);
  }, [
    roadmapId,
    stageId,
    competencyId,
    actionItemId,
    setActionItemDetails,
    unauthorizedErrorHandler,
  ]);

  useEffect(() => {
    if (!actionItemId) {
      history.push('/dashboard/roadmaps');
      return;
    }
    fetchActionItemHandlingErrors();
  }, [
    actionItemId,
    history,
    fetchActionItemHandlingErrors,
  ]);

  const handleNotesUpdate = useCallback(notes => fetchActionItemHandlingErrors(), [fetchActionItemHandlingErrors]);
  
  const selectedActionItem = actionItems[actionItemId];

  const renderEditMenu = useCallback(() => {
    if (!selectedActionItem.parent) {
      return (
        <EditMenu
          roadmapId={roadmapId}
          competencyId={competencyId}
          stageId={stageId}
          actionItem={selectedActionItem}
          effectiveBackLink={effectiveBackLink}
        />
      )
    }
  }, [competencyId, roadmapId, stageId, selectedActionItem, effectiveBackLink])
  
  const sortedResolutions = useMemo(
    () => {
      if (!selectedActionItem) {
        return [];
      }
      return resolutions.filter(([res]) => selectedActionItem.resolutions.indexOf(res) >= 0);
    },
    [selectedActionItem]
  )

  const handleAddFileClick = useCallback(type => () => {
    fileEl.current.attachType = type;
    fileEl.current.click();
  }, [])

  const handleFileChange = useCallback(
    () => {
      addActionItemAttachmentReset();
      setAttachment({
        type: fileEl.current.attachType,
        path: fileEl.current.files[0].name
      })
    }, [addActionItemAttachmentReset]
  )

  const handleAttachConfirmHide = useCallback(() => {
    fileEl.current.value = null;
    setAttachment(null);
  }, [])

  const handleAttachmentDelete = useCallback(
    attachmentId => deleteActionItemAttachment({
      roadmapId,
      stageId,
      competencyId,
      actionItemId,
      attachmentId
    }),
    [
      actionItemId,
      competencyId,
      roadmapId,
      stageId,
      deleteActionItemAttachment
    ]
  )

  const addActionItemAttachmentFromData = useCallback((data) => {
    return addActionItemAttachment({
      roadmapId,
      stageId,
      competencyId,
      actionItemId,
      data
    })
  }, [roadmapId, stageId, competencyId, actionItemId, addActionItemAttachment])

  const handleConfirmUpload = useCallback(() => {
    const category = {
      'attach_screen_recording': 'SCREEN',
      'attach_audio_recording': 'AUDIO',
      'attach_file': 'ATTACHMENT'
    }
    const data = new FormData();
    data.append('attachment', fileEl.current.files[0]);
    data.append('file_category', category[attachment.type]);
    addActionItemAttachmentFromData(data);
  }, [addActionItemAttachmentFromData, attachment]);

  const handleApproveActionItem = useCallback(approve => () => {
    const args = { roadmapId, stageId, competencyId, actionItemId, approve };
    setActionItemAssessment(args).then(() => {
      fetchUpdates();
      history.push(effectiveBackLink);
    })
  }, [
    setActionItemAssessment,
    fetchUpdates,
    history,
    roadmapId,
    stageId,
    competencyId,
    actionItemId,
    effectiveBackLink,
  ])

  const attachmentUploadStatus = useUploadStatus(
    addActionItemAttachmentPending,
    addActionItemAttachmentProgress,
    addActionItemAttachmentError,
  );

  if (!selectedActionItem) {
    return <Loader />
  }

  return (
    <div className="roadmap-action-item-page">
      <Header
        icon="back"
        colSizes={['auto', undefined, 'auto']}
        renderThirdColumn={renderEditMenu}
        title={selectedActionItem.title ? selectedActionItem.title : selectedActionItem.description}
        border
        defaultBackLink={defaultBackLink}
      />
      <DesktopHeader showPrimaryContent={false}>
        <Container>
          <Row className="desktop-page-secondary-header-wrapper mrm-mb-1 mrm-py-1">
            <Col xs={1}>
              <div className="back-button-container">
                <DesktopBackButton defaultBackLink={defaultBackLink} />
              </div>
            </Col>
            <Col xs={10}>
              <h1 className="text-center">{selectedActionItem.title ? selectedActionItem.title : selectedActionItem.description}</h1>
            </Col>
            <Col xs={1}>            
              {renderEditMenu()}
            </Col>
          </Row>
        </Container>
      </DesktopHeader>
      <Container>
        {user &&
        user.groups.includes('Coach') &&
        selectedActionItem &&
        selectedActionItem.marked_done &&
        selectedActionItem.resolutions.includes('requires_approval') && (
          <div className='text-right'>
            <Button
              variant="white"
              onClick={handleApproveActionItem(!selectedActionItem.approved_done)}
              disabled={setActionItemAssessmentPending}
            >
              {setActionItemAssessmentPending ? (
                <FontAwesomeIcon icon={faSpinnerThird} className='mrm-mr-0_25' size='xs' spin />
              ) : !selectedActionItem.approved_done && (
                <FontAwesomeIcon icon={faCheck} className='mrm-mr-0_25' size='xs' />
              )}
              {selectedActionItem.approved_done && 'Unapprove'}
              {!selectedActionItem.approved_done && 'Approve'}
            </Button>
            
          </div>
        )}
        <Row>
          <Col className="ai-description theme-text">
            <div dangerouslySetInnerHTML={{ __html: selectedActionItem.effective_description }} />
          </Col>
        </Row>
        {selectedActionItem.effective_description && <div className="border mrm-mt-0_25 mrm-my-1" />}
        {selectedActionItem.notes && !(showInputResponse || showScreenCapture) && (
          <Row>
            <Col>
              <p className="ai-notes theme-text-secondary">{selectedActionItem.notes}</p>
            </Col>
          </Row>
        )}
        {showInputResponse ? (
          <InputResponse
            onNotesUpdate={handleNotesUpdate}
            notes={selectedActionItem.notes}
            setShowInputResponse={setShowInputResponse}
            updateActionItem={updateActionItem}
          />
        ) : showScreenCapture ? (
          <ScreenCapture
            addActionItemAttachmentFromData={addActionItemAttachmentFromData}
            setShowScreenCapture={setShowScreenCapture}
          >
            {(attachmentUploadStatus === UPLOAD_STATUS.uploading || attachmentUploadStatus === UPLOAD_STATUS.saving) && <UploadProgressBar
              progress={addActionItemAttachmentProgress}
              error={addActionItemAttachmentError}
            />}
          </ScreenCapture>
        ) : (
          <>
            <AttachmentList
              data={selectedActionItem.attachments}
              onDelete={handleAttachmentDelete}
              showBorder
              user={user}
            />
            <Row className="mrm-mb-2 justify-content-center">
              {sortedResolutions.map(([r, text]) => (
                <Col key={r} className="col-auto action-button">
                  {actionButtonResolutions.indexOf(r) >= 0 ? (
                    <ActionButton
                      resolution={r}
                      markedDone={selectedActionItem.marked_done}
                      notes={Boolean(selectedActionItem.notes)}
                      setShowInputResponse={setShowInputResponse}
                      updateActionItem={updateActionItem}
                      setShowScreenCapture={setShowScreenCapture}
                      backLink={effectiveBackLink}
                    />
                  ) : (
                    <Button variant="white" onClick={handleAddFileClick(r)} className="w-100">
                      {text}
                    </Button>
                  )}
                </Col>
              ))}
            </Row>
          </>
        )}
        <input type="file" ref={fileEl} onChange={handleFileChange} hidden />
        <AttachmentModal
          show={!!attachment}
          data={attachment}
          onConfirm={handleConfirmUpload}
          onAnotherFile={handleAddFileClick(attachment && attachment.type)}
          pending={addActionItemAttachmentPending}
          progress={addActionItemAttachmentProgress}
          error={addActionItemAttachmentError}
          onHide={handleAttachConfirmHide}
        />
      </Container>
    </div>
  );
}

ActionItemPage.propTypes = {};
ActionItemPage.defaultProps = {};
