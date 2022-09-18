import React, { useCallback, useEffect } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Header, Loader } from '../common';
import { useAddStage } from './redux/hooks';
import useEffectiveBackLink from '../common/useEffectiveBackLinkHook';

const schema = yup.object().shape({
  title: yup.string().required()
})

export default function AddStagePage() {
  const { roadmapId } = useParams()
  const history = useHistory()
  const { addStage, addStagePending } = useAddStage()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

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

  const defaultBackLink = `/manage/roadmaps/${roadmapId}`;
  const effectiveBackLink = useEffectiveBackLink(defaultBackLink);
  const handleSaveClick = useCallback(({ title }) => {
    addStage({ roadmap: roadmapId, title})
      .then(() => history.push(effectiveBackLink))
      .catch(e => handleError(e.response.data))
  }, [roadmapId, history, addStage, handleError, effectiveBackLink])

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
      disabled={addStagePending}
      onClick={handleSubmit(handleSaveClick)}
    >
      Create
    </Button>
  ), [handleSaveClick, handleSubmit, addStagePending])

  return (
    <div className="manage-add-stage-page">
      <Header
        icon="back"
        title="Add Stage"
        renderThirdColumn={renderSaveButton}
        thirdColumnClass="text-right"
        colSizes={[3, 6, 3]}
        border
        renderBackLink={renderBackLink}
        defaultBackLink={defaultBackLink}
      />

      { addStagePending && <Loader /> }

      <Form className='mrm-p-1'>
        <Form.Group controlId='title'>
          <Form.Label>Stage Name</Form.Label>
          <Form.Control
            name='title'
            defaultValue={undefined}
            isInvalid={errors.title}
            ref={register}
          />
        </Form.Group>
      </Form>

    </div>
  );
};

AddStagePage.propTypes = {};
AddStagePage.defaultProps = {};
