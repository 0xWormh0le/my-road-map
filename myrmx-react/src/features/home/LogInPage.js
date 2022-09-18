import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import { useFetchAuthToken } from './redux/hooks';
import { Link, useHistory, useLocation } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import Toast from 'react-bootstrap/Toast';
import qs from 'qs';

import Header from '../common/Header.js';
import { prepareErrorMessage } from '../common/uiHelpers';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAt, faLockAlt } from '@fortawesome/pro-duotone-svg-icons';
import usePrivateLabelledSettings from '../common/usePrivateLabelledSettingsHook';

function LogInForm({ isLoading, validated, handleSubmit }) {
  const [formState, setFormState] = useState({});

  const handleFormFieldChange = event => {
    const updatedFormState = Object.assign({}, formState);
    updatedFormState[event.target.id] = event.target.value;
    setFormState(updatedFormState);
  }

  return (<>
    {isLoading ? (
      <Col className="text-center">
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </Col>
    ) : (
      <Col>
        <Form
          className="mrm-mb-1_5"
          validated={validated}
          onSubmit={event => handleSubmit(event, formState)}
          noValidate
        >
          <Form.Group controlId="formEmail">
            <FontAwesomeIcon icon={faAt} />
            <Form.Control
              required
              type="email"
              placeholder="Email"
              value={formState.formEmail || ''}
              onChange={handleFormFieldChange}
            />
          </Form.Group>
          <Form.Group controlId="formPassword">
            <FontAwesomeIcon icon={faLockAlt} />
            <Form.Control
              required
              type="password"
              placeholder="Password"
              value={formState.formPassword || ''}
              onChange={handleFormFieldChange}
            />
          </Form.Group>
          <Button className="btn-100" variant="primary" type="submit">
            Log in
          </Button>
        </Form>
        <p className="legal-info">
          <Link to="/forgot-password">Forgot password?</Link>
        </p>
        <p className="legal-info">
          Don't have an account? <Link to="/sign-up" className="text-primary">Sign up</Link>
        </p>
      </Col>
    )}
  </>);
}

export default function LogInPage() {
  const [validated, setValidated] = useState(false);

  const { loginCompanyNameField } = usePrivateLabelledSettings();

  const {
    authToken,
    userApproved,
    fetchAuthToken,
    fetchAuthTokenPending,
    fetchAuthTokenError,
    dismissFetchAuthTokenError,
  } = useFetchAuthToken();
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (authToken) {
      if (userApproved) {
        const queryParams = qs.parse(location.search.slice(1))
        history.push(queryParams.next || '/dashboard')
      } else {
        history.push({
          pathname: '/user-not-approved',
          state: {
            pathname: history.location.pathname
          }
        });
      }
    }
  }, [authToken, userApproved, location, history]);

  const handleSubmit = (event, formState) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity()) {
      const fetchArgs = {
        email: formState.formEmail,
        password: formState.formPassword,
      };
      if (loginCompanyNameField) fetchArgs.company_name = loginCompanyNameField;
      fetchAuthToken(fetchArgs).catch(() => {
        console.warn('Error fetching auth token');
      });
    }
    setValidated(true);
  };

  const errorMessage = fetchAuthTokenError ? prepareErrorMessage(fetchAuthTokenError) : undefined;

  return (
    <div className="home-log-in-page blue">
      <Header
        border
        icon="back"
        colSizes={[2,8,2]}
        title="Login"
        defaultBackLink="/welcome"
      />
      <Container className="entry">
        <Row className="justify-content-center">
          <Col xs={12} className="d-lg-none">
            <Row className="mt-5">
              <LogInForm
                handleSubmit={handleSubmit}
                isLoading={fetchAuthTokenPending || authToken}
                validated={validated}
              />
            </Row>
          </Col>
          <Col lg={4} className="d-none d-lg-block desktop-form-container">
            <h1 className="mrm-my-1 text-center">Log in</h1>
            <Row className="mt-3">
              <LogInForm
                handleSubmit={handleSubmit}
                isLoading={fetchAuthTokenPending || authToken}
                validated={validated}
              />
            </Row>
          </Col>
          <Col xs={12}>
            <Toast
              onClose={() => dismissFetchAuthTokenError()}
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

LogInPage.propTypes = {};
LogInPage.defaultProps = {};
