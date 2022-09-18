import React, { useState, useMemo, useCallback } from 'react';
// import PropTypes from 'prop-types';
import clsx from 'clsx';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ActionMenu, CustomDialog } from '../../../common';
import { faVideo, faHeadphonesAlt, faFile, faTimes } from '@fortawesome/pro-light-svg-icons';
import { faEllipsisH, faPaperclip } from '@fortawesome/pro-regular-svg-icons';
import { useUnauthorizedErrorHandler } from '../../../../common/apiHelpers';
import { useUpdateCompetencyAttachment } from '../../../roadmap/redux/updateCompetencyAttachment';

const FILE_CATEGORY = {
  screen: faVideo,
  audio: faHeadphonesAlt,
  attachment: faPaperclip
}

const FILE_TYPE = {
  image: 'IMG',
  video: 'VIDEO',
  audio: 'AUDIO',
  spreadsheet: 'SHEET',
  text: 'TEXT',
}

export const UPLOAD_STATUS = {
  confirm: 'confirm',
  uploading: 'uploading',
  saving: 'saving',
  failed: 'failed',
  completed: 'completed',
}

const schema = yup.object().shape({
  filename: yup.string().required()
})

export function AttachmentList({ data, onDelete, showBorder, canDelete, actionMenuData = null, user }) {
  const [deleteDialog, setDeleteDialog] = useState(null)
  const [actionMenu, setActionMenu] = useState(null)
  const [renameFile, setRenameFile] = useState(null)
  const { updateCompetencyAttachment } = useUpdateCompetencyAttachment()
  const unauthorizedErrorHandler = useUnauthorizedErrorHandler()

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema)
  });

  const handleDeleteClick = useCallback(id => () => {
    setDeleteDialog(id)
    if (actionMenu) {
      setActionMenu(null)
    }
  }, [actionMenu])

  const handleRenameFileClick = useCallback(id => () => {
    setRenameFile(id)
    setActionMenu(null)
  }, [])

  const handleDeleteClose = useCallback(() => setDeleteDialog(null), [])

  const handleDeleteYes = useCallback(() => {
    onDelete(deleteDialog)
    setDeleteDialog(null)
  }, [onDelete, deleteDialog])

  const canDeleteOverride = typeof canDelete === "boolean";

  const canDeleteEvaluator = useCallback(attacher_id => {
    if (canDeleteOverride) return canDelete;
    return user && user.id === attacher_id;
  }, [canDeleteOverride, canDelete, user]);

  const handleActionMenuClick = useCallback(id => () => setActionMenu(id), [])

  const handleHideActionMenu = useCallback(() => setActionMenu(null), [])

  const handleHideRename = useCallback(() => setRenameFile(null), [])

  const handleRenameSaveClick = useCallback(({ filename }) => {
    handleHideRename()
    updateCompetencyAttachment({
      roadmapId: actionMenuData.roadmapId,
      stageId: actionMenuData.stageId,
      competencyId: actionMenuData.competencyId,
      attachmentId: renameFile,
      filename}).catch(unauthorizedErrorHandler)
  }, [
    actionMenuData,
    renameFile,
    handleHideRename,
    updateCompetencyAttachment,
    unauthorizedErrorHandler
  ])

  const actionMenuItems = useMemo(() => {
    if (!actionMenu) {
      return []
    } else {
      const selectedItem = data.find(x => x.id === actionMenu)
      return [
        { label: selectedItem.filename, to: { pathname: selectedItem.file_url }, target: "_blank", className: 'bold' },
        { label: 'Rename', onClick: handleRenameFileClick(actionMenu)},
        { label: 'Delete', className: 'text-danger', onClick: handleDeleteClick(actionMenu)}
      ]
    }
  }, [
    actionMenu,
    data,
    handleDeleteClick,
    handleRenameFileClick
  ])

  return (
    <div className='action-item-page-attachment-list'>
      {data.map(({ id, filename, file_type, file_url, file_category, attacher_id }, key) => (
        <div key={key} className='attachment'>
          <FontAwesomeIcon
            icon={(file_category && FILE_CATEGORY[file_category.toLowerCase()]) || faFile}
            size='sm'
            className="mrm-mr-0_5 attachment-type-icon"
          />
          <span className='file-type'>
            {FILE_TYPE[file_type] || 'OTHER'}
          </span>
          <a
            className="file-name"
            target="_blank"
            rel="noopener noreferrer"
            href={file_url}
            title={filename}
          >
            {filename}
          </a>
          {canDeleteEvaluator(attacher_id) && !actionMenuData && (
            <span className='delete' onClick={handleDeleteClick(id)}>
              <FontAwesomeIcon icon={faTimes} />
            </span>
          )}
          { actionMenuData &&
            <span className='delete' onClick={handleActionMenuClick(id)}>
              <FontAwesomeIcon icon={faEllipsisH} size="sm" />
            </span>
          }
        </div>
      ))}
      {data.length > 0 && showBorder && (
        <div className="border mrm-mt-1" />
      )}
      <CustomDialog
        show={!!deleteDialog}
        onHide={handleDeleteClose}
        onYes={handleDeleteYes}
        text={{
          caption: 'Deleting an attachment is permanent. There is no way to undo this.',
          yes: 'Delete Attachment'
        }}
        header= 'Delete Attachment?'
      />
      <ActionMenu
        show={!!actionMenu}
        onHide={handleHideActionMenu}
        items={actionMenuItems}
      />

      <Modal show={renameFile} onHide={handleHideRename} className='action-item-dialog modal-mobile-slide-from-bottom' centered>
        <Form onSubmit={handleSubmit(handleRenameSaveClick)}>
          <Modal.Body>
            <div className="position-relative">
              <span className="cancel" onClick={handleHideRename}>Cancel</span>
              <h2 className='text-center mrm-mb-1'>Rename</h2>
            </div>

            <Form.Group>
              <Form.Control
                placeholder="File name..."
                autoComplete="off"
                name="filename"
                defaultValue={data.filename}
                isInvalid={errors.filename}
                ref={register}
              />
            </Form.Group>

            <div className="d-flex justify-content-between">
              <Button variant="primary" className="btn-ai-save" type="submit">
                Save
              </Button>
            </div>
          </Modal.Body>
        </Form>
      </Modal>
    </div>
  )
}

