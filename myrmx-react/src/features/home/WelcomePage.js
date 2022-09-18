import React, { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import usePrivateLabelledSettings from '../common/usePrivateLabelledSettingsHook';

import { useFetchAuthToken } from './redux/hooks';

export default function WelcomePage() {
  const { authToken } = useFetchAuthToken();
  const history = useHistory();
  const privateLabelledSettings = usePrivateLabelledSettings();

  useEffect(() => {
    if (authToken) history.push('/dashboard');
  }, [authToken, history]);

  if (authToken) {
    return null
  }

  return (
    <Container className="welcome entry welcome-page">
      <Row className="align-items-center h-100">
        <Col xs="12">
          <h1 className="text-center mb-3">Welcome to {privateLabelledSettings.welcomePageCompanyName}</h1>
          <Link to="/sign-up">
            <Button className="mb-3" variant="primary" size="lg">
              Sign up
            </Button>
          </Link>
          <Link to="/log-in">
            <Button variant="white" size="lg">
              Log in
            </Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
}
