import React from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import clsx from 'clsx'
// import PropTypes from 'prop-types';

const CustomDialog = ({ text, className, show, onHide, onYes, header, confirmClassName }) => (
  <Modal
    centered
    className={clsx("common-custom-dialog", className)}
    show={show}
    onHide={onHide}
  >
    <Modal.Body className="text-center p-0 confirmation-modal">
      <div className="mrm-px-1 mrm-pt-1">
        { header 
          ? (<h2>{header}</h2>)
          : (<h2>Are you sure?</h2>)
        }
        <small>{text.caption}</small>
      </div>
      <div className="border-thin mrm-mt-1" />
      <Button variant="destructive" className={clsx("w-100", confirmClassName)} onClick={onYes}>
        {text.yes}
      </Button>
      <div className="border-thin" />
      <Button variant="destructive" className="btn-cancel w-100" onClick={onHide}>
        Cancel
      </Button>
    </Modal.Body>
  </Modal>
)

export default CustomDialog

CustomDialog.propTypes = {};
CustomDialog.defaultProps = {};
