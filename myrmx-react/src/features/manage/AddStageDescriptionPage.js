import React, { useCallback, useEffect } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Header, Loader, DesktopHeader } from '../common';
import { useFetchRoadmapStages } from '../roadmap/redux/hooks';
import { useUpdateStage } from './redux/hooks';
import { useUnauthorizedErrorHandler } from '../../common/apiHelpers';
import useEffectiveBackLink from '../common/useEffectiveBackLinkHook';

const schema = yup.object().shape({
  description: yup.string()
})

export default function AddStageDescriptionPage() {
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
  const handleSaveClick = useCallback(({ description }) => {
    updateStage({ roadmap: roadmapId, stage: stageId, description})
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
    <div className="manage-add-stage-description-page">
      <Header
        icon="back"
        title="Stage Description"
        renderThirdColumn={renderSaveButton}
        thirdColumnClass="text-right"
        colSizes={['auto', undefined , 'auto']}
        border
        renderBackLink={renderBackLink}
        defaultBackLink={defaultBackLink}
      />
      <DesktopHeader replacePrimaryContent={true}>
        <Container>
          <Row>
            <Col xs={1}>
              <Link className="btn-cancel" to={defaultBackLink}>
                <Button  variant="gray">
                  Cancel
                </Button>
              </Link>
            </Col>
            <Col xs={10}>
              <h2 className="text-center mrm-my-2">{(stageId && stage && stage.description) ? 'Edit Description' : 'Add Description' }</h2>
            </Col>
            <Col xs={1}>
              {renderSaveButton()}
            </Col>
          </Row>
        </Container>
      </DesktopHeader>

      { updateStagePending && <Loader /> }

      <Form className='mrm-p-1 container normal-width-container'>
        <Form.Group controlId='description'>
          <Form.Control
            name='description'
            as="textarea"
            defaultValue={(stageId && stage) ? stage.description : undefined }
            isInvalid={errors.description}
            ref={register}
            placeholder='Add description'
            rows={4}
          />
        </Form.Group>
      </Form>

    </div>
  );
};

AddStageDescriptionPage.propTypes = {};
AddStageDescriptionPage.defaultProps = {};
