import React, { useState } from 'react';
// import PropTypes from 'prop-types';
import { useHistory, useParams } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import Toast from 'react-bootstrap/Toast';

import Header from '../common/Header.js';
import { prepareErrorMessage } from '../common/uiHelpers';

import { useConfirmResetPassword } from './redux/hooks';

export default function ResetPasswordPage() {
  const [validated, setValidated] = useState(false);
  const {
    confirmResetPassword,
    confirmResetPasswordPending,
    confirmResetPasswordError,
    dismissConfirmResetPasswordError
  } = useConfirmResetPassword();
  const history = useHistory();
  const { uid, token } = useParams();

  const handleSubmit = event => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();
      event.stopPropagation();
      confirmResetPassword({
        new_password1: form.elements.formPassword.value,
        new_password2: form.elements.formConfirmPassword.value,
        uid,
        token
      })
        .then(res => {
          history.push('/log-in');
        })
        .catch(() => {
          console.log('Error resetting password');
        })
    }

    setValidated(true);
  }

  const errorMessage = confirmResetPasswordError ? prepareErrorMessage(confirmResetPasswordError) : undefined;

  return (
    <div className="home-reset-password-page blue">
      <Header icon="close" defaultBackLink="/log-in" />
      <Container className="entry">
        <div className="d-lg-none">
          <Row>
            <Col className="mrm-mb-3 mrm-mt-1">
              <h1>Set/Reset password</h1>
            </Col>
          </Row>
          <Row>
            {confirmResetPasswordPending ? (
              <Col className="text-center">
                <Spinner animation="border" role="status">
                  <span className="sr-only">Changing password...</span>
                </Spinner>
              </Col>
            ) : (
              <Col>
                <Form className="mrm-mb-2" noValidate validated={validated} onSubmit={handleSubmit}>
                  <Form.Group controlId="formPassword">
                    <Form.Control required type="password" placeholder="New Password" />
                  </Form.Group>
                  <Form.Group controlId="formConfirmPassword">
                    <Form.Control required type="password" placeholder="Confirm Password" />
                  </Form.Group>
                  <Button className="btn-100" variant="primary" type="submit">
                    Change my password
                  </Button>
                </Form>
              </Col>
            )}
          </Row>
        </div>
        <Col lg={4} className="d-none d-lg-block desktop-form-container mrm-mt-6 mx-auto">
            <h1 className="mrm-my-1 text-center">Set/Reset password</h1>
            <div className="mt-3">
              <Form className="mrm-mb-2" noValidate validated={validated} onSubmit={handleSubmit}>
                  <Form.Group controlId="formPassword">
                    <Form.Control required type="password" placeholder="New Password" />
                  </Form.Group>
                  <Form.Group controlId="formConfirmPassword">
                    <Form.Control required type="password" placeholder="Confirm Password" />
                  </Form.Group>
                  <Button className="btn-100" variant="primary" type="submit">
                    Change my password
                  </Button>
                </Form>
            </div>
          </Col>
        <Row>
          <Col>
            <Toast
              onClose={() => dismissConfirmResetPasswordError()}
              show={!!errorMessage}
              delay={3000}
              autohide
            >
              <Toast.Header>
                <strong className="mr-auto text-danger">Error</strong>
              </Toast.Header>
              <Toast.Body>{errorMessage}</Toast.Body>
            </Toast>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

ResetPasswordPage.propTypes = {};
ResetPasswordPage.defaultProps = {};
