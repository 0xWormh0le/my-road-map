import React, { useCallback, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Header, Loader } from '../common';
import { useAddRoadmap } from './redux/hooks';
import { useFetchUser } from '../user/redux/hooks';
import useEffectiveBackLink from '../common/useEffectiveBackLinkHook';

const schema = yup.object().shape({
  title: yup.string().required(),
  description: yup.string()
})

const fields = [
  { type: 'string', label: 'Roadmap Name', name: 'title' },
  { type: 'text', label: 'Description', name: 'description' }
]

function AddRoadmapForm({ onRoadmapCreated, setSaveButtonProps }) {
  const { addRoadmap, addRoadmapPending } = useAddRoadmap()
  const { user } = useFetchUser()

  const { register, handleSubmit, errors, setError } = useForm({
    resolver: yupResolver(schema)
  })

  const handleError = useCallback(
    err => Object.keys(err).forEach(key => {
      const errors = err[key]
      if (errors.length) {
        setError(key, { message: errors[0], type: 'remote' })
      }
    }),
    [setError]
  )

  const handleSaveClick = useCallback(values => {
    if (user) {
      addRoadmap({...values, company: user.company_id})
        .then(res => onRoadmapCreated(res.id))
        .catch(e => handleError(e.response.data))
    }
  }, [user, addRoadmap, onRoadmapCreated, handleError])

  useEffect(() => setSaveButtonProps({
    disabled: addRoadmapPending,
    onClick: handleSubmit(handleSaveClick),
  }), [
    setSaveButtonProps,
    addRoadmapPending,
    handleSubmit,
    handleSaveClick,
  ])

  return (<>
    {addRoadmapPending && <Loader />}
    {!addRoadmapPending && fields.map(({ type, name, label }) => (
      <Form.Group controlId={name} key={name}>
        <Form.Label>
          {label}
        </Form.Label>
        { type === 'string' ? (
          <Form.Control
            name={name}
            defaultValue=""
            isInvalid={errors[name]}
            ref={register}
          />
        ) : (
          <Form.Control
            name={name}
            as="textarea"
            defaultValue=""
            isInvalid={errors[name]}
            ref={register}
          />
        )
        }
        {errors[name] && errors[name].type === 'remote' && (
          <small className="error-message">
            {errors[name].message}
          </small>
        )}
      </Form.Group>
    ))}
  </>);
}

export function AddRoadmapModal({show, onHide}) {
  const [saveButtonProps, setSaveButtonProps] = useState({})

  const { addRoadmapPending } = useAddRoadmap();

  const onRoadmapCreated = useCallback(createdRoadmapId => onHide(createdRoadmapId), [ onHide ]);

  return (<Modal show={show} onHide={onHide} centered>
    <Modal.Header>
      {!addRoadmapPending && <>
        <Button variant="secondary" onClick={() => onHide()} className="font-weight-bold">
          Cancel
        </Button>
        <h2 className="mrm-mt-1">Add Roadmap</h2>
        <Button {...saveButtonProps}>
          Create
        </Button>
      </>}
    </Modal.Header>
    <Modal.Body>
      <AddRoadmapForm
        onRoadmapCreated={onRoadmapCreated}
        setSaveButtonProps={setSaveButtonProps}
      />
    </Modal.Body>
  </Modal>)
}

export default function AddRoadmapPage() {
  const [saveButtonProps, setSaveButtonProps] = useState({})

  const history = useHistory()

  const defaultBackLink = '/manage/roadmaps/';
  const effectiveBackLink = useEffectiveBackLink(defaultBackLink);

  const onRoadmapCreated = useCallback(() => {
    history.push(effectiveBackLink);
  }, [ history, effectiveBackLink ]);

  const renderBackLink = useCallback((effectiveBackLink) => (
    <Link to={effectiveBackLink}>
      <Button className="btn-cancel" variant="white" >
        Cancel
      </Button>
    </Link>
  ), [])

  const renderSaveButton = useCallback(() => (
    <Button
      className="btn-save"
      variant="white"
      {...saveButtonProps}
    >
      Create
    </Button>
  ), [ saveButtonProps ])

  return (
    <div className="manage-add-roadmap-page">
      <Header
        icon="back"
        title="Add Roadmap"
        renderThirdColumn={renderSaveButton}
        thirdColumnClass="text-right"
        colSizes={[3, 6, 3]}
        border
        renderBackLink={renderBackLink}
        defaultBackLink={defaultBackLink}
      />
      <AddRoadmapForm
        onRoadmapCreated={onRoadmapCreated}
        setSaveButtonProps={setSaveButtonProps}
      />
    </div>
  );
};

AddRoadmapPage.propTypes = {};
AddRoadmapPage.defaultProps = {};
