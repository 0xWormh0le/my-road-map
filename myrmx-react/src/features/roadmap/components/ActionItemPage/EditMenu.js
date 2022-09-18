import React , { useState, useCallback } from 'react';
// import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { Link, useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH } from '@fortawesome/pro-regular-svg-icons';

import { ActionItemDialog } from '../CompetencyPage/ActionItems';
import CustomDialog from '../../../common/CustomDialog'

import { useAddActionItem, useDeleteActionItem, useSetActionItemDetails } from '../../redux/hooks';
import { useUnauthorizedErrorHandler } from '../../../../common/apiHelpers';

const ActionSelectModal = ({ show, onHide, onEdit, onDelete }) => (
  <Modal className="action-item-edit-menu-modal modal-mobile-slide-from-bottom" show={show} onHide={onHide} >
    <Modal.Body className="text-center p-0">
      <div className="bg-white main-buttons">
        <Button className="btn-menu-item w-100" variant="" onClick={onEdit}>
          Edit Action Item
        </Button>
        <div className="border-thin" />
        <Button className="w-100 delete" variant="destructive" onClick={onDelete}>
          Delete Action Item
        </Button>
      </div>
      <div className="border-thin d-none d-md-block" />
      <div className="bg-white mrm-mt-0_75 border-rounded cancel">
        <Button className="btn-menu-item w-100" variant="" onClick={onHide}>
          Cancel
        </Button>
      </div>
    </Modal.Body>
  </Modal>
)

export default function EditMenu({roadmapId, competencyId, stageId, actionItem, effectiveBackLink}) {

  const [showActionSelectModal, setShowActionSelectModal] = useState(false);

  const [actionItemDialog, setActionItemDialog] = useState(false);

  const [deleteDialog, setDeleteDialog] = useState(false);

  const { addActionItem } = useAddActionItem();

  const { setActionItemDetails } = useSetActionItemDetails();

  const { deleteActionItem } = useDeleteActionItem();

  const history = useHistory();

  const handleActionSelect = useCallback(() => setShowActionSelectModal(true), []);
  
  const handleActionSelectClose = useCallback(() => setShowActionSelectModal(false), []);
  
  const handleEditClick = useCallback(ai => () => {
    setShowActionSelectModal(false); 
    setActionItemDialog(ai)
  },[]);

  const handleDeleteClick = useCallback(ai => () => {
    setShowActionSelectModal(false);
    setDeleteDialog(ai)
  }, []);

  const handleAddClose = useCallback(() => setActionItemDialog(false), []);

  const handleDeleteClose = useCallback(() => setDeleteDialog(false), []);
  
  const handleSaveClick = useCallback(
    ai => ({ description, due_date }) => {
      const action = actionItemDialog === 'new' ? addActionItem : setActionItemDetails;
      const args = {
        roadmapId,
        stageId: stageId,
        competencyId: competencyId,
        actionItemId: actionItemDialog.id,
        data: {
          description,
          due_date: dayjs(due_date).format('YYYY-MM-DD'),
          competency: competencyId,
          parent: null
        }
      };
      setActionItemDialog(false);
      action(args).catch(useUnauthorizedErrorHandler);
    },
    [
      addActionItem,
      setActionItemDetails,
      actionItemDialog,
      setActionItemDialog,
      roadmapId,
      competencyId,
      stageId
    ]
  )

  const handleDeleteYes = useCallback(
    ai => () => {
      const args = {
        roadmapId,
        stageId: stageId,
        competencyId: competencyId,
        actionItemId: ai.id
      }
      setDeleteDialog(false)
      deleteActionItem(args).catch(useUnauthorizedErrorHandler).then(() => history.push(effectiveBackLink));
    },
    [stageId, competencyId, roadmapId, deleteActionItem, history, effectiveBackLink]
  );

  return (
    <div className="roadmap-components-action-item-page-edit-menu">
      <Link className="d-lg-none" onClick={handleActionSelect}>
        <FontAwesomeIcon icon={faEllipsisH} />
      </Link>
      <Link className="more-btn-desktop d-none d-lg-block" onClick={handleActionSelect}>
        <FontAwesomeIcon icon={faEllipsisH} />
      </Link>
      <ActionSelectModal
        show={!!showActionSelectModal}
        onHide={handleActionSelectClose}
        onEdit={handleEditClick(actionItem)}
        onDelete={handleDeleteClick(actionItem)}
      />

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
    </div>
  );
};

EditMenu.propTypes = {};
EditMenu.defaultProps = {};
