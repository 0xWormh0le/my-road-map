import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link, useHistory, useParams, useLocation } from 'react-router-dom'
// import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentAlt, faCheckCircle } from '@fortawesome/pro-light-svg-icons';
import { faEllipsisH, faExclamationTriangle, faCheck, faClock, faPlus } from '@fortawesome/pro-regular-svg-icons';
import { uniqBy } from 'lodash';
import clsx from 'clsx';

import { Header, Loader, ActionMenu, CustomDialog, DesktopHeader, DesktopBackButton } from '../common';
import useQuery from '../common/useQuery';
import { useUnauthorizedErrorHandler } from '../../common/apiHelpers';
import { useDeleteUserRoadmap } from '../manage/redux/hooks';
import { useFetchUpdates } from '../common/redux/fetchUpdates';
import { useSetSelectedCompetency } from './redux/setSelectedCompetency';
import { useFetchAssignedUsers } from '../dashboard/redux/fetchAssignedUsers';

import {
  useFetchRoadmapStages,
  useFetchStageCompetencies,
  useFetchRoadmap,
  useFetchRecentCompetency
} from './redux/hooks';
import {useAddCompetency} from '../manage/redux/hooks';
import { useFetchUser } from '../user/redux/hooks';
import StudentInfo from './components/StudentInfo';

import { DesktopInlineAdder } from '../manage/index';

const assessmentStatus = ['red', 'yellow', 'green']

const GreenAssessmentStatusIcon = ({comp}) => {
  if (comp.last_assessment_status !== '3') return null;
  if (comp.last_assessment_approved === null && comp.last_assessment_rejected === null) {
    return null;
  }
  if (comp.last_assessment_approved && !comp.last_assessment_rejected) {
    return <FontAwesomeIcon icon={faCheck} size="sm" />;
  } else if (!comp.last_assessment_approved && comp.last_assessment_rejected) {
    return <FontAwesomeIcon icon={faExclamationTriangle} size="xs" />;
  } else {
    return <FontAwesomeIcon icon={faClock} size="sm" />;
  }
}

const iconColor = comp => {
  if (comp.last_assessment_status) {
    if (!comp.last_assessment_approved && !comp.last_assessment_rejected) {
      return assessmentStatus[Number(comp.last_assessment_status) - 1]
    } else {
      return assessmentStatus[Number(comp.last_assessment_status) - 1]
    }
  }
  return null
}

const Stage = ({
  comp,
  showNonStudentAssessment,
  unseenCompetencies,
  studentId,
  recent = false,
  user,
  replaceStringWithSynonyms,
}) => (
  <Card className={recent ? 'recent' : null} >
    <Row className="align-items-center mrm-p-0_5 mrm-pl-1 competency-card" noGutters>
      <Col className='col-auto d-flex'>
        {unseenCompetencies?.indexOf(comp.id) >= 0 && (
          <span className="dot d-block" />
        )}
        <div
          className={clsx(
            'default-stage-thumbnail',
            { 'right-edge': showNonStudentAssessment },
            iconColor(comp)
          )}
        >
          {!showNonStudentAssessment && user && user.features.coach_approves_green_assessments && <GreenAssessmentStatusIcon comp={comp} />}
        </div>
        {showNonStudentAssessment && (
          <div
            className={clsx(
              'default-stage-thumbnail left-edge',
              comp.last_non_student_assessment_status
                ? assessmentStatus[Number(comp.last_non_student_assessment_status) - 1]
                : null
            )}
          />
        )}
      </Col>
      <Col>
        <Card.Body className="mrm-pl-0_5 py-0 pr-0">
          <Card.Title>{comp.title}</Card.Title>
          <Card.Text as="div">
            {comp.total_action_item_assessments_count > 0 && (
              <span className="action-items">
                <FontAwesomeIcon icon={faCheckCircle} size='xs' />
                <span>
                  {`${comp.done_action_item_assessments_count}/${comp.total_action_item_assessments_count}`}
                </span>
              </span>
            )}
            {comp.comments_count > 0 && (
              <span className="comments">
                <FontAwesomeIcon icon={faCommentAlt} size='xs' />
                <span>{comp.comments_count}</span>
              </span>
            )}
            {comp.hidden_for && comp.hidden_for.includes(studentId) && (
              <span className='hidden-student'>{replaceStringWithSynonyms('Hidden for student')}</span>
            )}
            {comp.hidden_for_all_users && (
              <span className='hidden-student'>{replaceStringWithSynonyms('Hidden for all students')}</span>
            )}
            {comp.user_defined && <Badge variant="light">
              {replaceStringWithSynonyms('Student specific')}
            </Badge>}
          </Card.Text>
        </Card.Body>
      </Col>
    </Row>
  </Card>
)

