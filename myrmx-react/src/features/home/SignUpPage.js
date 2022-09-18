import React, { useEffect, useState, useCallback } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
// import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import Toast from 'react-bootstrap/Toast';
import qs from 'qs';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faAt, faSchool, faLockAlt } from '@fortawesome/pro-duotone-svg-icons';

import Header from '../common/Header.js';
import { prepareErrorMessage } from '../common/uiHelpers';
import usePrivateLabelledSettings from '../common/usePrivateLabelledSettingsHook';
import { useRegisterAccount } from './redux/hooks';
import { clearAuthToken } from './redux/fetchAuthToken';

function SignUpForm({isLoading, validated, handleSubmit, schoolFieldAvailable, signupCompanyName}) {
  const [formState, setFormState] = useState({});

  const handleFormFieldChange = event => {
    const updatedFormState = Object.assign({}, formState);
    updatedFormState[event.target.id] = event.target.value;
    setFormState(updatedFormState);
  }

  return (<Row>
    {isLoading ? (
      <Col className="text-center">
        <Spinner animation="border" role="status">
          <span className="sr-only">Submitting...</span>
        </Spinner>
      </Col>
    ) : (
      <Col className="mrm-mt-0_5">
        {/*<h1 className="mrm-mb-2_5">{signupCompanyName ? `${signupCompanyName} Sign up` : "Sign up"}</h1>*/}
        <Form
          className="mrm-mb-1_5"
          noValidate
          validated={validated}
          onSubmit={event => handleSubmit(event, formState)}
        >
          <Form.Group controlId="formFirstName">
            <FontAwesomeIcon icon={faUserCircle} />
            <Form.Control
              required type="text" placeholder="First Name"
              value={formState.formFirstName || ''} onChange={handleFormFieldChange}
            />
          </Form.Group>
          <Form.Group controlId="formLastName">
            <FontAwesomeIcon icon={faUserCircle} />
            <Form.Control
              required type="text" placeholder="Last Name"
              value={formState.formLastName || ''} onChange={handleFormFieldChange}
            />
          </Form.Group>
          <Form.Group controlId="formEmail">
            <FontAwesomeIcon icon={faAt} />
            <Form.Control
              required type="email" placeholder="Email"
              value={formState.formEmail || ''} onChange={handleFormFieldChange}
            />
          </Form.Group>
          <Form.Group controlId="formPassword">
            <FontAwesomeIcon icon={faLockAlt} />
            <Form.Control
              required type="password" placeholder="Password"
              value={formState.formPassword || ''} onChange={handleFormFieldChange}
            />
          </Form.Group>
          {schoolFieldAvailable && <Form.Group controlId="formSchool">
            <FontAwesomeIcon icon={faSchool} />
            <Form.Control
              type="text" placeholder="School (optional)"
              value={formState.formSchool || ''} onChange={handleFormFieldChange}
            />
          </Form.Group>}
          <Button className="btn-100" variant="primary" type="submit">
            Sign up
          </Button>
        </Form>
        <p className="legal-info text-center">
          Already have an account? <Link to="/log-in" className="text-primary">Log in</Link>
        </p>
        <p className="legal-info">
          By signing up, you confirm you've read and accepted the <strong><a className="legal-link" target="blank" href="https://www.myroadmap.io/#/terms-of-service">Terms of Service</a></strong> and <strong><a className="legal-link" target="blank" href="https://www.myroadmap.io/#/privacy-statement">Privacy Policy</a></strong>
        </p>
      </Col>
    )}
  </Row>);
}

export default function SignUpPage() {
  const [validated, setValidated] = useState(false);
  const location  = useLocation();

  const {
    authToken,
    userApproved,
    registerAccount,
    registerAccountPending,
    registerAccountError,
    dismissRegisterAccountError
  } = useRegisterAccount();

  const [userLoggedIn, setUserLoggedIn] = useState(authToken && userApproved);

  const history = useHistory();
  const dispatch = useDispatch();
  const privateLabelledSettings = usePrivateLabelledSettings();
  const queryParams = qs.parse(location.search.slice(1));

  const coachSignUp = queryParams['is-coach'] && queryParams['is-coach'].toLowerCase() === 'true';
  let signupCompanyName = privateLabelledSettings.signupCompanyNameField;
  if (!signupCompanyName && queryParams['company-name']) signupCompanyName = queryParams['company-name'];

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (authToken) {
      if (userApproved) {
        if (coachSignUp && userLoggedIn) {
          dispatch(clearAuthToken(() => setUserLoggedIn(false)));
        } else {
          history.push(queryParams.next || '/dashboard');
        }
      } else {
        history.push({
          pathname: '/user-not-approved',
          state: {
            pathname: history.location.pathname
          }
        });
      }
    }
  }, [authToken, userApproved, coachSignUp, userLoggedIn, dispatch, history, queryParams]);

  const handleSubmit = useCallback((event, formState) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();

    if (form.checkValidity()) {
      const data = {
        first_name: formState.formFirstName,
        last_name: formState.formLastName,
        email: formState.formEmail,
        password: formState.formPassword,
        company_name: signupCompanyName,
      };
      if (privateLabelledSettings.signupSchoolFieldAvailable && formState.formSchool) {
        data.school = formState.formSchool; 
      }

      if (coachSignUp) {
        data.is_coach = true
      }

      registerAccount(data).catch(() => {
        console.log('Error sign up account');
      });
    }

    setValidated(true);
  }, [
    registerAccount,
    privateLabelledSettings,
    coachSignUp,
    signupCompanyName,
  ]);

  const errorMessage = registerAccountError ? prepareErrorMessage(registerAccountError) : null;

  return (
    <div className="home-sign-up-page blue">
      <Header
        border
        icon="back"
        colSizes={[2,8,2]}
        title="Sign up"
        defaultBackLink="/welcome"
      />
      <Container className="entry">
        <Row className="justify-content-center">
          <Col xs={12} className="d-lg-none">
            <SignUpForm
              isLoading={registerAccountPending || authToken}
              validated={validated}
              handleSubmit={handleSubmit}
              schoolFieldAvailable={privateLabelledSettings.signupSchoolFieldAvailable}
              signupCompanyName={signupCompanyName}
            />
          </Col>
          <Col lg={4} className="d-none d-lg-block desktop-form-container">
            <h1 className="mrm-my-1 text-center">Sign up</h1>
            <SignUpForm
              isLoading={registerAccountPending || authToken}
              validated={validated}
              handleSubmit={handleSubmit}
              schoolFieldAvailable={privateLabelledSettings.signupSchoolFieldAvailable}
              signupCompanyName={signupCompanyName}
            />
          </Col>
          <Col xs={12}>
            <Toast
              onClose={() => dismissRegisterAccountError()}
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

SignUpPage.propTypes = {};
SignUpPage.defaultProps = {};
