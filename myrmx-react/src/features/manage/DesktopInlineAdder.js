import React, { useState, useCallback, useRef, useEffect } from 'react';
// import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { faSpinnerThird } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function DesktopInlineAdder({ maxLength, onCancel, onAdd, loading }) {
  const [submitDisabled, setSubmitDisabled] = useState(true)

  const formRef = useRef()
  const formInputRef = useRef()

  const handleUpdateSubmitState = e => setSubmitDisabled(!e.target.value)

  const handleSubmit = useCallback(event => {
    event.preventDefault();
    event.stopPropagation();
    const form = formRef.current;
    if (form.checkValidity()) onAdd(form.elements.value.value);
  }, [ onAdd ])

  const handleInputKeyDown = useCallback(e => {
    if (e.which === 13) { // Enter
      handleSubmit(e)
    } else if (e.which === 27) { // Esc
      onCancel()
    }
  }, [handleSubmit, onCancel])

  useEffect(() => {
    if (formInputRef.current) formInputRef.current.focus();
  }, [])

  return (
    <div className="manage-desktop-inline-adder">
      <Form
        noValidate
        ref={formRef}
        onSubmit={handleSubmit}
      >
        <Form.Group className="flex-fill" controlId="value">
          <Form.Control
            required
            onKeyDown={handleInputKeyDown}
            onChange={handleUpdateSubmitState}
            maxLength={maxLength}
            ref={formInputRef}
            disabled={loading}
          />
        </Form.Group>
        <Button disabled={submitDisabled || loading} variant="primary" type="submit">
          {loading && <FontAwesomeIcon icon={faSpinnerThird} className='mr-2' size='xs' spin />}
          Add
        </Button>
        <Button disabled={loading} variant="secondary" onClick={onCancel}>Cancel</Button>
      </Form>
    </div>
  );
};

DesktopInlineAdder.propTypes = {};
DesktopInlineAdder.defaultProps = {};