export default function RoadmapPage() {
  const history = useHistory();
  const location = useLocation();
  const { roadmapId } = useParams();
  const query = useQuery();
  const listContainer = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [roadmapDetail, setRoadmapDetail] = useState(false)
  const [student, setStudent] = useState(null)
  const [archiveDialog, setArchiveDialog] = useState(false)
  const { deleteUserRoadmap } = useDeleteUserRoadmap()
  const { selectedCompetency } = useSetSelectedCompetency();

  const unauthorizedErrorHandler = useUnauthorizedErrorHandler();
  const { roadmaps, fetchRoadmap } = useFetchRoadmap();
  const { fetchAssignedUsers } = useFetchAssignedUsers()
  const { stages, fetchRoadmapStages } = useFetchRoadmapStages();
  const { competencies, fetchStageCompetencies } = useFetchStageCompetencies();
  const { updates } = useFetchUpdates();
  const { user, replaceStringWithSynonyms } = useFetchUser()
  const { recentCompetencies, fetchRecentCompetency } = useFetchRecentCompetency();

  const { addCompetency, addCompetencyPending } = useAddCompetency();

  const [stageData, setStageData] = useState([]);
  const [recentCompData, setRecentCompData] = useState([]);
  const studentId = query && Number(query.get('user'))
  const [openCompetencyInlineAdders, setOpenCompetencyInlineAdders] = useState([]);

  function updateStageData(stage, competencies) {
    stage.competencies = uniqBy(competencies, 'id').sort((a, b) => {
      if (a.order != null && b.order != null) return a.order > b.order ? 1 : -1;
      return 0;
    });
    setStageData(s => uniqBy([...s, stage], 'id').sort((a, b) => (a.order > b.order ? 1 : -1)));
  }

  useEffect(() => {
    if (!roadmapId) history.push('/dashboard/roadmaps');
  }, [roadmapId, history]);

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  
  useEffect(() => {
    setTimeout(() => {
      if (listContainer.current && selectedCompetency) {
        var item = document.getElementsByClassName(`scroll-${selectedCompetency}`).item(0);
        if (item) {
          item.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setScrolled(true);
        }
      }
    }, 1);
  }, [selectedCompetency, scrolled]);

  useEffect(() => {
    if (!roadmaps[roadmapId]) return;
    const newStageData = roadmaps[roadmapId].stage_ids.map(sid => stages[sid]).filter(s => !!s);
    newStageData.forEach(s => {
      s.competencies = s.competency_ids.map(cid => competencies[cid]).filter(c => !!c);
      s.competencies.sort((a, b) => {
        if (a.order != null && b.order != null) return a.order > b.order ? 1 : -1;
        return 0;
      });
    });
    newStageData.sort((a, b) => (a.order > b.order ? 1 : -1));
    setStageData(newStageData);
  }, [roadmapId, roadmaps, stages, competencies]);

  useEffect(() => {
    if (!!studentId) {
      fetchAssignedUsers({ userId: studentId }).then(res => setStudent(res.results[0]))
    }
  }, [fetchAssignedUsers, studentId])

  useEffect(() => {
    if (!roadmapId || !query || !user?.id) {
      return;
    }
    const effectiveStudentId = studentId || user.id;
    async function fetchRoadmapData() {
      await fetchRoadmap({ roadmapId });
      const stages = await fetchRoadmapStages({ roadmapId, studentId: effectiveStudentId });
      for (const stage of stages) {
        stage.competencies = await fetchStageCompetencies({ roadmapId, studentId: effectiveStudentId, stageId: stage.id });
        setStageData(s => uniqBy([...s, stage], 'id').sort((a, b) => (a.order > b.order ? 1 : -1)));
      }
    }
    fetchRoadmapData()
      .catch(unauthorizedErrorHandler)
      .catch(err => {
        if (err.response && err.response.status === 404) {
          history.push('/dashboard/roadmaps');
        } else {
          throw err;
        }
      });
  }, [
    query,
    fetchRoadmap,
    studentId,
    user,
    roadmapId,
    fetchRoadmapStages,
    fetchStageCompetencies,
    unauthorizedErrorHandler,
    history,
  ]);

  const userIsCoachOrAdmin = user && (user.groups.includes('Admin') || user.groups.includes('Coach'));

  useEffect(() => {
    if (!roadmapId || !query || !user || (userIsCoachOrAdmin && studentId)) return;

    fetchRecentCompetency()
      .catch(unauthorizedErrorHandler)
      .catch(err => {
        if (err.response && err.response.status === 404) {
          history.push('/dashboard/roadmaps');
        } else {
          throw err;
        }
      });
  }, [
    roadmapId,
    fetchRecentCompetency,
    unauthorizedErrorHandler,
    query,
    user,
    studentId,
    history,
    userIsCoachOrAdmin,
  ]);

  useEffect(() => {
    if (!recentCompetencies || !stageData || (userIsCoachOrAdmin && studentId)) {
      return;
    }
    const comps = [];
    stageData.forEach(stage => {
      const recents = stage.competencies.filter(comp => recentCompetencies.filter(recent => recent.competency === comp.id).length > 0);
      if (recents.length > 0) {
        comps.push(...recents);
      }
    });
    setRecentCompData(comps);
  }, [ recentCompetencies, stageData, userIsCoachOrAdmin, studentId ]);

  const roadmap = roadmaps[roadmapId];

  const handleArchiveRoadmapMenu = useCallback(() => {
    setRoadmapDetail(false)
    setArchiveDialog(true)
  }, [])

  const handleArchiveRoadmapYes = useCallback(() => {
    deleteUserRoadmap({ roadmapId, userId: user.id }).then(() => {
      history.push('/dashboard/roadmaps')
    })
  }, [deleteUserRoadmap, roadmapId, user, history])

  const handleArchiveDialogHide = useCallback(() => setArchiveDialog(false), [])

  const roadmapDetailItems = useCallback(() => {
    const items = [
      // TODO: Uncomment the item when it'll make sense
      // { label: 'About This Roadmap', to: '/' },
    ]
    if (user.features.can_assign_specific_coaches_for_specific_roadmaps) {
      items.push({ label: replaceStringWithSynonyms('Edit Assigned Coaches'), to: `/roadmap/${roadmapId}/edit-assigned-coaches` })
    }
    if (user.features.can_assign_roadmaps) {
      items.push({
        label: user.features.roadmaps_are_archived ? 'Archive Roadmap' : 'Unassign Roadmap',
        className: 'text-danger',
        onClick: handleArchiveRoadmapMenu
      })
    }
    
    return items
  }, [user, roadmapId, handleArchiveRoadmapMenu, replaceStringWithSynonyms])

  const handleRoadmapDetailClick = useCallback(() => setRoadmapDetail(true), [])

  const handleRoadmapDetailHide = useCallback(() => setRoadmapDetail(false), [])

  // Competency inline adder

  const showCompetencyInlineAdder = useCallback((stageId) => {
    if (!openCompetencyInlineAdders.includes(stageId)) {
      setOpenCompetencyInlineAdders([...openCompetencyInlineAdders, stageId]);
    }

  }, [openCompetencyInlineAdders]);

  const hideCompetencyInlineAdder = useCallback(stageId => {
    if (openCompetencyInlineAdders.includes(stageId)) {
      setOpenCompetencyInlineAdders(openCompetencyInlineAdders.filter(id => id!== stageId));
    }
  }, [openCompetencyInlineAdders]);

  const handleInlineCompetencyAdd = useCallback(stageId => title => { 
    const student_id = !!studentId ? studentId : user?.id;

    addCompetency({ roadmapId, title, student: student_id, stage: stageId }).then(newCompetency => {
      hideCompetencyInlineAdder(stageId);
      const stage = stageData.find(s => s.id === stageId);
      const competencies = [...stage.competencies, newCompetency];
      updateStageData(stage, competencies);
    });
  }, [roadmapId, addCompetency, stageData, studentId, user, hideCompetencyInlineAdder])

  if (!roadmap || !user) {
    return <Loader />
  }

  const headerThirdColumn = roadmapDetailItems().length > 0
    ? <FontAwesomeIcon icon={faEllipsisH} onClick={handleRoadmapDetailClick} /> : null;
  const studentRoadmapInfo = student && student.roadmaps_info.find(r => r.id === Number(roadmapId));
  const unseenCompetencies = updates?.unseen_activity?.[studentId || user.id]?.competencies;
  const defaultBackLink = "/dashboard/roadmaps";

  return (
    <div className="roadmap-default-page">
      <Header
        border
        icon="back"
        title={roadmap.title}
        colSizes={['auto', undefined, 'auto']}
        renderThirdColumn={() => headerThirdColumn}
        thirdColumnClass="third-column"
        defaultBackLink={defaultBackLink}
      >
        {userIsCoachOrAdmin && !!studentId && student && <StudentInfo student={student} />}
      </Header>
      <DesktopHeader>
        <Container>
          
            <div className="desktop-page-secondary-header-wrapper mrm-py-1">
              <Row className="d-flex align-items-start">
                <Col xs={1}>
                  <div className="back-button-container">
                    <DesktopBackButton defaultBackLink={defaultBackLink} />
                  </div>
                </Col>
                { !student && (
                  <Col xs={10}>
                    <h2 className="text-center roadmap-title">{roadmap.title}</h2>
                    {roadmap && <>
                      <div className="progress">
                        <div className="progress-bar" style={{ width: `${roadmap.stats.total_progress}%`}} />
                      </div>
                      <div className="progress-text text-center font-size-smaller mrm-mt-0_25">{roadmap.stats.total_progress.toFixed()}% complete</div>
                    </>}
                  </Col>
                )}
                { userIsCoachOrAdmin && !!studentId && student && (
                  <Col xs={10}>
                    <StudentInfo student={student} />
                    <h2 className="text-center roadmap-title">{roadmap.title}</h2>
                    {studentRoadmapInfo && <>
                      <div className="progress">
                        <div className="progress-bar" style={{ width: `${studentRoadmapInfo.progress}%`}} />
                      </div>
                      <div className="progress-text text-center font-size-smaller mrm-mt-0_25">{studentRoadmapInfo.progress.toFixed()}% complete</div>
                    </>}
                  </Col>
                )}
                <Col xs={1}>
                  {roadmapDetailItems().length > 0 && (<div className="more-btn-desktop float-right">{headerThirdColumn}</div>)}
                </Col>
              </Row>
            </div>
          
        </Container>
      </DesktopHeader>
      <Container className="normal-width-container">
        {recentCompData && recentCompData.length > 0 && (
          <Row className="mrm-mb-1">
            <Col>
              <h2>Continue working on...</h2>
              {recentCompData.map(comp => (
                <Link
                  key={comp.id}
                  className='no-format'
                  to={{
                    pathname: `/roadmap/${roadmap.id}/stage/${comp.stage}/competency/${comp.id}`,
                    search: studentId ? `user=${studentId}` : null,
                    state: { backLink: location },
                  }}
                >
                  <Stage
                    showNonStudentAssessment={user.features.coach_or_admin_can_assess_objectives}
                    comp={comp}
                    studentId={studentId}
                    recent={true}
                    user={user}
                    replaceStringWithSynonyms={replaceStringWithSynonyms}
                    unseenCompetencies={unseenCompetencies}
                  />
                </Link>
              ))}
            </Col>
          </Row>
        )}
        <Row>
          <Col ref={listContainer}>
            {stageData.map(stage => (
              <div className="stage" key={stage.id}>
                <h2>{stage.title}</h2>
                {stage.description && <p>{stage.description}</p>}
                {userIsCoachOrAdmin && stage.coach_notes && <p className="coach-notes">{stage.coach_notes}</p>}
                {stage.competencies.length > 0 && stage.competencies.map(comp => (
                    <Link
                      key={comp.id}
                      className='no-format'
                      to={{
                        pathname: `/roadmap/${roadmap.id}/stage/${comp.stage}/competency/${comp.id}`,
                        search: studentId ? `user=${studentId}` : null,
                        state: { backLink: location },
                      }}
                    >
                      <Stage
                        showNonStudentAssessment={user.features.coach_or_admin_can_assess_objectives}
                        comp={comp}
                        studentId={studentId}
                        user={user}
                        replaceStringWithSynonyms={replaceStringWithSynonyms}
                        unseenCompetencies={unseenCompetencies}
                      />
                    </Link>
                  )) 
                }
                {userIsCoachOrAdmin && !!studentId && user.features.coach_admin_can_assign_user_specific_competencies && <Link
                  to={{
                    pathname: `/manage/roadmaps/${roadmapId}/stages/${stage.id}/competencies/add`,
                    search: `student=${studentId}`,
                    editCompetency: true,
                    state: { backLink: location }
                  }}
                  className="d-lg-none"
                >
                  <Button
                    variant="white"
                    className="btn-center mrm-my-1 w-100"
                  >
                    <FontAwesomeIcon icon={faPlus} className='mrm-mr-0_5' size="sm" />
                    Add Student Specific Competency?
                  </Button>
                </Link>}
                {!openCompetencyInlineAdders.includes(stage.id) && userIsCoachOrAdmin && !!studentId && user.features.coach_admin_can_assign_user_specific_competencies && <Button
                    variant="white"
                    className="btn-center mrm-my-1 w-100 d-none d-lg-block"
                    onClick={() => showCompetencyInlineAdder(stage.id)}
                  >
                    <FontAwesomeIcon icon={faPlus} className='mrm-mr-0_5' size="sm" />
                    Add Student Specific Competency!
                  </Button>}
                {openCompetencyInlineAdders.includes(stage.id) && <DesktopInlineAdder
                  maxLength={500}
                  onCancel={() => hideCompetencyInlineAdder(stage.id)}
                  onAdd={handleInlineCompetencyAdd(stage.id)}
                  loading={addCompetencyPending}
                />}                
              </div>
            ))}
          </Col>
        </Row>
        <ActionMenu
          show={roadmapDetail}
          onHide={handleRoadmapDetailHide}
          items={roadmapDetailItems()}
        />
      </Container>

      <CustomDialog
        show={archiveDialog}
        text={{
          caption: user.features.roadmaps_are_archived ? 'Archive roadmap?' : 'Unassign roadmap? It will save its progress.',
          yes: 'Yes'
        }}
        onHide={handleArchiveDialogHide}
        onYes={handleArchiveRoadmapYes}
      />
    </div>
  );
}

RoadmapPage.propTypes = {};
RoadmapPage.defaultProps = {};
