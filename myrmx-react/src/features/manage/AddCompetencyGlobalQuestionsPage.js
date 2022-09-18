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
import { useFetchStageCompetencies } from '../roadmap/redux/hooks';
import { useFetchUser } from '../user/redux/hooks';
import { useFetchGlobalQuestions, useAddGlobalQuestion, useUpdateGlobalQuestion } from './redux/hooks';
import { useUnauthorizedErrorHandler } from '../../common/apiHelpers';
import useEffectiveBackLink from '../common/useEffectiveBackLinkHook';

const schema = yup.object().shape({
  question: yup.string().required()
})

export default function AddCompetencyGlobalQuestionsPage() {
  const { roadmapId, stageId, competencyId, questionId } = useParams()
  const history = useHistory()
  const unauthorizedErrorHandler = useUnauthorizedErrorHandler()
  const { competencies, fetchStageCompetencies, fetchStageCompetenciesPending } = useFetchStageCompetencies()
  const { globalQuestions, fetchGlobalQuestions, fetchGlobalQuestionsPending } = useFetchGlobalQuestions()
  const { addGlobalQuestion, addGlobalQuestionPending } = useAddGlobalQuestion()
  const { updateGlobalQuestion, updateGlobalQuestionPending } = useUpdateGlobalQuestion()
  const { user } = useFetchUser()
  
  const competency = competencies && competencyId ? competencies[competencyId] : null
  const question = globalQuestions && questionId ? globalQuestions.find(x => x.id === parseInt(questionId)) : null

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
    if (questionId) { 
      fetchGlobalQuestions({ roadmapId, stageId, competencyId }).catch(unauthorizedErrorHandler)
    }
  }, [
    roadmapId, 
    stageId, 
    competencyId,
    user, 
    questionId,
    fetchGlobalQuestions,
    fetchStageCompetencies, 
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

  const defaultBackLink = `/manage/roadmaps/${roadmapId}/stages/${stageId}/competencies/${competencyId}`;
  const effectiveBackLink = useEffectiveBackLink(defaultBackLink);
  const handleSaveClick = useCallback(({ question }) => {
    if (questionId) {
      updateGlobalQuestion({roadmapId, stageId, competencyId, questionId, question})
        .then(() => history.push(effectiveBackLink))
        .catch(e => handleError(e.response.data))
    } else {
      addGlobalQuestion({roadmapId, stageId, competencyId, question})
        .then(() => history.push(effectiveBackLink))
        .catch(e => handleError(e.response.data))
    }
  }, [
    roadmapId, 
    stageId, 
    competencyId, 
    questionId, 
    history, 
    addGlobalQuestion, 
    updateGlobalQuestion, 
    handleError,
    effectiveBackLink,
  ])

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
      disabled={addGlobalQuestionPending || updateGlobalQuestionPending}
      onClick={handleSubmit(handleSaveClick)}
    >
      Save
    </Button>
  ), [handleSaveClick, handleSubmit, addGlobalQuestionPending, updateGlobalQuestionPending])

  return (
    <div className="manage-add-competency-global-questions-page">
      <Header
        icon="back"
        title={questionId ? 'Edit Question' : 'Add Question'}
        renderThirdColumn={renderSaveButton}
        thirdColumnClass="text-right"
        colSizes={['auto', undefined , 'auto']}
        border
        renderBackLink={renderBackLink}
        defaultBackLink={defaultBackLink}
      >
        {competency && (
          <div className="d-flex align-items-center justify-content-center mrm-mt-1">
            <strong className='mrm-ml-0_75'>{competency.title}</strong>
          </div>
        )}
      </Header>
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
              <h2 className="text-center mrm-my-2">{questionId ? 'Edit Question' : 'Add Question'}</h2>
            </Col>
            <Col xs={1}>
              {renderSaveButton()}
            </Col>
          </Row>
        </Container>
      </DesktopHeader>
      { (fetchStageCompetenciesPending || fetchGlobalQuestionsPending) && <Loader /> }
      <Form className='mrm-p-1 container normal-width-container'>
        <Form.Group controlId='question'>
          <Form.Label>
            Question Text
          </Form.Label>
          <Form.Control
            name='question'
            as="textarea"
            defaultValue={question ? question.question : undefined }
            isInvalid={errors.question}
            ref={register}
            placeholder='Add question'
            rows={4}
          />
        </Form.Group>
      </Form>
    </div>
  );
};

AddCompetencyGlobalQuestionsPage.propTypes = {};
AddCompetencyGlobalQuestionsPage.defaultProps = {};
