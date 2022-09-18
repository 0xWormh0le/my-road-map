import React, { useState, useCallback, useMemo, forwardRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/pro-duotone-svg-icons';
import { faChevronRight, faClock, faPlus, faCheck, faCheckDouble } from '@fortawesome/pro-regular-svg-icons';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import DatePicker from 'react-datepicker';
import clsx from 'clsx';
import CustomDialog from '../../../common/CustomDialog'
import { useAddActionItem, useDeleteActionItem, useSetActionItemDetails } from '../../redux/hooks';
import { useUnauthorizedErrorHandler } from '../../../../common/apiHelpers';
import * as yup from 'yup';
import dayjs from 'dayjs';

// import PropTypes from 'prop-types';

const addActionItemSchema = yup.object().shape({
  description: yup.string().required(),
  due_date: yup.date().required()
});

const DatePickerButton = forwardRef(({ value, onClick, className }, ref) => (
  <Button
    ref={ref}
    onClick={onClick}
    variant="white"
    className={clsx("btn-due-date btn-center", className)}
  >
    <FontAwesomeIcon icon={faCalendar} size='sm' className='mr-2' />
    {value || 'Due Date'}
  </Button>
))

export const ActionItemDialog = ({ show, onHide, onSave, data }) => {
  const { register, handleSubmit, control, errors } = useForm({
    resolver: yupResolver(addActionItemSchema)
  });

  return (
    <Modal show={show} onHide={onHide} className='action-item-dialog modal-mobile-slide-from-bottom' centered>
      <Form onSubmit={handleSubmit(onSave)}>
        <Modal.Body>
          <div className="position-relative">
            <span className="cancel" onClick={onHide}>Cancel</span>
              <h2 className='text-center mrm-mb-1'>
                {!data.description ? 'Add Action Item' : 'Edit Action Item'}
              </h2>
          </div>

          <Form.Group controlId="action-item-name">
            <Form.Control
              placeholder="Action item name..."
              autoComplete="off"
              name="description"
              defaultValue={data.description}
              isInvalid={errors.description}
              ref={register}
            />
          </Form.Group>

          <div className="d-flex justify-content-between">
            <Form.Group controlId="due-date" className="mb-0">
              <Controller
                name="due_date"
                control={control}
                defaultValue={data.due_date ? dayjs(data.due_date).toDate() : null}
                render={({ onChange, value }) => (
                  <DatePicker
                    selected={value}
                    customInput={<DatePickerButton className={clsx({'is-invalid': errors.due_date})}/>}
                    onChange={onChange}
                  />
                )}
              />
            </Form.Group>
            <div>
              <Button variant="primary" className="btn-ai-save" type="submit">
              {!data.description ? "Save" : "Save Changes"}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Form>
    </Modal>
  )
}

const ActionItem = ({ link, data, onEdit, onDelete, canEdit }) => {
  const due_date = data.due_date && dayjs(data.due_date)
  
  const getDueDateClass = () => {
    if (data.due_date) {
      if (due_date.isBefore(dayjs(new Date()))) {
        return 'due-over'
      } else if (data.marked_done || data.approved_done) {
        return 'due-completed'
      } else {
        return 'due-default'
      }
    }
  }

  const getDueDateDisplay = () => {
    if (data.due_date) {
      if (due_date.year() < dayjs(new Date()).year()) {
        return due_date.format('MMM D, YYYY')
      } else {
        return due_date.format('MMM D')
      }
    }
  }

  const completeIcon = useMemo(() => {
    if (!data.marked_done) {
      return null
    } else if (data.resolutions.includes('requires_approval')) {
      if (data.approved_done) {
        return faCheckDouble
      } else {
        return faClock
      }
    } else {
      return faCheck
    }
  }, [data])

  return (
    <Link to={link} className="action-item-row">
      <Row className="action-item align-items-center" noGutters>
        <Col className={clsx('ai-status', data.marked_done && 'green', !data.marked_done && 'blank')}>
          <div className="m-auto text-white">
            {completeIcon && ( <FontAwesomeIcon icon={completeIcon} size="xs" /> )}
          </div>
        </Col>
        <Col className="ml-2">
          <div className="ai-description">
            <p className="mb-0">{data.title ? data.title : data.effective_description}</p>
            <small className={clsx('font-weight-bold', getDueDateClass())}>{getDueDateDisplay()}</small>
          </div>
        </Col>
        <Col className="text-right d-flex align-items-center justify-content-end icon-box col-auto">
          <div className="mrm-pl-1 mrm-pr-0_25">
            <FontAwesomeIcon icon={faChevronRight} size="sm" title='Detail' />
          </div>
        </Col>
      </Row>
    </Link>
  )
}

export default function ActionItems({ className, roadmapId, competency, actionItems, user, studentId, refetchCompetency }) {

  const { addActionItem } = useAddActionItem();

  const { setActionItemDetails } = useSetActionItemDetails();

  const { deleteActionItem } = useDeleteActionItem();

  const [actionItemDialog, setActionItemDialog] = useState(false);

  const [deleteDialog, setDeleteDialog] = useState(false);

  const handleAddActionItemClick = useCallback(() => setActionItemDialog('new'), []);

  const handleAddClose = useCallback(() => setActionItemDialog(false), []);

  const handleDeleteClose = useCallback(() => setDeleteDialog(false), []);

  const handleEditClick = useCallback(ai => () => setActionItemDialog(ai), []);

  const handleDeleteClick = useCallback(ai => () => setDeleteDialog(ai), []);

  const handleSaveClick = useCallback(
    ai => ({ description, due_date }) => {
      const createNewActionItem = actionItemDialog === 'new';
      const action = createNewActionItem ? addActionItem : setActionItemDetails;
      const args = {
        roadmapId,
        stageId: competency.stage,
        competencyId: competency.id,
        actionItemId: actionItemDialog.id,
        data: {
          description,
          due_date: dayjs(due_date).format('YYYY-MM-DD'),
          competency: competency.id,
          parent: null
        }
      };
      if (createNewActionItem && studentId && studentId !== user.id) args.data.student = studentId;
      setActionItemDialog(false);
      action(args).catch(useUnauthorizedErrorHandler).then(refetchCompetency);
    },
    [
      addActionItem,
      setActionItemDetails,
      actionItemDialog,
      setActionItemDialog,
      roadmapId,
      competency.id,
      competency.stage,
      user,
      studentId,
      refetchCompetency,
    ]
  )

  const handleDeleteYes = useCallback(
    ai => () => {
      const args = {
        roadmapId,
        stageId: competency.stage,
        competencyId: competency.id,
        actionItemId: ai.id
      }
      setDeleteDialog(false)
      deleteActionItem(args).catch(useUnauthorizedErrorHandler)
    },
    [competency.stage, competency.id, roadmapId, deleteActionItem]
  );

  const location = useLocation();

  return (
    <Row className={clsx("roadmap-components-competency-page-action-items", className)}>
      <Col>
        {competency.total_action_item_assessments_count > 0 && <h2>Action Items </h2>}
        {competency.total_action_item_assessments_count > 0 && (
          <span className="theme-text-primary">
            {`(${competency.done_action_item_assessments_count} of ${competency.total_action_item_assessments_count} done)`}
          </span>
        )}
        <div className="action-item-container mrm-mb-1">
          { 
            // Global action items
            actionItems.filter(item => item.parent != null).sort((a, b) => a.order - b.order || a.id - b.id).map(ai => (
              <ActionItem
                key={ai.id}
                data={ai}
                link={{
                  pathname: `/roadmap/${roadmapId}/stage/${competency.stage}/competency/${competency.id}/action-item/${ai.id}`,
                  state: { backLink: location },
                }}
                onEdit={handleEditClick(ai)}
                onDelete={handleDeleteClick(ai)}
                canEdit={user && user.features.can_add_action_items && !ai.parent}
              />
            ))
          }
          
          {
            // User action items
            actionItems.filter(item => item.parent === null).sort((a, b) => a.id - b.id).map(ai => (
              <ActionItem
                key={ai.id}
                data={ai}
                link={{
                  pathname: `/roadmap/${roadmapId}/stage/${competency.stage}/competency/${competency.id}/action-item/${ai.id}`,
                  state: { backLink: location },
                }}
                onEdit={handleEditClick(ai)}
                onDelete={handleDeleteClick(ai)}
                canEdit={user && user.features.can_add_action_items && !ai.parent}
              />
            ))
          }
        </div>
        {user && user.features.can_add_action_items && (
          <div className="d-none d-lg-block desktop-page-container">
            <Link
              className="add-action-item"
              onClick={handleAddActionItemClick}
              to={location}
            >
              <FontAwesomeIcon icon={faPlus} size="sm" className='mr-2' />
              Add an action item
            </Link>
          </div>
        )}
        {user && user.features.can_add_action_items && (
          <div className="d-lg-none">
            <Button
              variant="white"
              className="btn-action-item btn-center mrm-mb-1"
              onClick={handleAddActionItemClick}
            >
              <FontAwesomeIcon icon={faPlus} size="sm" className='mr-2' />
              Add Action Item
            </Button>
          </div>
        )}

        <ActionItemDialog
          show={!!actionItemDialog}
          onHide={handleAddClose}
          onSave={handleSaveClick(actionItemDialog)}
          data={actionItemDialog}
        />

        <CustomDialog
          show={!!deleteDialog}
          onHide={handleDeleteClose}
          onYes={handleDeleteYes(deleteDialog)}
          text={{
            caption: 'Deleting an action item is permanent. There is no way to undo this.',
            yes: 'Delete Action Item'
          }}
        />
      </Col>
    </Row>
  );
}

ActionItems.propTypes = {};
ActionItems.defaultProps = {};
