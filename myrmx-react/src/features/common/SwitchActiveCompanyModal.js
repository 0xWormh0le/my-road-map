import React, { useCallback } from 'react';
// import PropTypes from 'prop-types';

import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

import { useFetchUser } from '../user/redux/fetchUser';
import { useUnauthorizedErrorHandler } from '../../common/apiHelpers';
import { useSwitchActiveCompany } from '../user/redux/switchActiveCompany';

export default function SwitchActiveCompanyModal({ show, onHide }) {
  const { user, fetchUser } = useFetchUser();
  const { switchActiveCompany } = useSwitchActiveCompany();
  const unauthorizedErrorHandler = useUnauthorizedErrorHandler();

  const handleSwitchCompany = useCallback(
    companyId => () => {
      onHide();
      switchActiveCompany({companyId})
        .then(() => fetchUser())
        .catch(unauthorizedErrorHandler);
    },[onHide, switchActiveCompany, fetchUser, unauthorizedErrorHandler]
  );

  return (
    <Modal
      className="common-switch-active-company-modal modal-mobile-slide-from-bottom"
      centered
      show={show}
      onHide={onHide}
    >
      <Modal.Body>
        {user?.all_companies?.map(({ id, name, logo}, key) => (
          <Row className={clsx("company-item mrm-py-0_5", {'active': id === user.company_id})} key={key} onClick={handleSwitchCompany(id)}>
            <Col xs={2} className="m-auto">
              {logo
                ? <img src={logo} alt="company-avatar" />
                : <span>{name.toUpperCase()[0]}</span>
              }
            </Col>
            <Col xs={8}>
              <h1>{name}</h1>
            </Col>
            <Col xs={2} className="m-auto">
              {id === user.company_id && <FontAwesomeIcon icon={faCheckCircle} className="text-primary" />}
            </Col>
          </Row>
        ))}
      </Modal.Body>
    </Modal>
  );
};

SwitchActiveCompanyModal.propTypes = {};
SwitchActiveCompanyModal.defaultProps = {};
