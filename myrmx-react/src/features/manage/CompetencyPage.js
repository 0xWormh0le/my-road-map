import React, { useCallback, useEffect, useState, useMemo, useRef } from 'react';
import { Link, useHistory, useParams, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { isEmpty } from 'lodash';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEllipsisH, faAlignLeft, faPaperclip, faExternalLink, faChevronLeft } from '@fortawesome/pro-regular-svg-icons';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { Header, ActionMenu, CustomDialog, Loader, DesktopHeader, DesktopBackButton } from '../common';
import TextareaAutosize from 'react-textarea-autosize';
import { 
  useFetchStageCompetencies, 
  useFetchCompetencyGlobalActionItems,
  useAddCompetencyAttachment,
  useDeleteCompetencyAttachment
} from '../roadmap/redux/hooks';
import { useFetchUser } from '../user/redux/hooks';
import { useUnauthorizedErrorHandler } from '../../common/apiHelpers';
import AttachmentModal, { AttachmentList } from '../roadmap/components/ActionItemPage/Attachment';
import AddCompetencySupplementalContent from './AddCompetencySupplementalContent';
import AddCompetencyIntroContent from './AddCompetencyIntroContent';
import { 
  useDeleteCompetency, 
  useCopyCompetency, 
  useUpdateCompetency, 
  useDeleteGlobalActionItem,
  useFetchGlobalQuestions,
  useDeleteGlobalQuestion,
  useReorderActionItems,
  useReorderGlobalQuestions,
} from './redux/hooks';
import useEffectiveBackLink from '../common/useEffectiveBackLinkHook';
import AddCompetencyCoachNotes from './AddCompetencyCoachNotes';
import RenameCompetency from './RenameCompetency';

