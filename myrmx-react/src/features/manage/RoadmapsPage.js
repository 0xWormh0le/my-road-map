import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH } from '@fortawesome/pro-regular-svg-icons';

import debounce from 'lodash/debounce';

import { Header, SearchBar, CustomTable, Loader, ActionMenu, CustomDialog, DesktopHeader } from '../common';
import usePagination from '../common/usePagination';
import { useUnauthorizedErrorHandler } from '../../common/apiHelpers';
import { useFetchRoadmaps } from '../dashboard/redux/hooks';
import { useUpdateRoadmap, useCopyRoadmap, useClearRoadmapAssessment } from './redux/hooks';
import { useFetchUser } from '../user/redux/hooks';
import { AddRoadmapModal } from './AddRoadmapPage';


export default function RoadmapsPage() {
  const [ searchText, setSearchText ] = useState('')
  const [ sortBy, setSortBy ] = useState(null)
  const [ actionMenu, setActionMenu ] = useState(null)
  const [ publishModal, setPublishModal ] = useState(null)
  const [ published, setPublished ] = useState(null)
  const { roadmaps, fetchRoadmaps, fetchRoadmapsPending } = useFetchRoadmaps()
  const { copyRoadmap } = useCopyRoadmap()
  const { updateRoadmap } = useUpdateRoadmap()
  const { clearRoadmapAssessment } = useClearRoadmapAssessment()
  const unauthorizedErrorHandler = useUnauthorizedErrorHandler()
  const { replaceStringWithSynonyms } = useFetchUser()
  const history = useHistory()

  const columns = [
    {
      title: 'Title',
      id: 'title',
      sortable: true,
      cell: row => (
        <>
        <div className="d-none d-lg-block">
          <Link to={`/manage/roadmaps/${row.id}`}>{row.title}</Link>
        </div>
        <div className="d-lg-none">
          <span>{row.title}</span>
        </div>
        </>
      ),
    },
    {
      title: 'Published',
      id: 'is_published',
      className: 'text-center',
      cell: row => (
        row.is_published 
        ? (<span className="status-active">Yes</span>)
        : (<span>Draft</span>)
      ),
    },
    {
      title: '',
      id: 'action',
      className: 'text-center',
      cell: row => (
        <Link className="more-btn-desktop float-right" onClick={handleActionMenuClick(row.id, row.is_published)}>
          <FontAwesomeIcon icon={faEllipsisH} />
        </Link>
      )
    }
  ]

  const { resetPage } = usePagination({
    fetchAction: fetchRoadmaps,
    actionArgs: {
      search: searchText,
      sortBy
    },
    requestNextPage: () => roadmaps && roadmaps.next && !fetchRoadmapsPending
  })

  useEffect(() => {
    fetchRoadmaps({ page: 0 }).catch(unauthorizedErrorHandler)
  }, [fetchRoadmaps, unauthorizedErrorHandler])

  const handleActionMenuClick = useCallback((roadmapId, isPublished) => () => {
    setActionMenu(roadmapId)
    setPublished(isPublished)
  }, [])

  const handleHideActionMenu = useCallback(() => setActionMenu(null), [])
  
  const handlePublishRoadmapClick = useCallback(() => {
    setPublishModal(actionMenu)
    handleHideActionMenu()
  }, [actionMenu, handleHideActionMenu])

  const handlePublishDialogClose = useCallback(() => setPublishModal(null), [])
  
  const handlePublishDialogConfirm = useCallback(() => {
    updateRoadmap({ roadmapId: publishModal, data: { is_published: !published}})
      .then(() => fetchRoadmaps({ page: 0 }))
    handlePublishDialogClose()
  }, [publishModal, published, fetchRoadmaps, updateRoadmap, handlePublishDialogClose])

  const handleClearRoadmapAssessmentClick = useCallback(() => {
    clearRoadmapAssessment({ roadmapId: actionMenu})
    handleHideActionMenu()
  }, [actionMenu, clearRoadmapAssessment, handleHideActionMenu])

  const handleDuplicateRoadmapClick = useCallback(() => {
    copyRoadmap({ roadmapId: actionMenu })
      .then(() => fetchRoadmaps({ page: 0}))
    handleHideActionMenu()
  }, [actionMenu, copyRoadmap, handleHideActionMenu, fetchRoadmaps])

  const debouncedSearch = useCallback(
    debounce(q => {
      resetPage()
      fetchRoadmaps({ search: q, page: 0, ordering: sortBy})
    }, 500),
    [fetchRoadmaps]
  )
  
  const handleRoadmapSearch = useCallback(e => {
    setSearchText(e.target.value)
    debouncedSearch(e.target.value)
  }, [debouncedSearch])

  const handleSortChange = useCallback(sortBy => {
    resetPage()
    setSortBy(sortBy)

    fetchRoadmaps({
      search: searchText,
      page: 0,
      ordering: sortBy
    })
  }, [searchText, resetPage, setSortBy, fetchRoadmaps])

 
  const actionMenuItems = useMemo(() => {
    return [
      {
        to: `/manage/roadmaps/${actionMenu}`,
        label: 'Edit Roadmap'
      },
      {
        onClick: handlePublishRoadmapClick,
        label: published ? 'Unpublish Roadmap' : 'Publish Roadmap'
      },
      {
        onClick: handleDuplicateRoadmapClick,
        label: 'Duplicate Roadmap'
      },
      {
        onClick: handleClearRoadmapAssessmentClick,
        label: replaceStringWithSynonyms('Clear Assessments'),
        className: 'text-danger'
      }
    ]
  }, [
    actionMenu, 
    published, 
    handlePublishRoadmapClick, 
    handleDuplicateRoadmapClick,
    handleClearRoadmapAssessmentClick,
    replaceStringWithSynonyms
  ])

  const [showAddRoadmapModal, setShowAddRoadmapModal] = useState(false);

  const handleAddRoadmapModalHide = useCallback((createdRoadmapId) => {
    setShowAddRoadmapModal(false);
    if (typeof createdRoadmapId !== "undefined") history.push(`/manage/roadmaps/${createdRoadmapId}`);
  }, [ history ]);

  return (
    <div className="manage-roadmaps-page">
      <Header
        border
        icon="back"
        title="Roadmaps"
        defaultBackLink="/user"
      />
      <DesktopHeader>
        <Container>
          <div className="desktop-page-secondary-header-wrapper card mrm-mb-1 mrm-p-1">
            <h1>Roadmaps ({roadmaps && (roadmaps.count)})</h1>
            <div className="d-flex justify-content-between">
              <SearchBar
                value={searchText}
                onSearch={handleRoadmapSearch}
              />
              <Button variant="primary" onClick={() => setShowAddRoadmapModal(true)}>Add Roadmap</Button>
            </div>
          </div>
        </Container>
      </DesktopHeader>
      <div className="d-lg-none mobile-page-container">
        <div className="mrm-mt-1 mrm-px-0_5 d-flex justify-content-between">
          <SearchBar
            value={searchText}
            onSearch={handleRoadmapSearch}
          />
          <Link to="/manage/roadmaps/add-roadmap">
            <Button variant="primary">Add Roadmap</Button>
          </Link>
        </div>
        <div className="mrm-mt-1">
        {roadmaps && roadmaps.results && (
          <CustomTable
            columns={columns}
            data={roadmaps.results}
            onSortChange={handleSortChange}
          />
        )}
        </div>
      </div>
      <div className="d-none d-lg-block desktop-page-container">
        <Container>
          {roadmaps && roadmaps.results && (
            <CustomTable
              columns={columns}
              data={roadmaps.results}
              onSortChange={handleSortChange}
            />
          )}
        </Container>
        <AddRoadmapModal show={showAddRoadmapModal} onHide={handleAddRoadmapModalHide} />
      </div>
      {fetchRoadmapsPending && (
          <Loader />
        )}  
        <ActionMenu
          show={!!actionMenu}
          onHide={handleHideActionMenu}
          items={actionMenuItems}
        />
      <CustomDialog
        show={!!publishModal}
        text={{
          caption: published  
            ? 'Unpublishing a Roadmap will make it unavailable to users.' 
            : 'Publishing a Roadmap will make it available to users.',
          yes: published ? 'Unpublish' : 'Publish'
        }}
        onHide={handlePublishDialogClose}
        onYes={handlePublishDialogConfirm}
        header={published ? 'Unpublish Roadmap' : 'Publish Roadmap'}
        confirmClassName={published ? undefined : 'theme-text-blue'}
      />
    </div>
  );
};

RoadmapsPage.propTypes = {};
RoadmapsPage.defaultProps = {};
