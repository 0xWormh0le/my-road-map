import React, { useCallback, useEffect } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Header, Loader } from '../common';
import { useFetchStageCompetencies } from '../roadmap/redux/hooks';
import { useFetchUser } from '../user/redux/hooks';
import { useUnauthorizedErrorHandler } from '../../common/apiHelpers';
import { useUpdateCompetency } from './redux/hooks';
import useEffectiveBackLink from '../common/useEffectiveBackLinkHook';

const schema = yup.object().shape({
  coach_notes: yup.string().nullable()
})

export default function AddCompetencyCoachNotesPage() {
  const { roadmapId, stageId, competencyId } = useParams()
  const history = useHistory()
  const unauthorizedErrorHandler = useUnauthorizedErrorHandler()
  const { competencies, fetchStageCompetencies, fetchStageCompetenciesPending } = useFetchStageCompetencies()
  const { updateCompetency, updateCompetencyPending } = useUpdateCompetency()
  const { user } = useFetchUser()
  
  const competency = competencies && competencyId ? competencies[competencyId] : null

  const { register, handleSubmit, errors, setError } = useForm({
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (!roadmapId || !stageId || !user) {
      return
    }
    fetchStageCompetencies({ roadmapId, userId: user.id, stageId }).catch(unauthorizedErrorHandler)
  }, [roadmapId, stageId, user, fetchStageCompetencies, unauthorizedErrorHandler])

  const handleError = useCallback(
    err => Object.keys(err).forEach(key => {
      const errors = err[key]
      if (errors.length) {
        setError(key, { message: errors[0], type: 'remote' })
      }
    }),
    [setError]
  )

  const defaultBackLink = `/manage/roadmaps/${roadmapId}/stages/${stageId}/competencies/${competencyId}`;
  const effectiveBackLink = useEffectiveBackLink(defaultBackLink);
  const handleSaveClick = useCallback(({ coach_notes }) => {
    updateCompetency({ roadmap: roadmapId, stage: stageId, competency: competencyId, coach_notes})
      .then(() => history.push(effectiveBackLink))
      .catch(e => handleError(e.response.data))
  }, [roadmapId, stageId, competencyId, history, updateCompetency, handleError, effectiveBackLink])

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
      disabled={updateCompetencyPending}
      onClick={handleSubmit(handleSaveClick)}
    >
      Save
    </Button>
  ), [handleSaveClick, handleSubmit, updateCompetencyPending])

  return (
    <div className="manage-add-competency-coach-notes-page">
      <Header
        icon="back"
        title="Notes for Coach"
        renderThirdColumn={renderSaveButton}
        thirdColumnClass="text-right"
        colSizes={['auto', undefined , 'auto']}
        border
        renderBackLink={renderBackLink}
        defaultBackLink={defaultBackLink}
      >
        {competency && (
          <div className="d-flex align-items-center justify-content-center mt-3">
            <strong className='mrm-ml-0_75'>{competency.title}</strong>
          </div>
        )}
      </Header>
      { (fetchStageCompetenciesPending || updateCompetencyPending) && <Loader /> }
      <Form className='mrm-p-1'>
        <Form.Group controlId='coach_notes'>
          <Form.Label>
            Coach Notes
          </Form.Label>
          <Form.Control
            name='coach_notes'
            as="textarea"
            defaultValue={competency ? competency.coach_notes : undefined }
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

AddCompetencyCoachNotesPage.propTypes = {};
AddCompetencyCoachNotesPage.defaultProps = {};
