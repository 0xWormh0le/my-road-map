import React, { useState, useEffect, useCallback, useMemo, useRef, useContext } from 'react';
// import PropTypes from 'prop-types';
import { Link, useHistory, useParams, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH } from '@fortawesome/pro-regular-svg-icons';
import 'rc-slider/assets/index.css';
import Header from '../common/Header';
import ActionMenu from '../common/ActionMenu';
import UserAvatar from '../common/UserAvatar';
import { useUnauthorizedErrorHandler } from '../../common/apiHelpers';
import { useFetchUpdates } from '../common/redux/hooks';
import { useFetchAssignedUsers } from '../dashboard/redux/fetchAssignedUsers';
import {
  useFetchCompetencyComments,
  useFetchStageCompetencies,
  useSubmitRecentCompetency
} from './redux/hooks';
import { useFetchUser } from '../user/redux/hooks';
import { useHideCompetency } from '../manage/redux/hooks'
import CompetencyLearnTab from './components/CompetencyPage/CompetencyLearnTab';
import CompetencyCommentsTab from './components/CompetencyPage/CompetencyCommentsTab';
import { AttachmentList } from './components/ActionItemPage/Attachment';

import { Loader, TabSelector, CustomDialog, DesktopHeader, DesktopBackButton } from '../common';
import useQuery from '../common/useQuery';
import { AgoraClientContext } from '../common/agoraHelpers';
import StudentInfo from './components/StudentInfo';

import Linkify from 'react-linkify';


const tabNames = {
  learnTab: 'learn',
  moreTab: 'more',
  commentsTab: 'comments',
};

const CompetencyMoreTab = ({ competency }) => (
  <div className="roadmap-competency-page-competency-more-tab">
    <p className="print-header">More</p>
    <Linkify componentDecorator={(decoratedHref, decoratedText, key) => ( <a target="blank" href={decoratedHref} key={key}> {decoratedText} </a> )}>
      <div
        className="embed theme-text-secondary"
        dangerouslySetInnerHTML={{ __html: competency.content }}
      />
    </Linkify>
    <AttachmentList data={competency.attachments.filter(att => att.user_id === null)} canDelete={false} />
  </div>
)

