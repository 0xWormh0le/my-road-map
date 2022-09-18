import React, { useEffect, useCallback, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { Header, CustomTable, Loader, ActionMenu, CustomDialog, DesktopHeader } from '../common';
import { useFetchCohorts, useDeleteCohort } from './redux/hooks';
import usePagination from '../common/usePagination';
import { faEllipsisH } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// import PropTypes from 'prop-types';


export default function GroupsPage() {
  const { fetchCohorts, cohorts, fetchCohortsPending } = useFetchCohorts()

  const { deleteCohort, deleteCohortPending } = useDeleteCohort()

  const [editMenu, setEditMenu] = useState(null)

  const [deleteModal, setDeleteModal] = useState(null)

  usePagination({
    fetchAction: fetchCohorts,
    requestNextPage: () => fetchCohorts && fetchCohorts.next && !fetchCohortsPending
  })

  useEffect(() => {
    fetchCohorts()
  }, [fetchCohorts])

  const handleActionClick = useCallback(id => () => setEditMenu(id), [])

  const handleEditMenuClose = useCallback(() => setEditMenu(null), [])

  const handleDeleteDialogClose = useCallback(() => setDeleteModal(null), [])

  const handleDeleteDialogConfirm = useCallback(() => {
    deleteCohort({ cohortId: Number(deleteModal) })
    setDeleteModal(null)
  }, [deleteCohort, deleteModal])

  const columns = useMemo(() => [
    {
      title: 'Name',
      id: 'name',
      sortable: true,
      cell: row => (
        <Link to={`/manage/groups/${row.id}`} className='no-format'>
          {row.name}
        </Link>
      )
    },
    {
      title: '',
      id: 'action',
      className: 'text-center',
      cell: row => (
        <Link
          className="more-btn-desktop float-right"
          onClick={handleActionClick(row.id)}
        >
          <FontAwesomeIcon icon={faEllipsisH} />
        </Link>
      ),
    }
  ], [handleActionClick])

  const handleDeleteConfirm = useCallback(id => () => {
    setEditMenu(null)
    setDeleteModal(id)
  }, [])

  const editMenuItems = useMemo(() => [
    { label: 'View Group', to: `/manage/groups/${editMenu}` },
    { label: 'Edit Group', to: `/manage/groups/${editMenu}/edit` },
    { label: 'Delete Group', className: 'text-danger', onClick: handleDeleteConfirm(editMenu) }
  ], [editMenu, handleDeleteConfirm])

  return (
    <div className="manage-groups-page">
      <Header
        border
        icon="back"
        title="Groups"
        defaultBackLink="/user"
      />
      <DesktopHeader>
        <Container>
          <div className="desktop-page-secondary-header-wrapper card mrm-mb-1 mrm-p-1">
            <h1>Groups</h1>
            <div className="d-flex flex-row-reverse">
              <Link to="/manage/groups/add">
                <Button variant="primary">Add Group</Button>
              </Link>
            </div>
          </div>
        </Container>
      </DesktopHeader>
      <div className="mrm-mt-1 mrm-px-0_5 text-right d-lg-none">
        <Link to="/manage/groups/add">
          <Button variant="primary">Add Group</Button>
        </Link>
      </div>
      {(fetchCohortsPending || deleteCohortPending || !cohorts) ? (
        <Loader delay />
      ) : (
        <>
        <div className="d-lg-none mobile-page-container">
          <div className="mrm-mt-1">
            <CustomTable columns={columns} data={cohorts.results} sortMode='local' />
          </div>
        </div>
        <div className="d-none d-lg-block desktop-page-container">
          <Container>
            <div className="mrm-mt-1">
              <CustomTable columns={columns} data={cohorts.results} sortMode='local' />
            </div>
          </Container>
        </div>
        </>
      )}
      <ActionMenu
        show={!!editMenu}
        onHide={handleEditMenuClose}
        items={editMenuItems}
      />
      <CustomDialog
        show={!!deleteModal}
        text={{
          caption: 'Delete group?',
          yes: 'Yes'
        }}
        onHide={handleDeleteDialogClose}
        onYes={handleDeleteDialogConfirm}
      />
    </div>
  );
};

GroupsPage.propTypes = {};
GroupsPage.defaultProps = {};
