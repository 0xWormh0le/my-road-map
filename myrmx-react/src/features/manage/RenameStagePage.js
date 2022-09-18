import React, { useCallback, useEffect } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Header, Loader } from '../common';
import { useFetchRoadmapStages } from '../roadmap/redux/hooks';
import { useUpdateStage } from './redux/hooks';
import { useUnauthorizedErrorHandler } from '../../common/apiHelpers';
import useEffectiveBackLink from '../common/useEffectiveBackLinkHook';

const schema = yup.object().shape({
  title: yup.string().required()
})

export default function RenameStagePage() {
  const { roadmapId, stageId } = useParams()
  const history = useHistory()
  const { stages, fetchRoadmapStages } = useFetchRoadmapStages()
  const { updateStage, updateStagePending } = useUpdateStage()
  const unauthorizedErrorHandler = useUnauthorizedErrorHandler()
  
  const stage = (stageId && Object.keys(stages.length !== 0)) ? stages[stageId] : null
  
  const { register, handleSubmit, errors, setError } = useForm({
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    if (roadmapId) {
      fetchRoadmapStages({ roadmapId })
      .catch(unauthorizedErrorHandler)
    }
  }, [
    roadmapId, 
    fetchRoadmapStages, 
    unauthorizedErrorHandler
  ])

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
    updateStage({ roadmap: roadmapId, stage: stageId, title})
      .then(() => history.push(effectiveBackLink))
      .catch(e => handleError(e.response.data))
  }, [roadmapId, stageId, history, updateStage, handleError, effectiveBackLink])

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
      disabled={updateStagePending}
      onClick={handleSubmit(handleSaveClick)}
    >
      Save
    </Button>
  ), [handleSaveClick, handleSubmit, updateStagePending])

  return (
    <div className="manage-rename-stage-page">
      <Header
        icon="back"
        title="Rename Stage"
        renderThirdColumn={renderSaveButton}
        thirdColumnClass="text-right"
        colSizes={[3, 6, 3]}
        border
        renderBackLink={renderBackLink}
        defaultBackLink={defaultBackLink}
      />

      { updateStagePending && <Loader /> }

      <Form className='mrm-p-1'>
        <Form.Group controlId='title'>
          <Form.Label>Stage Name</Form.Label>
          <Form.Control
            name='title'
            defaultValue={(stageId && stage) ? stage.title : undefined }
            isInvalid={errors.title}
            ref={register}
          />
        </Form.Group>
      </Form>
    </div>
  );
};

RenameStagePage.propTypes = {};
RenameStagePage.defaultProps = {};
