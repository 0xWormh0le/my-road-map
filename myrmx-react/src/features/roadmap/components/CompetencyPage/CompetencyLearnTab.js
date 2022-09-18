import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import clsx from 'clsx';
// import PropTypes from 'prop-types';

import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import { useUnauthorizedErrorHandler } from '../../../../common/apiHelpers';
import Loader from '../../../common/Loader';
import AttachmentModal, { AttachmentList } from '../../components/ActionItemPage/Attachment';
import {
  useFetchCompetencyActionItemAssessments,
  useSetCompetencyAssessment,
  useAddCompetencyAttachment,
  useDeleteCompetencyAttachment,
  useFetchCompetencyNotes,
  useFetchCompetencyAssessments,
  useFetchQuestionAnswers,
  useApproveCompetencyAssessment
} from '../../redux/hooks';
import { useFetchGlobalQuestions } from '../../../manage/redux/fetchGlobalQuestions';
import useQuery from '../../../common/useQuery';
import ActionItems from './ActionItems';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinnerThird } from '@fortawesome/pro-duotone-svg-icons';
import { faPlus, faCheck, faExclamationTriangle, faChevronRight } from '@fortawesome/pro-regular-svg-icons';
import dayjs from 'dayjs';
// import PropTypes from 'prop-types';

const marks = Array(11).fill(0).map((v, i) => i.toString())

function GreenAssessmentApprovePanel(
  {
    assessmentApprovedStatus,
    handleApproveAssessmentClick,
    approveCompetencyAssessmentPending,
    className,
  }
) {
  return (<Row className={clsx("assessment-approve", className)}>
    <Col className="text-right">
      <Button
        variant="white"
        className={clsx(
          "btn-bottom-left-rounded",
          {
            'active': assessmentApprovedStatus === 'rejected',
          },
        )}
        onClick={handleApproveAssessmentClick(false)}
        disabled={!!approveCompetencyAssessmentPending}
      >
        {approveCompetencyAssessmentPending === 'reject' ? (
          <FontAwesomeIcon icon={faSpinnerThird} className="mrm-mr-0_5" spin size="xs" />
        ) : assessmentApprovedStatus === 'rejected' && (
          <FontAwesomeIcon icon={faExclamationTriangle} className="mrm-mr-0_5" size="sm" />
        )}
        Needs Work
      </Button>
      <Button
        variant="white"
        className={clsx(
          "btn-bottom-right-rounded mrm-ml-0_25",
          {
            'active': assessmentApprovedStatus === 'approved',
          },
        )}
        onClick={handleApproveAssessmentClick(true)}
        disabled={!!approveCompetencyAssessmentPending}
      >
        {approveCompetencyAssessmentPending === 'approve' ? (
          <FontAwesomeIcon icon={faSpinnerThird} className="mrm-mr-0_25" spin size="xs" />
        ) : assessmentApprovedStatus === 'approved' && (
          <FontAwesomeIcon icon={faCheck} className="mrm-mr-0_25" size="sm" />
        )}
        Approve
      </Button>
    </Col>
  </Row>);
}

