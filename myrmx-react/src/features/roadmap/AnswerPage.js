import React, { useCallback, useEffect } from 'react';
import { useHistory, useParams, Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Header, Loader, DesktopHeader } from '../common';
import { useFetchUser } from '../user/redux/hooks';
import { useFetchQuestionAnswers, useAddQuestionAnswer, useUpdateQuestionAnswer } from './redux/hooks';
import { useFetchGlobalQuestions } from '../manage/redux/hooks';
import useEffectiveBackLink from '../common/useEffectiveBackLinkHook';

const schema = yup.object().shape({
  answer: yup.string().nullable()
})

export default function AnswerPage() {
  const { roadmapId, stageId, competencyId, questionId, answerId } = useParams()
  const history = useHistory()
  const { user } = useFetchUser()
  const { globalQuestions, fetchGlobalQuestions, fetchGlobalQuestionsPending } = useFetchGlobalQuestions()
  const { questionAnswers, fetchQuestionAnswers, fetchQuestionAnswersPending } = useFetchQuestionAnswers()
  const { addQuestionAnswer } = useAddQuestionAnswer()
  const { updateQuestionAnswer } = useUpdateQuestionAnswer()

  const question = globalQuestions && globalQuestions.find (x => x.id === parseInt(questionId))
  const answer = questionAnswers && answerId && questionAnswers.find(x => x.id === parseInt(answerId))

  useEffect(() => {
    if (!roadmapId || !stageId || !competencyId || !user) {
      return;
    }
    fetchGlobalQuestions({roadmapId, stageId, competencyId})
    
    if (answerId) {
      fetchQuestionAnswers({roadmapId, stageId, competencyId})
    }
  }, [
    roadmapId, 
    stageId, 
    competencyId, 
    answerId, 
    user,
    fetchGlobalQuestions, 
    fetchQuestionAnswers
  ])

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

  const defaultBackLink = `/roadmap/${roadmapId}/stage/${stageId}/competency/${competencyId}`;
  const effectiveBackLink = useEffectiveBackLink(defaultBackLink);
  const handleSaveClick = useCallback(({ answer }) => {
    if (answerId) {
      updateQuestionAnswer({roadmapId, stageId, competencyId, parent: questionId, answer, answerId})
        .then(() => history.push(effectiveBackLink))
        .catch(e => handleError(e.response.data))
    } else {
      addQuestionAnswer({roadmapId, stageId, competencyId, parent: questionId, answer})
        .then(() => history.push(effectiveBackLink))
        .catch(e => handleError(e.response.data))
    }
  }, [
    roadmapId,
    stageId,
    competencyId,
    questionId,
    answerId,
    history,
    addQuestionAnswer,
    updateQuestionAnswer,
    handleError,
    effectiveBackLink,
  ])

  const renderBackLink = useCallback((effectiveBackLink) => (
    <div onClick={() => history.push(effectiveBackLink)}>
      <Button className="btn-cancel" variant="white" >
        Cancel
      </Button>
    </div>
  ), [history])

  const renderSaveButton = useCallback(() => (
    <Button
      className="btn-save"
      variant="white"
      onClick={handleSubmit(handleSaveClick)}
    >
      Save
    </Button>
  ), [handleSaveClick, handleSubmit])

  return (
    <div className="roadmap-answer-page">
      <Header
        icon="back"
        title="Question"
        renderThirdColumn={renderSaveButton}
        thirdColumnClass="text-right"
        colSizes={['auto', undefined , 'auto']}
        border
        renderBackLink={renderBackLink}
        defaultBackLink={defaultBackLink}
      />
      <DesktopHeader showPrimaryContent={false}>
        <Container>
          <Row className="desktop-page-secondary-header-wrapper mrm-mb-1 mrm-py-1">
            <Col xs={2}>
              <Link to={defaultBackLink}>
                <Button variant="gray">
                  Cancel
                </Button>
              </Link>
            </Col>
            <Col xs={8}>
              <h1 className="text-center">Question</h1>
            </Col>
            <Col xs={2}>     
              {renderSaveButton()}       
            </Col>
          </Row>
        </Container>
      </DesktopHeader>
      { (fetchGlobalQuestionsPending || fetchQuestionAnswersPending) && <Loader /> }
      <div className="d-lg-none mobile-page-container">
        <Form className='mrm-p-1'>
          <Form.Group controlId='coach_notes'>
            <h2>
              {question && question.question}
            </h2>
            <Form.Control
              name='answer'
              as="textarea"
              defaultValue={answer && answer.answer}
              isInvalid={errors.answer}
              ref={register}
              placeholder='Add answer'
              rows={4}
              className="mrm-mt-1"
            />
          </Form.Group>
        </Form>
      </div>
      <div className="d-none d-lg-block desktop-page-container">
        <Container>
          <Form className='mrm-p-1'>
              <Form.Group controlId='coach_notes'>
                <h2>
                  {question && question.question}
                </h2>
                <Form.Control
                  name='answer'
                  as="textarea"
                  defaultValue={answer && answer.answer}
                  isInvalid={errors.answer}
                  ref={register}
                  placeholder='Add answer'
                  rows={4}
                  className="mrm-mt-1"
                />
              </Form.Group>
            </Form>
          </Container>
      </div>
    </div>
  );
};

AnswerPage.propTypes = {};
AnswerPage.defaultProps = {};