export default function CompetencyPage() {
  const history = useHistory();
  const { roadmapId, stageId, competencyId } = useParams();
  const location = useLocation();

  const queryParams = queryString.parse(location.search);
  const selectedTab = queryParams.tab && Object.values(tabNames).indexOf(queryParams.tab) >= 0
    ? queryParams.tab : tabNames.learnTab;

  const [activeTab, setActiveTab] = useState(selectedTab);
  const [student, setStudent] = useState(null);
  const [optionMenu, setOptionMenu] = useState(false);
  const [hideCompetencyDialog, setHideCompetencyDialog] = useState(false);
  const { fetchAssignedUsers } = useFetchAssignedUsers();
  const { hideCompetency, hideCompetencyPending } = useHideCompetency();
  const { competencies, fetchStageCompetencies } = useFetchStageCompetencies();
  const {
    comments,
    addCompetencyComment,
    removeCompetencyComment,
    fetchCompetencyComments,
    fetchCompetencyCommentsPending
  } = useFetchCompetencyComments();
  const { user, replaceStringWithSynonyms } = useFetchUser();
  const { updates, fetchUpdates } = useFetchUpdates();
  const { submitRecentCompetency } = useSubmitRecentCompetency();
  const unauthorizedErrorHandler = useUnauthorizedErrorHandler();
  const query = useQuery();
  const [commentsAgoraChannel, setCommentsAgoraChannel] = useState(undefined);
  const [printMode, setPrintMode] = useState(false);

  const studentId = query && Number(query.get('user'))

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  
  useEffect(() => {
    if (!!studentId) {
      fetchAssignedUsers({ userId: studentId })
        .then(res => setStudent(res.results[0]))
    }
  }, [fetchAssignedUsers, studentId])

  const commentsStudentId = useMemo(() => {
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
    }
    return user.id;
  }, [user, query]);

  useEffect(() => {
    if (!competencyId) {
      history.push('/dashboard/roadmaps');
      return;
    }
    async function fetchCompetencyData() {
      await fetchStageCompetencies({
        roadmapId,
        stageId,
        competencyId,
        studentId,
        attachment: true
      });
      await fetchCompetencyComments({ roadmapId, stageId, competencyId, studentId: commentsStudentId });
    }
    fetchCompetencyData()
      .catch(unauthorizedErrorHandler)
      .catch(err => {
        if (err.response && err.response.status === 404) {
          history.push('/dashboard/roadmaps');
        } else {
          throw err;
        }
      });
  }, [
    competencyId,
    history,
    studentId,
    fetchStageCompetencies,
    roadmapId,
    stageId,
    fetchCompetencyComments,
    unauthorizedErrorHandler,
    commentsStudentId,
  ]);

  const recentTimer = useRef(null);
  const submitRecentActivity = useCallback(() => {
    recentTimer.current = setTimeout(() => {
      submitRecentCompetency({
        roadmap_id: roadmapId,
        studentId,
        competency: competencyId
      }).catch(unauthorizedErrorHandler);
    }, 3000);
  }, [
    roadmapId,
    competencyId,
    studentId,
    submitRecentCompetency,
    unauthorizedErrorHandler
  ]);

  useEffect(() => {
    if (!!studentId) return;
    submitRecentActivity();
    return () => {
      clearTimeout(recentTimer.current);
    }
  }, [studentId, submitRecentActivity]);

  const selectedCompetency = competencies[competencyId];

  const refetchCompetency = useCallback(() => {
    fetchStageCompetencies({ roadmapId, stageId, competencyId }).catch(unauthorizedErrorHandler);
  }, [
    fetchStageCompetencies,
    roadmapId,
    stageId,
    competencyId,
    unauthorizedErrorHandler,
  ]);

  const tabs = useMemo(() => {
    const unseenComments = !!selectedCompetency &&
      updates?.unseen_activity?.[commentsStudentId]?.competency_comments.indexOf(selectedCompetency.id) >= 0

    const tabs = [{ key: tabNames.learnTab, label: 'Learn', dot: false }]

    if (selectedCompetency) {
      if (selectedCompetency.content ||
        (selectedCompetency.attachments_visible && selectedCompetency.attachment_urls))
      {
        tabs.push({ key: tabNames.moreTab, label: 'More', dot: false });
      }
      if (selectedCompetency.comments_visible) {
        tabs.push({ key: tabNames.commentsTab, label: 'Comments', dot: unseenComments })
      }
    }
    return tabs;
  }, [selectedCompetency, updates, commentsStudentId])

  const handleOptionClick = useCallback(() => setOptionMenu(true), [])

  const handleOptionMenuClose = useCallback(() => setOptionMenu(false), [])

  const handleHideCompetencyClick = useCallback(() => {
    setOptionMenu(false)
    setHideCompetencyDialog(true)
  }, [])

  const handlePrintCompetencyClick = useCallback(() => {
    setPrintMode(true);
  }, [])

  const handleEditCompetencyClick = useCallback(() => {
    const loc = {
      pathname: `/manage/roadmaps/${roadmapId}/stages/${stageId}/competencies/${competencyId}`,
      state:{
        backLink: location
      }
    }
    history.replace(loc);
  }, [history, roadmapId, stageId, competencyId, location])

  const handleHideCompetencyDialogClose = useCallback(() => setHideCompetencyDialog(false), [])

  const hiddenForStudent = useMemo(() => {
    if (
      studentId &&
      selectedCompetency &&
      selectedCompetency.hidden_for
    ) {
      return selectedCompetency.hidden_for.includes(studentId)
    }
    return false
  }, [studentId, selectedCompetency])

  const handleHideCompetencyConfirm = useCallback(
    () => {
      setHideCompetencyDialog(false)
      hideCompetency({
        roadmapId,
        stageId,
        competencyId,
        studentId,
        hide: !hiddenForStudent
      })
    },
    [
      hideCompetency,
      hiddenForStudent,
      roadmapId,
      stageId,
      competencyId,
      studentId
    ]
  )

  const currentUserIsCoachOrAdmin = user && (user.groups.includes('Admin') || user.groups.includes('Coach'));

  const studentSpecificCompetency = selectedCompetency && selectedCompetency.user_defined;

  const hideCompetencyEnabled = user && studentId &&
    user.features.coach_admin_can_edit_competencies_visibility &&
    currentUserIsCoachOrAdmin && !studentSpecificCompetency;

  const actionMenuItems = [];
  if (hideCompetencyEnabled) actionMenuItems.push({
    label: replaceStringWithSynonyms(`${hiddenForStudent ? 'Unhide' : 'Hide'} Competency for Student`),
    onClick: handleHideCompetencyClick
  });
  if (user && user.features.show_print_competency_button) actionMenuItems.push({
    label: 'Print Competency',
    onClick: handlePrintCompetencyClick
  });
  if (currentUserIsCoachOrAdmin && studentSpecificCompetency && studentId) actionMenuItems.push({
    label: 'Edit Competency',
    onClick: handleEditCompetencyClick
  });

  const renderOption = useCallback(() => {
    const buttonProps = {};
    if (actionMenuItems.length > 0) {
      buttonProps.disabled = hideCompetencyPending;
      buttonProps.onClick = handleOptionClick;
    } else {
      // Making button non-interactive and hidden helps with centering header content
      buttonProps.style = {visibility: "hidden"};
    }
    return (
      <Link
      to={location}
        {...buttonProps}
      >
        <FontAwesomeIcon icon={faEllipsisH} />
      </Link>
    )
  }, [
    actionMenuItems.length,
    hideCompetencyPending,
    handleOptionClick,
    location
  ])

  const agoraClient = useContext(AgoraClientContext);

  const channelMessageHandler = useCallback(({ text }, senderId) => {
    const jsonComment = JSON.parse(text);
    if (jsonComment.action === 'add') {
      addCompetencyComment(jsonComment.comment)
    } else if (jsonComment.action === 'remove') {
      removeCompetencyComment(jsonComment.commentId)
    }
  }, [addCompetencyComment, removeCompetencyComment]);

  useEffect(() => {
    if (!agoraClient || !competencyId) return;
    const channel = agoraClient.createChannel(`competency-${competencyId}-comments`);
    channel.join().then(() => {
      channel.on('ChannelMessage', channelMessageHandler);
      setCommentsAgoraChannel(channel);
    });
    return () => {
      if (channel) channel.leave();
      setCommentsAgoraChannel(undefined);
    };
  }, [ agoraClient, competencyId, channelMessageHandler ]);

  useEffect(() => {
    function afterPrintHandler() {
      setPrintMode(false);
      setOptionMenu(false);
    }
    window.addEventListener("afterprint", afterPrintHandler);
    return () => window.removeEventListener("afterprint", afterPrintHandler);
  }, []);

  useEffect(() => { if (printMode) window.print(); }, [printMode]);

  if (!selectedCompetency) {
    return <Loader />
  }

  const defaultBackLink = `/roadmap/${roadmapId}`;

  return (
    <div className="roadmap-competency-page">
      <Header
        icon="back"
        title={selectedCompetency && selectedCompetency.title}
        colSizes={['auto', '', 'auto']}
        thirdColumnClass="third-column"
        renderThirdColumn={renderOption}
        defaultBackLink={defaultBackLink}
      >
        <>
          {student && studentId && (
            <div className='d-flex mrm-my-0_25 justify-content-center align-items-center'>
              <UserAvatar user={student} size='sm' className="mrm-mr-0_5" />
              <strong>{student.first_name} {student.last_name}</strong>
            </div>
          )}
          <TabSelector
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={tabs}
          />
        </>
      </Header>
      <DesktopHeader showPrimaryContent={false}>
        <div className="card desktop-header-container">
          <Container>
            <Row className="d-flex align-items-start">
              <Col xs={1}>
                <div className="back-button-container">
                  <DesktopBackButton defaultBackLink={defaultBackLink} />
                </div>
              </Col>
              <Col xs={10}>
                <StudentInfo student={student} />
                {selectedCompetency && <h2 className="text-center">
                  {selectedCompetency.title}
                </h2>}
              </Col>
              <Col xs={1}>
                <div className="more-btn-desktop float-right">{renderOption()}</div>
              </Col>
            </Row>
            <TabSelector
              activeTab={activeTab}
              onTabChange={setActiveTab}
              tabs={tabs}
            />
          </Container>
        </div>
      </DesktopHeader>
      <Container className="primary-content normal-width-container">
        {hideCompetencyPending && (
          <Loader />
        )}       
        {(activeTab === tabNames.learnTab || printMode) && <>
          <div className='mrm-p-1 mrm-mb-4'>
            <CompetencyLearnTab
              competency={selectedCompetency}
              refetchCompetency={refetchCompetency}
              roadmapId={roadmapId}
              user={user}
            />
          </div>
        </>}
        {(activeTab === tabNames.moreTab || printMode) && <>
          <div className='mrm-p-1'>
            {printMode && <p>More</p>}
            <CompetencyMoreTab
              competency={selectedCompetency}
              roadmapId={roadmapId}
            />
          </div>
        </>}
        {selectedCompetency.comments_visible && (activeTab === tabNames.commentsTab || printMode) && (
          <CompetencyCommentsTab
            comments={comments}
            competencyId={competencyId}
            roadmapId={roadmapId}
            stageId={stageId}
            user={user}
            onLoadMoreComments={fetchCompetencyComments}
            onAddNewComment={comment => {
              addCompetencyComment(comment)
              if (commentsAgoraChannel) {
                commentsAgoraChannel.sendMessage({
                  text: JSON.stringify({
                    action: 'add',
                    comment: comment,
                  }),
                })
              }
            }}
            onDeleteComment={comment => {
              removeCompetencyComment(comment.id)
              if (commentsAgoraChannel) {
                commentsAgoraChannel.sendMessage({
                  text: JSON.stringify({
                    action: 'remove',
                    commentId: comment.id,
                  })
                })
              }
            }}
            fetchCommentsPending={fetchCompetencyCommentsPending}
            fetchUpdates={fetchUpdates}
            unseenComments={updates?.unseen_activity?.[commentsStudentId]?.comments || []}
            student={student}
          />
        )}
      </Container>
      {!printMode && <ActionMenu
        show={optionMenu}
        onHide={handleOptionMenuClose}
        items={actionMenuItems}
      />}
      <CustomDialog
        show={hideCompetencyDialog}
        text={{
          caption: replaceStringWithSynonyms(`${hiddenForStudent ? 'Unhide' : 'Hide'} competency for this student?`),
          yes: 'Yes'
        }}
        onHide={handleHideCompetencyDialogClose}
        onYes={handleHideCompetencyConfirm}
      />
    </div>
  );
}

CompetencyPage.propTypes = {};
CompetencyPage.defaultProps = {};