function SelfReflection({
  className,
  roadmapId,
  competency,
  loading,
  refetchCompetency,
  student,
  assessment,
  studentAssessment,
  user
}) {
  const { setCompetencyAssessment } = useSetCompetencyAssessment();
  const { approveCompetencyAssessment, approveCompetencyAssessmentPending } = useApproveCompetencyAssessment();
  const unauthorizedErrorHandler = useUnauthorizedErrorHandler();
  const [ assessmentApprovedStatusOverride, setAssessmentApprovedStatusOverride ] = useState(undefined);
  const [ refreshSlider, setRefreshSlider ] = useState();

  const setCompetencyAssessmentHandlingErrors = useCallback(({ status, sliderStatus }) => {
    setCompetencyAssessment({
      roadmapId,
      stageId: competency.stage,
      competencyId: competency.id,
      studentId: student,
      status,
      sliderStatus,
    }).catch(unauthorizedErrorHandler)
      .then(res => {
        refetchCompetency();
      });
  }, [
    setCompetencyAssessment,
    roadmapId,
    competency,
    student,
    unauthorizedErrorHandler,
    refetchCompetency,
  ]);

  const canAssess = useCallback(() => {
    if (user.groups.includes('User')) {
      if (user.groups.includes('Admin') || user.groups.includes('Coach')) {
        if (student === user.id) {
          return true
        } else {
          return user.features.coach_or_admin_can_assess_objectives
        }
      } else {
        return true
      }
    } else if (user.groups.includes('Admin') || user.groups.includes('Coach')) {
      return user.features.coach_or_admin_can_assess_objectives
    } else {
      return true
    }
  }, [student, user])

  const handleApproveAssessmentClick = useCallback(approved => () => {
    if (!studentAssessment) {
      return
    }
    const args = {
      roadmapId,
      approved,
      stageId: competency.stage,
      competencyId: competency.id,
      assessmentId: studentAssessment.id
    };
    approveCompetencyAssessment(args)
      .then(() => {
        setAssessmentApprovedStatusOverride(approved ? 'approved' : 'rejected');
      })
      .catch(unauthorizedErrorHandler);
  }, [
    roadmapId,
    competency,
    studentAssessment,
    approveCompetencyAssessment,
    unauthorizedErrorHandler,
  ]);
  
  const handleChangeSlider = useCallback(value => {
    setCompetencyAssessmentHandlingErrors({ sliderStatus: value });
    if (
      value >= 7.5 &&
      user.features.coach_approves_green_assessments &&
      (user.groups.includes('Admin') || user.groups.includes('Coach'))
    ) {
      handleApproveAssessmentClick(true)()
    }
  }, [
    setCompetencyAssessmentHandlingErrors,
    handleApproveAssessmentClick,
    user
  ])

  useEffect(() => {
    setRefreshSlider(Math.random().toString(36).substring(7))
  }, [assessment])

  const lastSubmission = date => {
    const diff = dayjs(date).diff(dayjs(), 'day');
    if (diff === 0) {
      return 'Today';
    } else {
      return dayjs(date).fromNow();
    }
  }

  const handleCompetencyAssessmentClick = useCallback(
    status => () => {
      setCompetencyAssessmentHandlingErrors({ status })
      if (
        status === 3 &&
        user.features.coach_approves_green_assessments &&
        (user.groups.includes('Admin') || user.groups.includes('Coach'))
      ) {
        handleApproveAssessmentClick(true)();
      }
    },
    [
      setCompetencyAssessmentHandlingErrors,
      handleApproveAssessmentClick,
      user
    ]
  )

  const showApproveButton = useMemo(
    () =>
      !!studentAssessment && studentAssessment.status === '3' &&
      (user.groups.includes('Admin') || user.groups.includes('Coach')) &&
      user.features.coach_approves_green_assessments
    , [studentAssessment, user]
  )

  const effectiveAssessment = (user.groups.includes('Admin') || user.groups.includes('Coach')) &&
    user.features.coach_or_admin_can_assess_objectives ? assessment : studentAssessment;

  const defaultAssessmentApprovedStatus = useMemo(() => {
    if (studentAssessment && studentAssessment.status === '3') {
      if (studentAssessment.approved) {
        return 'approved'
      } else if (studentAssessment.rejected) {
        return 'rejected'
      }
    }
    return null
  }, [ studentAssessment ]);
  const assessmentApprovedStatus = assessmentApprovedStatusOverride || defaultAssessmentApprovedStatus;

  return (
    <Row className={clsx(
      "self-reflection",
      className,
      {
        'd-none': competency[`red_description`].length === 0 & competency[`yellow_description`].length === 0 & competency[`green_description`].length === 0 & user.features.slider_for_competency_assessment === false,
      })}>
      <Col>
        <h2>Assessment</h2>
        {effectiveAssessment && effectiveAssessment.date && (
          <span className="theme-text-primary">
            ({`last submission: ${lastSubmission(effectiveAssessment.date)}`})
          </span>
        )}
        <div className={clsx(
          'assessment-container',
          {
            'border-br-none': showApproveButton,
            'mrm-py-1': user.features.slider_for_competency_assessment,
            'assessment-slider-container': user.features.slider_for_competency_assessment,
            'd-none': competency[`red_description`].length === 0 & competency[`yellow_description`].length === 0 & competency[`green_description`].length === 0 & user.features.slider_for_competency_assessment === false,
          }
        )}>
          {loading && <Loader position='local' />}
          {user && user.features.slider_for_competency_assessment ? (
            <>
              <p>How do you feel like you are doing in this area?</p>
              <div className="slider-container" key={refreshSlider}>
                <Slider
                  marks={marks}
                  min={1}
                  max={10}
                  step={0.1}
                  defaultValue={(effectiveAssessment && effectiveAssessment.slider_status) || 5.5}
                  disabled={!canAssess()}
                  trackStyle={{ background: 'transparent' }}
                  onAfterChange={handleChangeSlider}
                />
              </div>
            </>
          ) : ['red', 'yellow', 'green'].map((color, i) => (<>
            <Row
              className={clsx(
                'align-items-center assessment',
                color,
                {
                  'active': loading ? false : (!!effectiveAssessment ? Number(effectiveAssessment.status) : null) === i + 1,
                },
                {
                  'd-none': competency[`${color}_description`].length === 0,
                },
              )}
              noGutters
              onClick={canAssess() ? handleCompetencyAssessmentClick(i + 1) : undefined}
              key={color}
            >
              <Col xs={12} className="d-none d-lg-block assessment-header" />
              <Col className="d-lg-none" xs={1}>
                {(!!effectiveAssessment ? Number(effectiveAssessment.status) : null) === i + 1 && !loading
                  ? <p className="circle selected d-lg-none" />
                  : <p className="circle d-lg-none" /> }
              </Col>
              <Col xs={10} lg={12} className="align-self-start">
                <Card.Body>
                  <Card.Title>{competency[`${color}_description`]}</Card.Title>
                </Card.Body>
              </Col>
              {color === 'green' && showApproveButton && <Col xs={12} className="d-none d-lg-flex assessment-approve-desktop-container">
                <GreenAssessmentApprovePanel
                  approveCompetencyAssessmentPending={approveCompetencyAssessmentPending}
                  assessmentApprovedStatus={assessmentApprovedStatus}
                  handleApproveAssessmentClick={handleApproveAssessmentClick}
                />
              </Col>}
            </Row>
          </>))}
        </div>
        {showApproveButton && <GreenAssessmentApprovePanel
          approveCompetencyAssessmentPending={approveCompetencyAssessmentPending}
          assessmentApprovedStatus={assessmentApprovedStatus}
          handleApproveAssessmentClick={handleApproveAssessmentClick}
          className="d-lg-none"
        />}
        <div className="border mrm-mt-1 d-lg-none" />
      </Col>
    </Row>
  );
}

