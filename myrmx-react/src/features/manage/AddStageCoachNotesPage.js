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

import { Header, DesktopHeader, Loader } from '../common';
import { useFetchRoadmapStages } from '../roadmap/redux/hooks';
import { useUpdateStage } from './redux/hooks';
import { useUnauthorizedErrorHandler } from '../../common/apiHelpers';
import { useFetchUser } from '../user/redux/hooks';
import useEffectiveBackLink from '../common/useEffectiveBackLinkHook';

const schema = yup.object().shape({
  coach_notes: yup.string()
})

export default function AddStageCoachNotesPage() {
  const { roadmapId, stageId } = useParams()
  const history = useHistory()
  const { stages, fetchRoadmapStages } = useFetchRoadmapStages()
  const { updateStage, updateStagePending } = useUpdateStage()
  const unauthorizedErrorHandler = useUnauthorizedErrorHandler()
  const { replaceStringWithSynonyms } = useFetchUser()

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
  const handleSaveClick = useCallback(({ coach_notes }) => {
    updateStage({ roadmap: roadmapId, stage: stageId, coach_notes})
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
    <div className="manage-add-stage-coach-notes-page">
      <Header
        icon="back"
        title={replaceStringWithSynonyms('Notes for Coach')}
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
              <h2 className="text-center mrm-my-2">{(stageId && stage && stage.coach_notes) ? 'Edit Stage Notes' : 'Add Stage Notes' }</h2>
            </Col>
            <Col xs={1}>
              {renderSaveButton()}
            </Col>
          </Row>
        </Container>
      </DesktopHeader>

      { updateStagePending && <Loader /> }

      <Form className='mrm-p-1 container normal-width-container'>
        <Form.Group controlId='coach_notes'>
          <Form.Control
            name='coach_notes'
            as="textarea"
            defaultValue={(stageId && stage) ? stage.coach_notes : undefined }
            isInvalid={errors.coach_notes}
            ref={register}
            placeholder='Add notes for coach'
            rows={4}
          />
        </Form.Group>
      </Form>

    </div>
  );
};

AddStageCoachNotesPage.propTypes = {};
AddStageCoachNotesPage.defaultProps = {};
