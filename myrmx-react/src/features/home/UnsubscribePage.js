import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import { useHistory, useParams } from 'react-router-dom';

import Loader from '../common/Loader';

import { useUnsubscribeUser } from './redux/hooks';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default function UnsubscribePage() {
  const [ showUnsubscribedModal, setShowUnsubscribedModal ] = useState(false);

  const history = useHistory();
  const { uid, token } = useParams();

  const { unsubscribeUser } = useUnsubscribeUser();

  useEffect(() => {
    if (!uid || !token) return;
    unsubscribeUser({ uid, token }).then(() => {
      setShowUnsubscribedModal(true);
    });
  }, [ unsubscribeUser, uid, token ]);

  function onModalClose() {
    history.push('/');
  }

  return (
    <div className="home-unsubscribe-page common-loader-container">
      <Loader label="Unsubscribing..." />
      <Modal
        centered
        show={showUnsubscribedModal}
        onHide={onModalClose}
      >
        <Modal.Header>
          <Modal.Title>
            <h1>Unsubscribe successful</h1>
          </Modal.Title>
        </Modal.Header>
        <Button variant="secondary" onClick={onModalClose}>OK</Button>
      </Modal>
    </div>
  );
};

UnsubscribePage.propTypes = {};
UnsubscribePage.defaultProps = {};