function GlobalQuestions({
  questions,
  answers,
  roadmapId,
  competency,
  user
}) {
  const history = useHistory()
  const location = useLocation()
  const query = useQuery();

  const handleQuestionClick = useCallback(id => () => {
    const answer = answers.find(x => x.parent === id)
    const url = `/roadmap/${roadmapId}/stage/${competency.stage}/competency/${competency.id}/question/${id}/answer/${answer ? answer.id : 'add'}`
    history.push(url, { backLink: location })
  }, [roadmapId, competency, answers, history, location])

  const canAnswerQuestion = useCallback(() => {
    if (user.groups.includes('Admin') || user.groups.includes('Coach')) {
      if (query) {
        const queryUser = query.get('user')
        if (queryUser) {
          return Number(queryUser) === user.id
        }
      }
    }
    return user.groups.includes('User')
  }, [user, query])

  return (
    <Row className="order-2">
      {questions.length > 0 && (
        <Col>
          <div className="border d-lg-none" />
          <h2>Questions <span>({answers.length} of {questions.length} answered)</span></h2>
          <div className="questions-section mb-3">
            {questions.map(item => (
              <div key={item.id} className="question-item question theme-text-secondary" 
                onClick={ canAnswerQuestion() && handleQuestionClick(item.id)}
              >
                <div>
                  <pre className="question">{item.question}</pre>
                  {answers.find(x => x.parent === item.id) && 
                    <pre className="answer">{answers.find(x => x.parent === item.id)?.answer}</pre>
                  }
                </div>
                <FontAwesomeIcon icon={faChevronRight} size="sm" />
              </div>
            ))}
          </div>
        </Col>
      )}
    </Row>
  )
}
export default function CompetencyLearnTab({ roadmapId, competency, user, refetchCompetency }) {
  const [attachment, setAttachment] = useState(null);

  const unauthorizedErrorHandler = useUnauthorizedErrorHandler();
  const fileEl = useRef({});
  const {
    actionItems,
    fetchCompetencyActionItemAssessmentsPending,
    fetchCompetencyActionItemAssessments
  } = useFetchCompetencyActionItemAssessments();
  const { notes, fetchCompetencyNotes } = useFetchCompetencyNotes();
  const { competencyAssessments, fetchCompetencyAssessments, fetchCompetencyAssessmentsPending } = useFetchCompetencyAssessments()
  const { globalQuestions, fetchGlobalQuestions, fetchGlobalQuestionsPending  } = useFetchGlobalQuestions();
  const { questionAnswers, fetchQuestionAnswers, fetchQuestionAnswersPending } = useFetchQuestionAnswers()

  const {
    addCompetencyAttachment,
    addCompetencyAttachmentPending,
    addCompetencyAttachmentReset,
    addCompetencyAttachmentProgress,
    addCompetencyAttachmentError
  } = useAddCompetencyAttachment();
  
  const query = useQuery();
  const { deleteCompetencyAttachment } = useDeleteCompetencyAttachment();
  const location = useLocation();

  const lastCompetencyAssessmentBy = useCallback(userId => {
    if (competencyAssessments) {
      const assessments = competencyAssessments.filter(i => i.user === userId)
      if (assessments.length > 0) {
        return assessments[0]
      }
    }
    return null
  }, [competencyAssessments])

  const studentId = useMemo(() => {
    if (!user) {
      return undefined
    }
    if (user.groups.includes('Admin') || user.groups.includes('Coach')) {
      if (query) {
        const queryUser = query.get('user')
        if (queryUser) {
          return Number(queryUser)
        }
      }
      return user.id
    } else {
      return undefined
    }
  }, [user, query])

  // This effect assumes competency prop is always defined, i.e. props can be accessed without triggering TypeError
  useEffect(() => {
    if (!roadmapId || !competency.stage || !competency.id || !user) {
      return;
    }
    // TODO: Add another .catch to handle rest of errors
    const args = {
      roadmapId,
      stageId: competency.stage,
      competencyId: competency.id,
      student: studentId
    };
    fetchCompetencyActionItemAssessments(args).catch(unauthorizedErrorHandler);
    fetchCompetencyAssessments(args)
    fetchGlobalQuestions({roadmapId, stageId: competency.stage, competencyId: competency.id})
    fetchQuestionAnswers({roadmapId, stageId: competency.stage, competencyId: competency.id, studentId})
  }, [
    user,
    roadmapId,
    studentId,
    fetchCompetencyActionItemAssessments,
    fetchCompetencyAssessments,
    fetchGlobalQuestions,
    fetchQuestionAnswers,
    unauthorizedErrorHandler,
    competency.stage,
    competency.id,
    competency.last_assessment_status,
  ]);

  useEffect(() => {
    if (!roadmapId || !competency || !user || !user.features.competency_notes_journal_enabled) {
      return;
    }
    const args = { 
      roadmapId, 
      stageId: competency.stage, 
      competencyId: competency.id, 
      userId: studentId
    };
    fetchCompetencyNotes(args).catch(unauthorizedErrorHandler);
  }, [
    user,
    roadmapId,
    competency,
    studentId,
    fetchCompetencyNotes,
    unauthorizedErrorHandler
  ]);

  const competencyActionItems = useMemo(
    () => competency && competency.action_item_ids
      .map(aid => actionItems[aid])
      .filter(ai => !!ai)
      .sort((a, b) => (a.order > b.order ? 1 : -1)),
    [competency, actionItems],
  );

  const handleAttachmentDelete = useCallback(
    attachmentId => deleteCompetencyAttachment({
      roadmapId,
      competency,
      attachmentId
    }),[roadmapId, competency, deleteCompetencyAttachment]
  )
  
  const handleFileChange = useCallback(
    () => {
      addCompetencyAttachmentReset();
      setAttachment({
        type: fileEl.current.attachType,
        path: fileEl.current.files[0].name
      })
    }, [addCompetencyAttachmentReset]
  )

  const handleAttachConfirmHide = useCallback(() => {
    fileEl.current.value = null;
    setAttachment(null);
  }, [])

  const handleConfirmUpload = useCallback(() => {
    const data = new FormData();
    data.append('attachment', fileEl.current.files[0]);
    data.append('file_category', 'ATTACHMENT');
    let userId = user.id
    // If Coach user, get student user from url params
    if (user.groups.includes('Coach')){
      const params = new URLSearchParams(location.search)
      userId = params.get('user') && Number(params.get('user'))
      data.append('user', userId);
    }

    addCompetencyAttachment({
      roadmapId,
      competency,
      data
    })
  }, [user, roadmapId, competency, addCompetencyAttachment, location])

  const handleAddFileClick = useCallback(type => () => {
    fileEl.current.attachType = type;
    fileEl.current.click();
  }, [])

  const canAddNote = useCallback(() => {
    if (user.groups.includes('Admin') || user.groups.includes('Coach')) {
      if (query) {
        const queryUser = query.get('user')
        if (queryUser) {
          return Number(queryUser) === user.id
        }
      }
    }
    return user.groups.includes('User')
  }, [user, query])

  const currentUserIsCoachOrAdmin = user && (user.groups.includes('Admin') || user.groups.includes('Coach'));

  return (
    <div className="roadmap-components-competency-page-competency-learn-tab tab-container">
      <p className="print-header">Learn</p>
      {competency && competency.coach_notes && currentUserIsCoachOrAdmin && (
        <Row className="mrm-pb-0_75">
          <Col>
            <div className="theme-text coach-notes">{competency.coach_notes}</div>
            <div className="border mrm-mt-1 d-lg-none" />
          </Col>
        </Row>
      )}
      {competency && competency.description && !!competency.description.trim().length && (
        <Row className="description-container">
          <Col>
            <div className="theme-text embed" dangerouslySetInnerHTML={{
              __html: competency.description 
            }} />

            {/* Needs to be fixed  */}
            {/* {!expanded && truncatedDescription !== competency.description && (
              <Button className="btn-center" onClick={() => setExpanded(!expanded)} variant="white">
                Expand
              </Button>
            )} */}
            <div className="border mrm-mt-1 d-lg-none" />
          </Col>
        </Row>
      )}
      {/* TODO: Make this work properly */}
      {/* user.company.assessment_first? */}
      <div className="d-flex flex-column">
        {competencyAssessments && user && (
          <SelfReflection
            className={true ? 'order-0' : 'order-1'}
            roadmapId={roadmapId}
            competency={competency}
            loading={fetchCompetencyAssessmentsPending}
            assessment={lastCompetencyAssessmentBy(user.id)}
            studentAssessment={lastCompetencyAssessmentBy(studentId || user.id)}
            user={user}
            refetchCompetency={refetchCompetency}
            student={studentId}
          />
        )}

        {!fetchCompetencyActionItemAssessmentsPending ? (<>
          {competency.ai_visible && <ActionItems
            className={true ? 'order-1' : 'order-0'}
            roadmapId={roadmapId}
            competency={competency}
            actionItems={competencyActionItems}
            user={user}
            studentId={studentId}
            refetchCompetency={refetchCompetency}
          />}
        </>) : (
          <Loader className='mrm-mt-1' position='static' />
        )}
        {
          fetchGlobalQuestionsPending || 
          fetchQuestionAnswersPending || 
          !globalQuestions || 
          !questionAnswers ? (
            <Loader className="mrm-mt-1" position='static' />
        ) : (
          <GlobalQuestions
            questions={globalQuestions}
            answers={questionAnswers}
            roadmapId={roadmapId}
            competency={competency}
            user={user}
          />
        )}
        {competency.attachments_visible && <div className="order-3">
          <div className="border d-lg-none" />
          {competency.attachments.length > 0 && <h2>Attachments</h2>}
          <AttachmentList
            data={competency.attachments}
            onDelete={handleAttachmentDelete}
            user={user}
          />
          {user && user.features.can_attach_files && (
            <>
            <div className="d-none d-lg-inline-block desktop-page-container">
              <Link
                className={clsx(
                  "add-attachment",
                  {
                    'mrm-pt-1': competency.attachments.length === 0,
                  },
                )}
                onClick={handleAddFileClick('ATTACHMENT')}
                to={location}
              >
                <FontAwesomeIcon icon={faPlus} size="sm" className='mr-2' />
                Add a file attachment
              </Link>
            </div>
            <div className="d-lg-none">
              <Button
                variant="white"
                className="btn-center mrm-my-1"
                onClick={handleAddFileClick('ATTACHMENT')}
              >
                <FontAwesomeIcon icon={faPlus} className='mrm-mr-0_5' size="sm" />
                Add Attachment
              </Button>
            </div>
            </>
          )}
        </div>}
        {user && user.features.competency_notes_journal_enabled && <div className="order-4 notes-container">
          <div className="border d-lg-none" />
          {user && notes && notes.length > 0 && <h2>Notes/journal</h2>}
          <div className="notes-description">
            {user && notes && notes.length > 0 && (
              canAddNote() ? (
                <Link 
                  to={{
                    pathname: `/roadmap/${roadmapId}/stage/${competency.stage}/competency/${competency.id}/note/${notes[0].id}`,
                    state: { backLink: location },
                  }} 
                  className="theme-text font-weight-normal"
                >
                  <pre className="theme-text">
                    {notes[0].text}
                  </pre>
                </Link>
              ) : (
                <pre className="theme-text mrm-mt-0_75">
                  {notes[0].text}
                </pre>
              )
            )}
          </div>
          {user &&
          notes &&
          notes.length === 0 &&
          canAddNote() && (
            <Link to={{
              pathname: `/roadmap/${roadmapId}/stage/${competency.stage}/competency/${competency.id}/note/add`,
              state: { backLink: location },
            }}>
            <div className="d-none d-lg-inline-block desktop-page-container add-note">
              <FontAwesomeIcon icon={faPlus} size="sm" className='mr-2' />
              Add a journal/note
            </div>
              <div className="d-lg-none">
                <Button
                  variant="white"
                  className="btn-center mrm-my-1"
                >
                  <FontAwesomeIcon icon={faPlus} className='mrm-mr-0_5' size="sm" />
                  Add Journal/Note
                </Button>
              </div>
            </Link>
          )}
        </div>}
      </div>
      <input type="file" ref={fileEl} onChange={handleFileChange} hidden />
      <AttachmentModal
        show={!!attachment}
        data={attachment}
        onConfirm={handleConfirmUpload}
        onAnotherFile={handleAddFileClick(attachment && attachment.type)}
        pending={addCompetencyAttachmentPending}
        progress={addCompetencyAttachmentProgress}
        error={addCompetencyAttachmentError}
        onHide={handleAttachConfirmHide}
      />
    </div>
  );
}

CompetencyLearnTab.propTypes = {};
CompetencyLearnTab.defaultProps = {};
