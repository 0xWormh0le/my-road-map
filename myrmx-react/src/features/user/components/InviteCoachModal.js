import React, { useCallback } from 'react';
// import PropTypes from 'prop-types';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinnerThird } from '@fortawesome/pro-duotone-svg-icons';
import { faEnvelope } from '@fortawesome/pro-regular-svg-icons';

import { useFetchUser, useInviteCoach } from '../redux/hooks';

const schema = yup.object().shape({
  email: yup.string().email().required()
});

function InviteCoachModalBody(
  {
    onSubmit,
    replaceStringWithSynonyms,
    registerRef,
    errors,
    onHide,
    inviteCoachPending,
  }
) {
  return (<Modal.Body>
    <Form onSubmit={onSubmit}>
      <p className="text-center">
        <strong>
          {replaceStringWithSynonyms('Invite a coach via email')}
        </strong>
      </p>
      <label className="color-secondary">
        {replaceStringWithSynonyms('Working with a coach is a great idea to help you reach your goals.')}
      </label>
      <Form.Group>
        <FontAwesomeIcon icon={faEnvelope} />
        <Form.Control
          placeholder='Enter email address here...'
          ref={registerRef}
          name="email"
          isInvalid={errors.email}
        />
      </Form.Group>
      <div className="d-flex justify-content-between">
        <Button onClick={onHide} variant="white">Cancel</Button>
        <Button type="submit" disabled={inviteCoachPending}>
          {inviteCoachPending && (
            <FontAwesomeIcon icon={faSpinnerThird} className="mrm-mr-0_75" size="xs" spin />
          )}
          Send Invite
        </Button>
      </div>
    </Form>
  </Modal.Body>);
}

export default function InviteCoachModal({ show, onHide }) {
  const { replaceStringWithSynonyms } = useFetchUser();

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema)
  });

  const { inviteCoach, inviteCoachPending } = useInviteCoach();

  const handleInviteCoach = useCallback(values => {
    inviteCoach({ coach_email: values.email})
      .then(() => {
        onHide()
        alert('Invitation has been sent.')
      })
      .catch(e => {
        alert(`Failed to sent an invitation. ${e.message}`)
      })
  }, [inviteCoach, onHide])

  return (<>
    <Modal show={show} onHide={onHide} className="user-components-invite-coach-modal modal-mobile-slide-from-bottom mobile-modal d-lg-none">
      <InviteCoachModalBody
        onSubmit={handleSubmit(handleInviteCoach)}
        replaceStringWithSynonyms={replaceStringWithSynonyms}
        registerRef={register}
        errors={errors}
        onHide={onHide}
        inviteCoachPending={inviteCoachPending}
      />
    </Modal>
    <Modal show={show} onHide={onHide} centered className="user-components-invite-coach-modal d-none d-lg-block">
      <InviteCoachModalBody
        onSubmit={handleSubmit(handleInviteCoach)}
        replaceStringWithSynonyms={replaceStringWithSynonyms}
        registerRef={register}
        errors={errors}
        onHide={onHide}
        inviteCoachPending={inviteCoachPending}
      />
    </Modal>
  </>)
}

InviteCoachModal.propTypes = {};
InviteCoachModal.defaultProps = {};