const title = {
  uploading: 'Uploading... please wait',
  saving: 'Saving upload... please wait',
  confirm: 'Confirm Upload',
  failed: 'Upload Failed',
  completed: 'Upload Completed'
}

export function useUploadStatus(pending, progress, error) {
  return useMemo(() => {
    if (pending) {
      return progress < 1 ? UPLOAD_STATUS.uploading : UPLOAD_STATUS.saving
    } else if (progress === undefined) {
      return UPLOAD_STATUS.confirm
    } else if (error) {
      return UPLOAD_STATUS.failed
    } else {
      return UPLOAD_STATUS.completed
    }
  }, [pending, progress, error])
}

export function UploadProgressBar({ progress, error }) {
  return <CircularProgressbar
    className="upload-progress"
    value={progress}
    maxValue={1}
    strokeWidth={2}
    text={`${Math.round(progress * 100)}%`}
    styles={buildStyles({
      pathColor: error ? '#af0000': 'darkgreen',
      textColor: error ? '#af0000': 'darkgreen'
    })}
  />;
}

export default function AttachmentModal({
  data,
  show,
  pending,
  progress,
  error,
  onConfirm,
  onAnotherFile,
  onHide
}) {
  const type = useMemo(() => {
    if (!data) {
      return null
    }
    switch (data.type) {
      case 'attach_screen_recording': return 'Screen Recording'
      case 'attach_audio_recording': return 'Audio Recording'
      case 'attach_file':
      default: return 'File'
    }
  }, [data])

  const status = useUploadStatus(pending, progress, error);

  return (
    <Modal
      className={clsx(
        "roadmap-components-action-item-page-attachment",
        "modal-mobile-slide-from-bottom",
      )}
      show={show}
      onHide={(status === UPLOAD_STATUS.uploading || status === UPLOAD_STATUS.saving) ? undefined : onHide}
      centered
    >
      <Modal.Body className="text-center position-relative">
        <h2 className={status}>
          {title[status]}
        </h2>
        <p className="mb-0">{type}</p>
        <p className="text-break">{data && data.path}</p>

        {status === UPLOAD_STATUS.confirm && (
          <>
            <Button variant="secondary" className="cancel mrm-p-1" onClick={onHide}>
              <strong>Cancel</strong>
            </Button>
            <Row className="justify-content-center">
            <Col className="col-12 col-sm-auto">
              <Button variant="gray" onClick={onAnotherFile} className="w-100">
                Pick another one
              </Button>
            </Col>
            <Col className="col-12 col-sm-auto">
              <Button onClick={onConfirm} className="mrm-mb-0_75 w-100">
                Confirm
              </Button>
            </Col>
          </Row>
          </>
        )}
        {(status === UPLOAD_STATUS.uploading || status === UPLOAD_STATUS.saving) && (
          <>
            <UploadProgressBar progress={progress} error={error} />
            <Button variant="secondary" className="cancel mrm-p-1" onClick={onHide}>
              <strong>Cancel</strong>
            </Button>
          </>
        )}
        {(status === UPLOAD_STATUS.failed || status === UPLOAD_STATUS.completed) && (
          <>
            <Button variant="secondary" className="cancel mrm-p-1" onClick={onHide}>
              <strong>Close</strong>
            </Button>
            <div>
              <Button onClick={onHide} className="mrm-mt-0_75 w-100">
                Okay
              </Button>
            </div>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

AttachmentModal.propTypes = {};
AttachmentModal.defaultProps = {};
