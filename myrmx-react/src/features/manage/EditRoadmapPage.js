import React, { useCallback, useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH, faPlus } from '@fortawesome/pro-regular-svg-icons';
import { faCaretDown, faCaretRight, faGripVertical } from '@fortawesome/pro-solid-svg-icons';
import { remove, uniqBy } from 'lodash';
import clsx from 'clsx';

import { ActionMenu, CustomDialog, DesktopBackButton, DesktopHeader, Header } from '../common';
import useQuery from '../common/useQuery';
import { useUnauthorizedErrorHandler } from '../../common/apiHelpers';
import { useFetchRoadmap, useFetchRoadmapStages, useFetchStageCompetencies } from '../roadmap/redux/hooks';
import { useFetchUser } from '../user/redux/hooks';
import {
  useAddCompetency,
  useAddStage,
  useCopyCompetency,
  useCopyStage,
  useDeleteCompetency,
  useDeleteStage,
  useReorderCompetency,
  useReorderStage,
} from './redux/hooks';
import { DeleteRoadmapModal, EditRoadmapDetailsModal } from './EditRoadmapDetailsPage';
import { DesktopInlineAdder } from './index';
import RenameStage from './RenameStage';

export default function EditRoadmapPage() {
  const history = useHistory();
  const { roadmapId } = useParams();
  const query = useQuery();
  const unauthorizedErrorHandler = useUnauthorizedErrorHandler();
  const { roadmaps, fetchRoadmap } = useFetchRoadmap();
  const { fetchRoadmapStages } = useFetchRoadmapStages();
  const { fetchStageCompetencies } = useFetchStageCompetencies();
  const { deleteStage } = useDeleteStage();
  const { copyStage } = useCopyStage();
  const { reorderStage } = useReorderStage();
  const { reorderCompetency } = useReorderCompetency();
  const [ stageData, setStageData ] = useState([]);
  const [ roadmapMenu, setRoadmapMenu ] = useState(null);
  const [ stageMenu, setStageMenu ] = useState(null);
  const [ openStages, setOpenStages ] = useState([]);
  const [ deleteStageModal, setDeleteStageModal ] = useState(null);
  const { user, replaceStringWithSynonyms } = useFetchUser();
  const [ showDeleteRoadmapModal, setShowDeleteRoadmapModal ] = useState(false);
  const { addCompetency, addCompetencyPending } = useAddCompetency();
  const [ competencyMenu, setCompetencyMenu ] = useState(null);
  const { deleteCompetency } = useDeleteCompetency();
  const [ deleteCompetencyModal, setDeleteCompetencyModal ] = useState(null);
  const { copyCompetency } = useCopyCompetency();
  const [ showStageInlineAdder, setShowStageInlineAdder ] = useState(false);
  const { addStage, addStagePending } = useAddStage();
  const [openRenameStageForms, setOpenRenameStageForms] = useState([]);
  const [openCompetencyInlineAdders, setOpenCompetencyInlineAdders] = useState([]);

  function updateStageData(stage, competencies) {
    stage.competencies = uniqBy(competencies, 'id').sort((a, b) => {
      if (a.order != null && b.order != null) return a.order > b.order ? 1 : -1;
      return 0;
    });
    setStageData(s => uniqBy([...s, stage], 'id').sort((a, b) => (a.order > b.order ? 1 : -1)));
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (!roadmapId || !user) {
      return;
    }

    async function fetchRoadmapData() {
      await fetchRoadmap({ roadmapId });
      const stages = await fetchRoadmapStages({ roadmapId });
      for (const stage of stages) {
        const competencies = await fetchStageCompetencies({ roadmapId, userId: user.id, stageId: stage.id });
        updateStageData(stage, competencies);
      }
    }

    fetchRoadmapData()
      .catch(unauthorizedErrorHandler)
      .catch(err => {
        if (err.response && err.response.status === 404) {
          history.push('/manage/roadmaps');
        } else {
          throw err;
        }
      });
  }, [
    query,
    fetchRoadmap,
    user,
    roadmapId,
    fetchRoadmapStages,
    fetchStageCompetencies,
    unauthorizedErrorHandler,
    history,
  ]);

  const reorder = useCallback((list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  }, [])

  const onDragEnd = result => {
    if (!result.destination) {
      return;
    }
    if (result.type === "stage") {
      const stages = reorder(
        stageData,
        result.source.index,
        result.destination.index
      );
      
      const stagesOrder = Object.assign({}, ...stages.map((x, index) => ({[x.id]: index})))
      reorderStage({roadmapId, order_mapping : stagesOrder})
      setStageData(stages)
    } else {
      const stageId = parseInt(result.type)
      const stage = stageData.filter(x => x.id === stageId)[0]
      const competencies = reorder(
        stage.competencies,
        result.source.index,
        result.destination.index
      );
      const competencyOrder = Object.assign({}, ...competencies.map((x, index) => ({[x.id]: index})))
      reorderCompetency({roadmapId, stageId, order_mapping: competencyOrder})
      stage.competencies = competencies
      setStageData(stageData.map(s => s.id === stageId ? stage : s))
    }
  }

  const getStageItemStyle = (isDragging, draggableStyle) => ({
    userSelect: "none",
    boxShadow: isDragging ? "0px 4px 3px 0px #cccccc" : "none",
    ...draggableStyle
  });

  const getCompetencyItemStyle = (isDragging, draggableStyle) => ({
    position: "relative",
    userSelect: "none",
    boxShadow: isDragging ? "0px 4px 3px 0px #cccccc" : "none",
    border: "none",
    borderRadius: "10px",
    ...draggableStyle
  });

  const roadmap = roadmaps[roadmapId];

  const [showEditRoadmapDetailsModal, setShowEditRoadmapDetailsModal] = useState(false);

  const handleEditRoadmapDetailsModalHide = useCallback((saved) => {
    setShowEditRoadmapDetailsModal(false);
    setRoadmapMenu(null);
    if (typeof saved === "boolean" && saved) fetchRoadmap({ roadmapId });
  }, [ fetchRoadmap, roadmapId ]);

  const roadmapMenuItems = useCallback(() => {
    return [
      {
        to: `/manage/roadmaps/${roadmapMenu}/edit`,
        label: 'Edit Roadmap Details',
        className: 'd-lg-none',
      },
      {
        label: 'Edit Roadmap Details',
        className: 'd-none d-lg-block',
        onClick: () => setShowEditRoadmapDetailsModal(true),
      },
      {
        to: `/manage/roadmaps/${roadmapMenu}/stages/add`,
        label: 'Add Stage',
        className: 'd-lg-none',
      },
      {
        label: 'Add Stage',
        className: 'd-none d-lg-block',
        onClick: () => {
          setRoadmapMenu(null);
          setShowStageInlineAdder(true);
        },
      },
    ]
  }, [roadmapMenu])

  const handleHideStageMenu = useCallback(() => setStageMenu(false), [])

  const handleCopyStageClick = useCallback(() => {
    copyStage({ roadmapId, stageId: stageMenu})
      .then((res) => setStageData([...stageData, res]))
    handleHideStageMenu()
  }, [roadmapId, stageMenu, stageData, copyStage, handleHideStageMenu])

  const handleDeleteStageClick = useCallback(() => {
      setDeleteStageModal(stageMenu)
      handleHideStageMenu()
  }, [stageMenu, handleHideStageMenu])

  const showRenameStageForm = useCallback(() => {
    if (!openRenameStageForms.includes(stageMenu)) {
      setOpenRenameStageForms([...openRenameStageForms, stageMenu]);
    }

    handleHideStageMenu();
  }, [stageMenu, openRenameStageForms, handleHideStageMenu]);

  const stageMenuItems = useCallback(() => {
    let items = [
      {
        onClick: showRenameStageForm,
        label: 'Rename Stage',
        className: 'show-rename-form-desktop d-none d-lg-inline-block',
      }, 
      {
        to: `/manage/roadmaps/${roadmapId}/stages/${stageMenu}/rename`,
        label: 'Rename Stage',
        className: 'd-lg-none',
      },
      {
        onClick: handleCopyStageClick,
        label: 'Copy Stage'
      },
      {
        to: `/manage/roadmaps/${roadmapId}/stages/${stageMenu}/add-description`,
        label: 'Add/Edit Description'
      },
      {
        onClick: handleDeleteStageClick,
        label: 'Delete Stage',
        className: 'text-danger'
      }
    ]

    if ( user && user.features.coach_notes_enabled ) {
      const coachNoteItem = {
        to: `/manage/roadmaps/${roadmapId}/stages/${stageMenu}/add-notes`,
        label: replaceStringWithSynonyms('Add/Edit Coach Notes')
      }
      items.splice(4, 0, coachNoteItem)
    }
    return items
  }, [roadmapId, stageMenu, user, showRenameStageForm, handleDeleteStageClick, handleCopyStageClick, replaceStringWithSynonyms])

  const handleRoadmapMenuClick = useCallback(() => 
    setRoadmapMenu(roadmapId)
  , [roadmapId])

  const handleHideRoadmapMenu = useCallback(() => setRoadmapMenu(false), [])

  const handleStageMenuClick = useCallback(stageId => () => setStageMenu(stageId), [])

  const handleDeleteStageDialogClose = useCallback(() => setDeleteStageModal(null), [])

  const handleDeleteStageDialogConfirm = useCallback(() => {
      deleteStage({ roadmapId, stageId: deleteStageModal})
        .then((res) => setStageData(stageData.filter(x => x.id !== res)))
      handleDeleteStageDialogClose()
    }, [roadmapId, deleteStageModal, deleteStage, stageData, handleDeleteStageDialogClose])

  const handleCollapseStageClick = useCallback(stageId => () => {
    if (openStages.includes(stageId)) {
      setOpenStages(openStages.filter(id => id!== stageId))
    } else {
      setOpenStages([...openStages, stageId])
    }
  }, [openStages, setOpenStages])

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
    addCompetency({ roadmapId, title, stage: stageId }).then(newCompetency => {
      hideCompetencyInlineAdder(stageId);
      const stage = stageData.find(s => s.id === stageId);
      const competencies = [...stage.competencies, newCompetency];
      updateStageData(stage, competencies);
    });
  }, [roadmapId, addCompetency, stageData, hideCompetencyInlineAdder])

  const handleCompetencyMenuClick = useCallback((stageId, competencyId) => () => setCompetencyMenu([stageId, competencyId]), [])
  const handleHideCompetencyMenu = useCallback(() => setCompetencyMenu(null), [])

  const handleDeleteCompetencyClick = useCallback((stageId, competencyId) => () => {
    setDeleteCompetencyModal([stageId, competencyId])
    handleHideCompetencyMenu()
  }, [handleHideCompetencyMenu])

  const handleDuplicateCompetencyClick = useCallback((stageId, competencyId) => () => {
    copyCompetency({roadmapId, stageId, competencyId}).then(newCompetency => {
      handleHideCompetencyMenu();
      const stage = stageData.find(s => s.id === stageId);
      const competencies = [...stage.competencies, newCompetency];
      updateStageData(stage, competencies);
    });
  }, [roadmapId, copyCompetency, handleHideCompetencyMenu, stageData])

  const competencyMenuItems = useCallback(() => {
    if (!competencyMenu) return [];
    const [stageId, competencyId] = competencyMenu;
    return [
      {
        label: 'Duplicate',
        onClick: handleDuplicateCompetencyClick(stageId, competencyId),
      },
      {
        label: 'Delete',
        className: 'text-danger',
        onClick: handleDeleteCompetencyClick(stageId, competencyId),
      }
    ]
  }, [competencyMenu, handleDuplicateCompetencyClick, handleDeleteCompetencyClick])

  const handleDeleteCompetencyModalClose = useCallback(() => setDeleteCompetencyModal(null), [])

  const handleDeleteCompetencyModalConfirm = useCallback(() => {
    const [stageId, competencyId] = deleteCompetencyModal;
    deleteCompetency({roadmapId, stageId, competencyId}).then(() => {
      setDeleteCompetencyModal(null);
      const stage = stageData.find(s => s.id === stageId);
      const competencies = [...stage.competencies];
      remove(competencies, c => c.id === competencyId);
      updateStageData(stage, competencies);
    })
  }, [roadmapId, deleteCompetencyModal, deleteCompetency, stageData])

  const handleInlineStageAdd = useCallback(title => {
    addStage({ roadmap: roadmapId, title }).then(newStage => {
      setShowStageInlineAdder(false);
      updateStageData(newStage, []);
    });
  }, [addStage, roadmapId])

  const defaultBackLink = `/manage/roadmaps/`;

  // Rename stage

  const hideRenameStageForm = useCallback(stageId => {
    if (openRenameStageForms.includes(stageId)) {
      setOpenRenameStageForms(openRenameStageForms.filter(id => id!== stageId));
    }
  }, [openRenameStageForms]);
  
  const updateRenameStage = (stageId, title) => {
    setStageData(prevState => prevState.map(item => item.id === stageId ? {...item, title : title} : item));
    hideRenameStageForm(stageId);
  }



  return (
    <div className="manage-edit-roadmap-page">
      <Header
        border
        icon="back"
        title="Edit Roadmap"
        colSizes={['auto', undefined, 'auto']}
        renderThirdColumn={() => (
          <FontAwesomeIcon icon={faEllipsisH} onClick={handleRoadmapMenuClick} />
        )}
        defaultBackLink="/manage/roadmaps"
      >
        {roadmap && (
          <div className="d-flex align-items-center justify-content-center mrm-mt-1">
            <strong className='mrm-ml-0_75'>{roadmap.title}</strong>
          </div>
        )}
      </Header>
      <DesktopHeader>
        <Container>
          <Row className="desktop-page-secondary-header-wrapper mrm-mb-1 mrm-py-1">
            <Col xs={1}>
              <DesktopBackButton defaultBackLink={defaultBackLink} />
            </Col>
            <Col xs={10}>
              {roadmap && (<h1 className="text-center">{roadmap.title}</h1>)}
            </Col>
            <Col xs={1}>
              <Link className="more-btn-desktop float-right"><FontAwesomeIcon icon={faEllipsisH} onClick={handleRoadmapMenuClick} /></Link>
            </Col>
          </Row>
        </Container>
      </DesktopHeader>
      <Container className="mrm-mb-3">
        <div className="stage-section mrm-mb-1">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable" type="stage">
            {(provided) => (
              <div
                ref={provided.innerRef}
              >
              { stageData.map((stage, index) => (
                <Draggable key={stage.id} draggableId={`stage-${stage.id}`} index={index}>
                {(provided, snapshot) => (
                  <div
                    className={clsx("mrm-px-1 mrm-mt-1 stage-item", { "stage-item__dragging": snapshot.isDragging })}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    style={getStageItemStyle(
                      snapshot.isDragging,
                      provided.draggableProps.style
                    )}
                  >
                    <div className="d-flex mrm-mb-1_5 align-items-lg-center" {...provided.dragHandleProps}>
                      <div className="font-weight-bold" onClick={handleCollapseStageClick(stage.id)}>
                        <FontAwesomeIcon icon={faGripVertical} className="d-none d-lg-inline-block" />
                        { openStages.includes(stage.id) ? (
                            <FontAwesomeIcon icon={faCaretDown} size="xs"  className="mrm-mr-0_5" />
                          ) : (
                            <FontAwesomeIcon icon={faCaretRight} size="xs" className="mrm-mr-0_5" />
                          )
                        }

                        {/* Mobile version */}
                        <span class="d-lg-none">{stage.title}</span>

                        {/* Desktop version  */}
                        {!openRenameStageForms.includes(stage.id) && <span class="d-none d-lg-inline">{stage.title}</span>}
                      </div>

                      {openRenameStageForms.includes(stage.id) && 
                        <RenameStage 
                          className="d-none d-lg-block"
                          roadmapId={roadmapId}
                          stage={stage}
                          updateRenameStage={updateRenameStage}
                          hideRenameStageForm={hideRenameStageForm}
                        />
                      }

                      <FontAwesomeIcon icon={faEllipsisH} onClick={handleStageMenuClick(stage.id)} />
                    </div>
                    {openStages.includes(stage.id) && (
                      <>
                        <Link className="stage-description-notes" to={`/manage/roadmaps/${roadmapId}/stages/${stage.id}/add-description`}>
                          <p>{stage.description}</p>
                        </Link>
                        <Link className="stage-description-notes" to={`/manage/roadmaps/${roadmapId}/stages/${stage.id}/add-notes`}>
                          <p className="coach-notes">{stage.coach_notes}</p>
                        </Link>
                        <Droppable droppableId={`droppable${stage.id}`} type={`${stage.id}`}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                            >
                            {stage.competencies.filter(c => !c.user_defined).map((comp, index) => (
                              <Draggable
                                key={`${stage.id}${index}`}
                                draggableId={`${stage.id}${index}`}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    style={getCompetencyItemStyle(
                                      snapshot.isDragging,
                                      provided.draggableProps.style
                                    )}
                                  >
                                    <Link
                                      to = {`/manage/roadmaps/${roadmapId}/stages/${stage.id}/competencies/${comp.id}`}
                                      className="stage-competency card"
                                      key={index} {...provided.dragHandleProps}
                                    >
                                      {comp.title}
                                      {comp.hidden_for_all_users && <Badge variant="light">
                                        {replaceStringWithSynonyms('Hidden for all students')}
                                      </Badge>}
                                    </Link>
                                    <Button variant="secondary" className="d-none d-lg-block" onClick={handleCompetencyMenuClick(stage.id, comp.id)}>
                                      <FontAwesomeIcon icon={faEllipsisH} />
                                    </Button>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </>
                    )}
                    {openStages.includes(stage.id) && (<>
                      <Link
                        to={`/manage/roadmaps/${roadmapId}/stages/${stage.id}/competencies/add`}
                        className="d-lg-none">
                        <Button
                          variant="white"
                          className="btn-center mrm-my-1 w-100"
                        >
                          <FontAwesomeIcon icon={faPlus} className='mrm-mr-0_5' size="sm" />
                            {!stage.competencies.length && 'Add Competency'}
                        </Button>
                      </Link>
                      {!openCompetencyInlineAdders.includes(stage.id) && <Button
                        variant="white"
                        className="btn-center mrm-my-1 w-100 d-none d-lg-block"
                        onClick={() => showCompetencyInlineAdder(stage.id)}
                      >
                        <FontAwesomeIcon icon={faPlus} className='mrm-mr-0_5' size="sm" />
                        {!stage.competencies.length && 'Add Competency'}
                      </Button>}
                      {openCompetencyInlineAdders.includes(stage.id) && <DesktopInlineAdder
                        maxLength={500}
                        onCancel={() => hideCompetencyInlineAdder(stage.id)}
                        onAdd={handleInlineCompetencyAdd(stage.id)}
                        loading={addCompetencyPending}
                      />}
                    </>)}
                  </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        <>
          <Link
            to={`/manage/roadmaps/${roadmapId}/stages/add`}
            className="theme-text-secondary mrm-ml-1 d-lg-none"
          >
            <FontAwesomeIcon icon={faPlus} className='mrm-mr-0_5' size="sm" />
            Add Stage
          </Link>
          <Button
            variant="light"
            className="d-none d-lg-block theme-text-secondary add-stage-button"
            onClick={() => setShowStageInlineAdder(true)}
            disabled={showStageInlineAdder}
          >
            <FontAwesomeIcon icon={faPlus} className='mrm-mr-0_5' size="sm" />
            Add Stage
          </Button>
          {showStageInlineAdder && <DesktopInlineAdder
            maxLength={64}
            onCancel={() => setShowStageInlineAdder(false)}
            onAdd={handleInlineStageAdd}
            loading={addStagePending}
          />}
        </>

        <ActionMenu
          show={!!roadmapMenu}
          onHide={handleHideRoadmapMenu}
          items={roadmapMenuItems()}
        />

        <ActionMenu
          show={!!stageMenu}
          onHide={handleHideStageMenu}
          items={stageMenuItems()}
        />

        <ActionMenu
          show={!!competencyMenu}
          onHide={handleHideCompetencyMenu}
          items={competencyMenuItems()}
        />

        <CustomDialog
          show={!!deleteStageModal}
          text={{
            caption: 'Deleting a stage is permanent. It deletes all content within the stage and there is no way to undo this.',
            yes: 'Delete'
          }}
          onHide={handleDeleteStageDialogClose}
          onYes={handleDeleteStageDialogConfirm}
          header='Delete Stage'
        />

        <EditRoadmapDetailsModal
          show={showEditRoadmapDetailsModal}
          onHide={handleEditRoadmapDetailsModalHide}
          roadmapId={roadmapId}
          onDeleteRoadmap={() => {
            handleEditRoadmapDetailsModalHide();
            setShowDeleteRoadmapModal(true);
          }}
        />

        <DeleteRoadmapModal
          show={showDeleteRoadmapModal}
          onHide={() => setShowDeleteRoadmapModal(false)}
          roadmapId={roadmapId}
        />

        <CustomDialog
          text={{
            caption: 'Deleting a Competency is permanent. There is no way to undo this.',
            yes: 'Delete'
          }}
          show={!!deleteCompetencyModal}
          onHide={handleDeleteCompetencyModalClose}
          onYes={handleDeleteCompetencyModalConfirm}
        />
      </Container>
    </div>
  );
};

EditRoadmapPage.propTypes = {};
EditRoadmapPage.defaultProps = {};
