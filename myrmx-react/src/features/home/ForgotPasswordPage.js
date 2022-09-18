import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
// import PropTypes from 'prop-types';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Toast from 'react-bootstrap/Toast';

import Header from '../common/Header.js';
import { prepareErrorMessage } from '../common/uiHelpers';

import { useResetPassword } from './redux/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAt, faSpinnerThird } from '@fortawesome/pro-duotone-svg-icons';
import { faChevronLeft } from '@fortawesome/pro-regular-svg-icons';

function ForgotPasswordForm({ isLoading, validated, handleSubmit }) {
  return (<Row>
    <Col>
      <h1 className="mrm-my-1 text-center">Forgot password</h1>
      <p className="reset-instructions">
        Enter your email address and we’ll send you a link to reset your password
      </p>
      <Form
        noValidate
        validated={validated}
        onSubmit={handleSubmit}
        className="mrm-mb-1_5"
      >
        <Form.Group controlId="formEmail">
          <FontAwesomeIcon icon={faAt} />
          <Form.Control required type="email" placeholder="Email" />
        </Form.Group>
        <Button
          className="btn-100"
          variant="primary"
          type="submit"
          disabled={isLoading}
        >
          {isLoading && (
            <FontAwesomeIcon
              icon={faSpinnerThird}
              size="xs"
              className="mrm-mr-0_25"
              spin
            />
          )}
          Send Instructions
        </Button>
      </Form>
    </Col>
  </Row>);
}

export default function ForgotPasswordPage() {
  const [validated, setValidated] = useState(false);
  const {
    resetPassword,
    resetPasswordPending,
    resetPasswordError,
    dismissResetPasswordError
  } = useResetPassword();
  const history = useHistory();

  const handleSubmit = event => {
    const form = event.currentTarget;
    
    event.preventDefault();
    event.stopPropagation();

    if (form.checkValidity()) {
      resetPassword({
        email: form.elements.formEmail.value
      }).then(() => {
        alert('Reset password email has been sent.');
        history.push('/log-in');
      }).catch(() => {
        console.warn('Error sending email to reset password');
      });
    }

    setValidated(true);
  };

  const errorMessage = resetPasswordError ? prepareErrorMessage(resetPasswordError) : undefined;

  return (
    <div className="home-forgot-password-page blue">
      <Header border icon="close" defaultBackLink="/log-in" />
      <Container className="entry">
        <Row className="justify-content-center">
          <Col xs={12} className="d-lg-none">
            <ForgotPasswordForm
              isLoading={resetPasswordPending}
              handleSubmit={handleSubmit}
              validated={validated}
            />
          </Col>
          <Col xs={4} className="d-none d-lg-block">
            <p className="back-button-container">
              <Link to="log-in">
                <Button variant="white">
                  <FontAwesomeIcon icon={faChevronLeft} />
                  Back to Log In
                </Button>
              </Link>
            </p>
            <div className="d-none d-lg-block desktop-form-container">
              <ForgotPasswordForm
                isLoading={resetPasswordPending}
                handleSubmit={handleSubmit}
                validated={validated}
              />
            </div>
          </Col>
          <Col xs={12}>
            <Toast
              onClose={() => dismissResetPasswordError()}
              show={!!errorMessage}
              delay={3000}
              autohide
              className="mx-auto"
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
}

ForgotPasswordPage.propTypes = {};
ForgotPasswordPage.defaultProps = {};