const schema = yup.object().shape({
  external_url: yup.string().required()
})
export default function CompetencyPage() {
  const history = useHistory()
  const { roadmapId, stageId, competencyId } = useParams()
  const { competencies, fetchStageCompetencies, fetchStageCompetenciesPending } = useFetchStageCompetencies()
  const { user } = useFetchUser()
  const { deleteCompetency } = useDeleteCompetency()
  const { copyCompetency } = useCopyCompetency()
  const { updateCompetency } = useUpdateCompetency()
  const { actionItems, fetchCompetencyGlobalActionItems, fetchCompetencyGlobalActionItemsPending } = useFetchCompetencyGlobalActionItems()
  const { globalQuestions, fetchGlobalQuestions, fetchGlobalQuestionsPending } = useFetchGlobalQuestions()
  const { deleteGlobalQuestion } = useDeleteGlobalQuestion()
  const { deleteGlobalActionItem } = useDeleteGlobalActionItem()
  const {
    addCompetencyAttachment,
    addCompetencyAttachmentPending,
    addCompetencyAttachmentReset,
    addCompetencyAttachmentProgress,
    addCompetencyAttachmentError
  } = useAddCompetencyAttachment()
  const { deleteCompetencyAttachment } = useDeleteCompetencyAttachment()
  const [ competencyMenu, setCompetencyMenu ] = useState(null)
  const [ aiMenu, setAIMenu ] = useState(null)
  const [ questionMenu, setQuestionMenu ] = useState(null)
  const [ deleteModal, setDeleteModal ] = useState(null)
  const [ deleteAIModal, setDeleteAIModal ] = useState(null)
  const [ deleteQuestionModal, setDeleteQuestionModal ] = useState(null)
  const [ addSupplementalModal, setAddSupplementalModal ] = useState(false)
  const [ addAttachmentModal, setAddAttachmentModal ] = useState(false)
  const [ attachment, setAttachment ] = useState(null)
  const [ attachUrl, setAttachUrl ] = useState(false)
  const [competency, setCompetency] = useState(null)
  const [displaySupplementalContentEditor, setDisplaySupplementalContentEditor] = useState(false)
  const [displayIntroContentEditor, setDisplayIntroContentEditor] = useState(false)
  const [displayCoachNotesEditor, setDisplayCoachNotesEditor] = useState(false)
  const [displayRenameCompetencyForm, setDisplayRenameCompetencyForm] = useState(false)
  const unauthorizedErrorHandler = useUnauthorizedErrorHandler()
  const fileEl = useRef({})
  const assessmentEls = useRef([])
  const { reorderActionItems, reorderActionItemsPending } = useReorderActionItems();
  const { reorderGlobalQuestions, reorderGlobalQuestionsPending } = useReorderGlobalQuestions();

  const { register, handleSubmit, setError, errors } = useForm({
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    if (!roadmapId || !stageId || !user) {
      return
    }
    fetchStageCompetencies({ roadmapId, userId: user.id, stageId, competencyId, attachment: true }).catch(unauthorizedErrorHandler)
    fetchCompetencyGlobalActionItems({ roadmapId, stageId, competencyId })
    fetchGlobalQuestions({roadmapId, stageId, competencyId})
  }, [
    roadmapId, 
    stageId, 
    competencyId, 
    user, 
    fetchStageCompetencies, 
    fetchCompetencyGlobalActionItems, 
    fetchGlobalQuestions,
    unauthorizedErrorHandler
  ])

  useEffect(() => {
    setCompetency(competencies && competencyId ? competencies[competencyId] : null);
  }, [competencies, competencyId])

  const handleAIMenuClick = useCallback(ai => () => setAIMenu(ai), [])
  const handleHideAIMenu = useCallback(() => setAIMenu(null), [])

  const handleQuestionMenuClick = useCallback(questionId => () => setQuestionMenu(questionId), [])
  const handleHideQuestionMenu = useCallback(() => setQuestionMenu(null), [])

  const handleCompetencyMenuClick = useCallback(() =>
    setCompetencyMenu(competencyId)
  , [competencyId])

  const handleHideCompetencyMenu = useCallback(() => 
    setCompetencyMenu(null)
  , [])

  const defaultBackLink = `/manage/roadmaps/${roadmapId}`;
  const effectiveBackLink = useEffectiveBackLink(defaultBackLink);
  const location = useLocation()
  const redirectBack = useCallback(() => {
    history.push(effectiveBackLink);
  }, [history, effectiveBackLink]);

  const showRenameCompetencyForm = useCallback(() => {
    setDisplayRenameCompetencyForm(true);
    handleHideCompetencyMenu();

  }, [setDisplayRenameCompetencyForm, handleHideCompetencyMenu])
  
  const handleCopyCompetencyClick = useCallback(() => {
    copyCompetency({roadmapId, stageId, competencyId}).then(redirectBack)
  }, [roadmapId, stageId, competencyId, copyCompetency, redirectBack])

  const handleDeleteCompetencyClick = useCallback(() => {
    setDeleteModal(competencyMenu)
    handleHideCompetencyMenu()
  }, [competencyMenu, handleHideCompetencyMenu])

  const handleDeleteDialogClose = useCallback(() => setDeleteModal(null), [])

  const handleDeleteDialogConfirm = useCallback(() => {
    deleteCompetency({roadmapId, stageId, competencyId}).then(history.go(-2))
  }, [roadmapId, stageId, competencyId, deleteCompetency, history])

  const handleDeleteActionItemClick = useCallback(() => {
    setDeleteAIModal(aiMenu)
    handleHideAIMenu()
  }, [aiMenu, handleHideAIMenu])

  const handleDeleteAIDialogClose = useCallback(() => setDeleteAIModal(null), [])

  const handleDeleteAIDialogConfirm = useCallback(() => {
    deleteGlobalActionItem({roadmapId, stageId, competencyId, actionItemId: deleteAIModal})
      .then(() => {
        handleDeleteAIDialogClose()
        fetchCompetencyGlobalActionItems({ roadmapId, stageId, competencyId })
      })
  }, [roadmapId, stageId, competencyId, deleteAIModal, handleDeleteAIDialogClose, deleteGlobalActionItem, fetchCompetencyGlobalActionItems])

  const handleDeleteQuestionItemClick = useCallback(() => {
    setDeleteQuestionModal(questionMenu)
    handleHideQuestionMenu()
  }, [questionMenu, handleHideQuestionMenu])

  const handleDeleteQuestionDialogClose = useCallback(() => setDeleteQuestionModal(null), [])

  const handleDeleteQuestionDialogConfirm = useCallback(() => {
    deleteGlobalQuestion({roadmapId, stageId, competencyId, questionId: deleteQuestionModal})
      .then(() => {
        handleDeleteQuestionDialogClose()
      })
  }, [roadmapId, stageId, competencyId, deleteQuestionModal, handleDeleteQuestionDialogClose, deleteGlobalQuestion])

  const handleUpdateCoachNotesClick = useCallback(() => {
    if (user && user.features.coach_notes_enabled) {
      history.push(`/manage/roadmaps/${roadmapId}/stages/${stageId}/competencies/${competencyId}/add-notes`)
    }
  }, [roadmapId, stageId, competencyId, user, history])

  const handleUpdateIntroClick = useCallback(() => 
    history.push(`/manage/roadmaps/${roadmapId}/stages/${stageId}/competencies/${competencyId}/add-intro`)
  , [roadmapId, stageId, competencyId, history])

  const handleSupplementalContentClick = useCallback(() => 
    history.push(`/manage/roadmaps/${roadmapId}/stages/${stageId}/competencies/${competencyId}/supplemental/add-content`)
  , [roadmapId, stageId, competencyId, history])
  
  const handleHideClick = useCallback(field => () => {
    updateCompetency({roadmap: roadmapId, stage: stageId, competency: competencyId, [field]: !competency[field]})
      .then(() => {
        fetchStageCompetencies({ roadmapId, userId: user.id, stageId, attachment: true })
        handleHideCompetencyMenu()
      })
  }, [
    roadmapId, 
    stageId, 
    competencyId, 
    user, 
    competency, 
    fetchStageCompetencies, 
    updateCompetency, 
    handleHideCompetencyMenu
  ])

  const handleAddSupplementalClick = useCallback(() => setAddSupplementalModal(true), [])
  const handleHideAddSupplementalModal = useCallback(() => setAddSupplementalModal(false), [])

  const handleAttachmentClick = useCallback(() => {
    setAddAttachmentModal(true)
    handleHideAddSupplementalModal()
  }, [handleHideAddSupplementalModal])

  const handleHideAddAttachmentModal = useCallback(() => setAddAttachmentModal(false), [])
  
  const handleBackAddSupplementalModal = useCallback(() => {
    handleHideAddAttachmentModal()
    handleAddSupplementalClick()
  }, [handleHideAddAttachmentModal, handleAddSupplementalClick])

  const handleAttachUrlClick = useCallback(() => {
    setAttachUrl(true)
    setAddAttachmentModal(false)
  }, [])

  const handleHideAttachUrl = useCallback(() => setAttachUrl(false), [])

  const handleError = useCallback(
    err => Object.keys(err).forEach(key => {
      const errors = err[key]
      if (errors.length) {
        setError(key, { message: errors[0], type: 'remote' })
      }
    }),
    [setError]
  )

  const handleAttachUrlSaveClick = useCallback(({external_url}) => {
    const data = new FormData()
    data.append('external_url', external_url)
    addCompetencyAttachment({roadmapId, competency, data})
      .catch(e => handleError(e.response.data))
      .then(handleHideAttachUrl)
  }, [roadmapId, competency, addCompetencyAttachment, handleError, handleHideAttachUrl])

  const handleChangeAssessment = useCallback(index => e => {
    const description = assessmentEls.current[index].value
    let data = {roadmap: roadmapId, stage: stageId, competency: competencyId}
    switch(index) {
      case 0:
        data.red_description = description
        break
      case 1:
        data.yellow_description = description
        break
      default:
        data.green_description = description
        break
    }
    updateCompetency(data)
  }, [roadmapId, stageId, competencyId, updateCompetency])

  const handleChooseFileClick = useCallback(type => () => {
    fileEl.current.attachType = type
    fileEl.current.click()
  }, [])
  
  const handleAttachmentDelete = useCallback(
    attachmentId => deleteCompetencyAttachment({
      roadmapId,
      competency,
      attachmentId
    }),[roadmapId, competency, deleteCompetencyAttachment]
  )

  const handleFileChange = useCallback(
    () => {
      addCompetencyAttachmentReset()
      handleHideAddAttachmentModal()
      setAttachment({
        type: fileEl.current.attachType,
        path: fileEl.current.files[0].name
      })
    }, [handleHideAddAttachmentModal, addCompetencyAttachmentReset]
  )

  const handleAttachConfirmHide = useCallback(() => {
    fileEl.current.value = null;
    setAttachment(null);
  }, [])

  const handleConfirmUpload = useCallback(() => {
    const data = new FormData()
    data.append('attachment', fileEl.current.files[0])
    data.append('file_category', 'ATTACHMENT')

    addCompetencyAttachment({
      roadmapId,
      competency,
      data
    })
  }, [roadmapId, competency, addCompetencyAttachment])

  const aiMenuItems = useMemo(() => {
    if (!actionItems || !aiMenu) {
      return []
    } else {
      return [
        { label: actionItems[aiMenu].aiTitle, className: 'bold' },
        { label: 'Edit', to: {
          pathname: `/manage/roadmaps/${roadmapId}/stages/${stageId}/competencies/${competencyId}/ai/${aiMenu}`,
          state: { backLink: location.pathname }
        } },
        { label: 'Delete', className: 'text-danger', onClick:  handleDeleteActionItemClick},
      ]
    }
  }, [actionItems, aiMenu, roadmapId, stageId, competencyId, handleDeleteActionItemClick, location])

  const questionMenuItems = useMemo(() => {
    if (!globalQuestions || !questionMenu) {
      return []
    } else {
      return [
        { label: globalQuestions.find(x => x.id === questionMenu).question, className: 'bold' },
        { label: 'Edit', to: {
          pathname: `/manage/roadmaps/${roadmapId}/stages/${stageId}/competencies/${competencyId}/questions/${questionMenu}`,
          state: { backLink: location.pathname }
        } },
        { label: 'Delete', className: 'text-danger', onClick:  handleDeleteQuestionItemClick},
      ]
    }
  }, [globalQuestions, questionMenu, roadmapId, stageId, competencyId, handleDeleteQuestionItemClick, location])

  const competencyMenuItems = useMemo(() => {
    const result = [
      { label: 'Rename', 
        className: 'show-rename-competency-form-desktop d-none d-lg-inline-block', 
        onClick: showRenameCompetencyForm 
      },
      { label: 'Rename', 
        className: 'd-lg-none', 
        to: {
          pathname: `/manage/roadmaps/${roadmapId}/stages/${stageId}/competencies/${competencyMenu}/rename`,
          state:{ backLink: location }
        } 
      },
      { label: 'Copy', onClick: handleCopyCompetencyClick },
      { label: competency && competency.comments_visible ? 'Hide Comment Section' :  'Unhide Comment Section', onClick: handleHideClick('comments_visible') },
      { label: competency && competency.ai_visible ? 'Hide Action Item Section' : 'Unhide Action Item Section', onClick: handleHideClick('ai_visible') },
      { label: competency && competency.attachments_visible ? 'Hide File Attachment Section' : 'Unhide File Attachment Section', onClick: handleHideClick('attachments_visible') },

      { label: 'Delete', className: 'text-danger', onClick: handleDeleteCompetencyClick }
    ];
    if (competency && !competency.user_defined) {
      result.splice(6, 0, {
        label: competency && competency.hidden_for_all_users ? 'Unhide Competency for all users' : 'Hide Competency for all users',
        className: 'text-danger',
        onClick: handleHideClick('hidden_for_all_users')
      });
    }
    return result;
  }, [
    roadmapId, 
    stageId, 
    competencyMenu, 
    competency, 
    showRenameCompetencyForm,
    handleCopyCompetencyClick, 
    handleHideClick, 
    handleDeleteCompetencyClick,
    location
  ])
  
  const loader = fetchCompetencyGlobalActionItemsPending ||
                reorderActionItemsPending ||
                fetchStageCompetenciesPending ||
                fetchGlobalQuestionsPending ||
                reorderGlobalQuestionsPending;

  const reorder = useCallback((list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  }, []);

  const actionItemsList = useMemo(
    () => Object.keys(actionItems).map(key => actionItems[key]).sort((a, b) => (a.order > b.order ? 1 : -1)),
    [actionItems],
  );

  const onDragEnd = result => {
    if (!result.destination) {
      return;
    }
    if (result.type === "ai") {
      const reorderedActionItems = reorder(
        actionItemsList,
        result.source.index,
        result.destination.index,
      );
      const actionItemsOrder = Object.assign({}, ...reorderedActionItems.map((x, index) => ({[x.id]: index})));
      reorderActionItems({roadmapId, stageId, competencyId, order_mapping: actionItemsOrder})
        .then(() => fetchCompetencyGlobalActionItems({ roadmapId, stageId, competencyId }))
        .catch(unauthorizedErrorHandler);
    } else if (result.type === "questions") {
      const reorderedQuestions = reorder(
        globalQuestions,
        result.source.index,
        result.destination.index,
      );
      const questionsOrder = Object.assign({}, ...reorderedQuestions.map((x, index) => ({[x.id]: index})));
      reorderGlobalQuestions({roadmapId, stageId, competencyId, order_mapping: questionsOrder})
        .then(() => fetchGlobalQuestions({ roadmapId, stageId, competencyId }))
        .catch(unauthorizedErrorHandler);
    }
  }

  const getDraggableItemStyle = (isDragging, draggableStyle) => ({
    userSelect: "none",
    borderBottom: isDragging ? "none" : "1px solid #cccccc" ,
    boxShadow: isDragging ? "0px 4px 3px 0px #cccccc" : "none",
    ...draggableStyle
  });

  // Supplemental content

  const showSupplementalContentEditor = () => {
    handleHideAddSupplementalModal();
    setDisplaySupplementalContentEditor(true);
  }

  const hideSupplementalContentEditor = () => {
    setDisplaySupplementalContentEditor(false);
  }

  const updateSupplementalContent = () => {
    fetchStageCompetencies({ roadmapId, userId: user.id, stageId, attachment: true });
    hideSupplementalContentEditor();
  }

  const addCompetencySupplementalContentProps = {
    roadmapId: roadmapId,
    stageId: stageId,
    competencyId: competencyId,
    user: user,
    competency: competency,
    fetchStageCompetenciesPending: fetchStageCompetenciesPending,
    updateSupplementalContent: updateSupplementalContent,
    hideSupplementalContentEditor: hideSupplementalContentEditor,
  }

  // Intro content

  const showIntroContentEditor = () => {
    setDisplayIntroContentEditor(true);
  }

  const hideIntroContentEditor = () => {
    setDisplayIntroContentEditor(false);
  }

  const updateIntroContent = () => {
    fetchStageCompetencies({ roadmapId, userId: user.id, stageId, attachment: true });
    hideIntroContentEditor();
  }

  const addCompetencyIntroContentProps = {
    roadmapId: roadmapId,
    stageId: stageId,
    competencyId: competencyId,
    competency: competency,
    fetchStageCompetenciesPending: fetchStageCompetenciesPending,
    updateIntroContent: updateIntroContent,
    hideIntroContentEditor: hideIntroContentEditor,
  }

  // Coach notes

  const showCoachNotesEditor = () => {
    setDisplayCoachNotesEditor(true);
  }

  const hideCoachNotesEditor = () => {
    setDisplayCoachNotesEditor(false);
  }

  const updateCoachNotes = () => {
    fetchStageCompetencies({ roadmapId, userId: user.id, stageId, attachment: true });
    hideCoachNotesEditor();
  }

  const addCompetencyCoachNotesProps = {
    roadmapId: roadmapId,
    stageId: stageId,
    competencyId: competencyId,
    competency: competency,
    fetchStageCompetenciesPending: fetchStageCompetenciesPending,
    updateCoachNotes: updateCoachNotes,
    hideCoachNotesEditor: hideCoachNotesEditor,
  }

  // Rename Competency
  
  const hideRenameCompetencyForm = () => {
    setDisplayRenameCompetencyForm(false);
  }

  const updateRenameCompetency = () => {
    fetchStageCompetencies({ roadmapId, userId: user.id, stageId, attachment: true });
    hideRenameCompetencyForm();
  }

  const RenameCompetencyProps = {
    roadmapId: roadmapId,
    stageId: stageId,
    competencyId: competencyId,
    competency: competency,
    fetchStageCompetenciesPending: fetchStageCompetenciesPending,
    updateRenameCompetency: updateRenameCompetency,
    hideRenameCompetencyForm: hideRenameCompetencyForm,
  }

  return (
    <div className="manage-competency-page">
      <Header
        border
        icon="back"
        title="Edit Competency"
        colSizes={['auto', undefined, 'auto']}
        renderThirdColumn={() => (
          <FontAwesomeIcon icon={faEllipsisH} onClick={handleCompetencyMenuClick} />
        )}
        defaultBackLink={effectiveBackLink}
      >
        {competency && (
          <div className="d-flex align-items-center justify-content-center mrm-mt-1">
            <strong className='mrm-ml-0_5'>{competency.title}</strong>
          </div>
        )}
      </Header>
      <DesktopHeader replacePrimaryContent={true}>
        <Container>
          <Row>
            <Col xs={1}>
              <DesktopBackButton defaultBackLink={effectiveBackLink} />
            </Col>
            <Col xs={10}>
              {competency && (
                displayRenameCompetencyForm ?
                  <RenameCompetency 
                    {...RenameCompetencyProps}
                  />    
                :
                  <h2 className="competency-title-clickable text-center mrm-my-1_5 mrm-py-0_5" onClick={showRenameCompetencyForm}>{competency.title}</h2>            
              )} 
            </Col>
            <Col xs={1}>
              <div className="more-btn-desktop float-right"><FontAwesomeIcon icon={faEllipsisH} onClick={handleCompetencyMenuClick} /></div>
            </Col>
          </Row>
        </Container>
      </DesktopHeader>
      { loader && <Loader />}
      <Container className="mrm-pt-1 normal-width-container mrm-mb-3">
        <DragDropContext onDragEnd={onDragEnd}>
          {competency && competency.comments_visible &&
          <Row>
            <Col>
              { competency && !!competency.coach_notes ?
                  <div className="card coach-notes">
                    <strong>Coach Notes</strong>

                    {displayCoachNotesEditor ?
                      <AddCompetencyCoachNotes 
                        {...addCompetencyCoachNotesProps} 
                      /> 
                    :
                      <>
                        {/* Mobile version */}
                        <p className="card--embed mrm-mt-0_5 mb-0 d-lg-none" onClick={handleUpdateCoachNotesClick}>{competency.coach_notes}</p>
                        
                        {/* Desktop version */}
                        <p className="card--embed mrm-mt-0_5 mb-0 d-none d-lg-flex" onClick={showCoachNotesEditor}>{competency.coach_notes}</p>
                      </>
                    }
                    </div>
                :  user && user.features.coach_notes_enabled && 
                  <>
                    {/* Mobile version */}
                    <Link
                      to={`/manage/roadmaps/${roadmapId}/stages/${stageId}/competencies/${competencyId}/add-notes`}
                      className="theme-text-secondary d-lg-none"
                    >
                      <FontAwesomeIcon icon={faPlus} className='mrm-mr-0_25' size="sm" />
                      Add coach notes
                    </Link>

                    {/* Desktop version */}
                    <Link
                      onClick={showCoachNotesEditor}
                      className="theme-text-secondary d-none d-lg-inline"
                    >
                      <FontAwesomeIcon icon={faPlus} className='mrm-mr-0_25' size="sm" />
                      Add coach notes
                    </Link>

                    {displayCoachNotesEditor && (
                      <AddCompetencyCoachNotes
                        {...addCompetencyCoachNotesProps}
                      />
                    )}
                  </>
              }
            </Col>
          </Row>
          }
          <Row className="mrm-my-1">
            <Col>
              { competency && !!competency.description ?
                <div className="card intro-content">
                  <strong>Intro Content</strong>

                  {displayIntroContentEditor ? 
                    <AddCompetencyIntroContent
                      {...addCompetencyIntroContentProps}
                    />
                  :
                    <>
                      {/* Mobile version */}
                      <div onClick={handleUpdateIntroClick} className="card--embed mt-2 d-lg-none" dangerouslySetInnerHTML={{ __html: competency.description }} />
                      
                      {/* Desktop version */}
                      <div onClick={showIntroContentEditor} className="card--embed mt-2 d-none d-lg-flex" dangerouslySetInnerHTML={{ __html: competency.description }} />
                    </>
                  }
                </div>
                :  
                <>
                  {/* Mobile version */}
                  <Link
                    to={`/manage/roadmaps/${roadmapId}/stages/${stageId}/competencies/${competencyId}/add-intro`}
                    className="theme-text-secondary d-lg-none"
                  >
                    <FontAwesomeIcon icon={faPlus} className='mrm-mr-0_25' size="sm" />
                    Add intro content
                  </Link>

                  {/* Desktop version */}
                  <Link
                    onClick={showIntroContentEditor}
                    className="theme-text-secondary d-none d-lg-inline"
                  >
                    <FontAwesomeIcon icon={faPlus} className='mrm-mr-0_25' size="sm" />
                    Add intro content
                  </Link>

                  {displayIntroContentEditor && (
                    <AddCompetencyIntroContent
                      {...addCompetencyIntroContentProps}
                    />
                  )}
                </>
              }
            </Col>
          </Row>
          <Row className="mrm-my-1">
            <Col>
              <div className="card">
                <strong>Assessment</strong>
                {user && user.features.slider_for_competency_assessment ?
                  <div className="assessment-slider-container">
                    <p class="mrm-mb-0_5">How do you feel like you are doing in this area?</p>
                    <div className="slider-container">
                      <Slider
                        min={0}
                        max={10}
                        defaultValue={5}
                        disabled={true}
                        trackStyle={{ background: 'transparent' }}
                      />
                    </div>
                  </div>
                : <div className="assessment-boxes-container">
                    {['red', 'yellow', 'green'].map((color, index) => (
                      <div key={color} className="mrm-mt-0_5">
                        <div className={clsx('assessment-border', color)} />
                          <Form.Control
                            as={TextareaAutosize}
                            minRows={2}
                            maxRows={8}
                            placeholder={`Define the ${color} assessment`}
                            defaultValue={competency && competency[`${color}_description`]}
                            ref={(el) => assessmentEls.current.push(el)}
                            onBlur={handleChangeAssessment(index)}
                            className={clsx('assessment-input', `assessment-input--${color}`)}>
                          </Form.Control>
                      </div>
                    ))}
                  </div>
                }
              </div>
            </Col>
          </Row>
          { competency && competency.ai_visible &&
            <Row className="mrm-my-1">
              <Col>
                {isEmpty(actionItemsList) ?
                    <Link
                      to={`/manage/roadmaps/${roadmapId}/stages/${stageId}/competencies/${competencyId}/ai/add-ai`}
                      className="theme-text-secondary"
                    >
                      <FontAwesomeIcon icon={faPlus} className='mrm-mr-0_25' size="sm" />
                      Add action item
                    </Link>
                  : <div className="card">
                      <strong>Action Items ({actionItemsList.length})</strong>
                      <Droppable droppableId="ai-droppable" type="ai">
                        {(provided) => (
                          <div ref={provided.innerRef}>
                            {actionItemsList.map((ai, index) => (
                              <Draggable key={ai.id} draggableId={`ai-${ai.id}`} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    className="card item mrm-mt-1"
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    style={getDraggableItemStyle(
                                      snapshot.isDragging,
                                      provided.draggableProps.style
                                    )}
                                    {...provided.dragHandleProps}
                                  >
                                    <span>{ai.aiTitle}</span>
                                    <FontAwesomeIcon icon={faEllipsisH} onClick={handleAIMenuClick(ai.id)}/>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                      <Link
                        to={`/manage/roadmaps/${roadmapId}/stages/${stageId}/competencies/${competencyId}/ai/add-ai`}
                        className="theme-text-secondary"
                      >
                        <div className="card item mrm-mt-1 justify-content-center">
                          <FontAwesomeIcon icon={faPlus}/>
                        </div>
                      </Link>
                    </div>
                }
              </Col>
            </Row>
          }
          <Row className="mrm-my-1">
            <Col>
              {globalQuestions && globalQuestions.length ?
                <div className="card">
                <strong>Questions ({globalQuestions.length})</strong>
                <Droppable droppableId="questions-droppable" type="questions">
                  {(provided) => (
                    <div ref={provided.innerRef}>
                      {globalQuestions.map((question, index) => (
                        <Draggable key={question.id} draggableId={`question-${question.id}`} index={index}>
                          {(provided, snapshot) => (
                            <div
                              className="card item mrm-mt-1"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              style={getDraggableItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                              )}
                              {...provided.dragHandleProps}
                            >
                              <span>{question.question}</span>
                              <FontAwesomeIcon icon={faEllipsisH} onClick={handleQuestionMenuClick(question.id)} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                <Link
                  to={`/manage/roadmaps/${roadmapId}/stages/${stageId}/competencies/${competencyId}/questions/add`}
                  className="theme-text-secondary"
                >
                  <div className="card item mrm-mt-1 justify-content-center">
                    <FontAwesomeIcon icon={faPlus}/>
                  </div>
                </Link>
              </div>
            : <Link
                to={`/manage/roadmaps/${roadmapId}/stages/${stageId}/competencies/${competencyId}/questions/add`}
                className="theme-text-secondary"
              >
                <FontAwesomeIcon icon={faPlus} className='mrm-mr-0_25' size="sm" />
                Add questions
              </Link>
            }
            </Col>
          </Row>
          { competency &&
            <Row className="mrm-my-1">
              <Col>
                { (competency.attachments.length || competency.content) ?
                  <div className="card">
                    <strong className="mrm-mb-1">
                      Supplemental Info
                    </strong>

                    <AttachmentList
                      data={competency.attachments.filter(a => !a.user_id)}
                      actionMenuData={{roadmapId, stageId, competencyId}}
                      onDelete={handleAttachmentDelete}
                    />

                    {displaySupplementalContentEditor ?
                      <AddCompetencySupplementalContent
                        {...addCompetencySupplementalContentProps}
                      />
                    :
                    (competency.content && (
                      <>
                        {/* Mobile version */}
                        <div className="card--embed mrm-mb-1 supplemental-info-content d-lg-none" onClick={handleSupplementalContentClick} dangerouslySetInnerHTML={{ __html: competency.content }} />
                       
                        {/* Desktop version */}
                        <div className="card--embed mrm-mb-1 supplemental-info-content d-none d-lg-flex" onClick={showSupplementalContentEditor} dangerouslySetInnerHTML={{ __html: competency.content }} />
                      </>
                    )
                    )}

                    <Link className="card item justify-content-center theme-text-secondary" onClick={handleAddSupplementalClick}>
                      <FontAwesomeIcon icon={faPlus}/>
                    </Link>
                  </div>
                  : 
                  <>
                    <Link className="theme-text-secondary font-weight-bold" onClick={handleAddSupplementalClick}>
                      <FontAwesomeIcon icon={faPlus} className='mrm-mr-0_25' size="sm" />
                      Add supplemental info
                    </Link>

                    {displaySupplementalContentEditor && (
                      <AddCompetencySupplementalContent
                        {...addCompetencySupplementalContentProps}
                      />
                    )}
                  </>
                }
              </Col>
            </Row>
          }
        </DragDropContext>
      </Container>
      <input type="file" ref={fileEl} onChange={handleFileChange} hidden />
      <ActionMenu
        show={!!competencyMenu}
        onHide={handleHideCompetencyMenu}
        items={competencyMenuItems}
      />
      <ActionMenu
        show={!!aiMenu}
        onHide={handleHideAIMenu}
        items={aiMenuItems}
      />
      <ActionMenu
        show={!!questionMenu}
        onHide={handleHideQuestionMenu}
        items={questionMenuItems}
      />
      <CustomDialog
        text={{
          caption: 'Deleting a Competency is permanent. There is no way to undo this.',
          yes: 'Delete'
        }}
        show={!!deleteModal}
        onHide={handleDeleteDialogClose}
        onYes={handleDeleteDialogConfirm}
      />
      <CustomDialog
        text={{
          caption: 'Deleting an action item is permanent. There is no way to undo this.',
          yes: 'Delete'
        }}
        show={!!deleteAIModal}
        onHide={handleDeleteAIDialogClose}
        onYes={handleDeleteAIDialogConfirm}
      />
      <CustomDialog
        text={{
          caption: 'Deleting a question is permanent. There is no way to undo this.',
          yes: 'Delete'
        }}
        show={!!deleteQuestionModal}
        onHide={handleDeleteQuestionDialogClose}
        onYes={handleDeleteQuestionDialogConfirm}
      />

      <Modal show={addSupplementalModal} onHide={handleHideAddSupplementalModal} className='supplemental-dialog modal-mobile-slide-from-bottom' centered>
        <Modal.Body>
          <div className="position-relative">
            <h2 className='text-center font-weight-bold mrm-m-1'>Add Supplemental Info</h2>
            <div className="border-thin"></div>
            {/* Mobile version */}
            <Link
              to={`/manage/roadmaps/${roadmapId}/stages/${stageId}/competencies/${competencyId}/supplemental/add-content`}
              className="theme-text-primary font-weight-normal mrm-p-1 d-block d-lg-none"
            >
              <FontAwesomeIcon icon={faAlignLeft} size="sm" className="mrm-mr-1" />Content
            </Link>
            
            {/* Desktop version */}
            <Link
              onClick={showSupplementalContentEditor}
              className="theme-text-primary font-weight-normal mrm-p-1 d-none d-lg-block"
            >
              <FontAwesomeIcon icon={faAlignLeft} size="sm" className="mrm-mr-1" />Content
            </Link>

            <div className="border-thin"></div>
            <Link className="theme-text-primary font-weight-normal mrm-p-1 d-block" onClick={handleAttachmentClick}>
              <FontAwesomeIcon icon={faPaperclip} size="sm" className="mrm-mr-1" />Attachment
            </Link>
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={addAttachmentModal} onHide={handleHideAddAttachmentModal} className='supplemental-dialog modal-mobile-slide-from-bottom' centered>
        <Modal.Body>
          <div className="position-relative">
            <div className="icon-header">
              <FontAwesomeIcon className="mrm-ml-1" icon={faChevronLeft} size="sm" onClick={handleBackAddSupplementalModal} />
              <h2 className='text-center font-weight-bold mrm-m-1'>Add Attachment</h2>
            </div>
            <div className="border-thin"></div>
            <Link className="theme-text-primary font-weight-normal mrm-p-1 d-block" onClick={handleChooseFileClick('ATTACHMENTS')}>
              <FontAwesomeIcon icon={faAlignLeft} size="sm" className="mrm-mr-1" />Choose a file
            </Link>
            <div className="border-thin"></div>
            <Link className="theme-text-primary font-weight-normal mrm-p-1 d-block" onClick={handleAttachUrlClick}>
              <FontAwesomeIcon icon={faExternalLink } size="sm" className="mrm-mr-1" />Attach from URL
            </Link>
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={attachUrl} onHide={handleHideAttachUrl} className='action-item-dialog modal-mobile-slide-from-bottom' centered>
        <Form onSubmit={handleSubmit(handleAttachUrlSaveClick)}>
          <Modal.Body>
            <div className="position-relative">
              <span className="cancel" onClick={handleHideAttachUrl}>Cancel</span>
              <h2 className='text-center mrm-mb-1'>Attach from URL</h2>
            </div>

            <Form.Group>
              <Form.Control
                placeholder="File Url..."
                autoComplete="off"
                name="external_url"
                defaultValue={undefined}
                isInvalid={errors.external_url}
                ref={register}
              />
            </Form.Group>

            <div className="d-flex justify-content-between">
              <Button variant="primary" className="btn-ai-save" type="submit">
                Save
              </Button>
            </div>
          </Modal.Body>
        </Form>
      </Modal>
      
      <AttachmentModal
        show={!!attachment}
        data={attachment}
        onConfirm={handleConfirmUpload}
        onAnotherFile={handleChooseFileClick('ATTACHMENTS')}
        pending={addCompetencyAttachmentPending}
        progress={addCompetencyAttachmentProgress}
        error={addCompetencyAttachmentError}
        onHide={handleAttachConfirmHide}
      />
    </div>
  );
};

CompetencyPage.propTypes = {};
CompetencyPage.defaultProps = {};
