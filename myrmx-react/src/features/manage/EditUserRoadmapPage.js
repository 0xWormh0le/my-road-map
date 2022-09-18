import React, { useEffect, useState, useCallback } from 'react';
// import PropTypes from 'prop-types';
import { Link, Redirect, useHistory, useParams } from 'react-router-dom';
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { useFetchAssignedUsers } from '../dashboard/redux/hooks';
import { useFetchUserRoadmaps, useBulkAssignUserRoadmaps } from '../manage/redux/hooks';
import { Header, Loader, UserAvatar, DesktopHeader } from '../common';
import { useFetchUser } from '../user/redux/hooks';
import Modal from 'react-bootstrap/Modal';

import useEffectiveBackLink from '../common/useEffectiveBackLinkHook';

function EditUserRoadmapComponent({ assigned, setAssigned, userId }) {
  const { fetchUserRoadmaps, userRoadmaps } = useFetchUserRoadmaps()
  const { user: userInfo } = useFetchUser()
  const [available, setAvailable] = useState([])
  const [archived, setArchived] = useState([])
  const roadmapsArchived = userInfo ? userInfo.features.roadmaps_are_archived : false
  const userGroups = userInfo ? userInfo.groups : []

  useEffect(() => {
    fetchUserRoadmaps({ userId, type: 'assigned' })
    fetchUserRoadmaps({ userId, type: 'archived' })
    fetchUserRoadmaps({ userId, type: 'available' })
  }, [fetchUserRoadmaps, userId])

  useEffect(() => {
    if (userRoadmaps) {
      if (userRoadmaps.available) {
        setAvailable(userRoadmaps.available)
      }
      if (userRoadmaps.assigned) {
        setAssigned(userRoadmaps.assigned)
      }
      if (userRoadmaps.archived) {
        setArchived(userRoadmaps.archived)
      }
    }
  }, [userRoadmaps, setAssigned])

  const handleUnassignClick = useCallback(
    roadmapId => () => {
      setAssigned(assigned => assigned.filter(rm => rm.id !== roadmapId))
      setAvailable(available => {
        const newlyAvailable = assigned.filter(rm => rm.id === roadmapId)
        return available.concat(newlyAvailable)
      })
    },
    [assigned, setAssigned]
  )

  const handleAssignClick = useCallback(
    roadmapId => () => {
      setAvailable(available => available.filter(rm => rm.id !== roadmapId))
      setAssigned(assigned => {
        const newlyAssigned = available.filter(rm => rm.id === roadmapId)
        return assigned.concat(newlyAssigned)
      })
    },
    [available, setAssigned]
  )

  const handleArchiveClick = useCallback(
    roadmapId => () => {
      setAssigned(assigned => assigned.filter(rm => rm.id !== roadmapId))
      setArchived(archived => {
        const newlyArchived = assigned.filter(rm => rm.id === roadmapId)
        return archived.concat(newlyArchived)
      })
    },
    [assigned, setAssigned]
  )

  const handleReopenClick = useCallback(
    roadmapId => () => {
      setArchived(archived => archived.filter(rm => rm.id !== roadmapId))
      setAssigned(assigned => {
        const newlyAssigned = archived.filter(rm => rm.id === roadmapId)
        return assigned.concat(newlyAssigned)
      })
    },
    [archived, setAssigned]
  )

  if (!(
    userRoadmaps &&
    userRoadmaps.assigned &&
    userRoadmaps.archived &&
    userRoadmaps.available
  )) {
    return <Loader />
  }

  const canEditAssign = (userGroups.includes('Coach') && (userInfo ? userInfo.features.coach_can_assign_roadmaps : false))
    || userGroups.includes('Admin');

  if (!canEditAssign) {
    return <Redirect to='/dashboard' />
  }

  return (<div className="manage-edit-user-roadmap-component mrm-px-1">
    {(assigned.length + available.length + archived.length === 0)
      ? <p className='no-roadmaps'>No roadmaps</p>
      : (
        <>
          {assigned.length > 0 && (
            <>
              <Card className="mrm-mx-1 mrm-mt-2 normal-width-container">
                <Card.Body className="bg-white mrm-p-1">
                  <p className='theme-text-normal font-weight-bold'>Current Roadmaps</p>
                  {assigned.map((roadmap, key) => (
                    <div className='roadmap-title card-in-card' key={key}>
                      {roadmap.title}
                      {canEditAssign && (
                        <Button
                          className="unassign"
                          variant="white"
                          onClick={roadmapsArchived ? handleArchiveClick(roadmap.id) : handleUnassignClick(roadmap.id)}
                        >
                          {roadmapsArchived ? 'Archive' : 'Unassign'}
                        </Button>
                      )}
                    </div>
                  ))}
                </Card.Body>
              </Card>
            </>
          )}
          {available.length > 0 && (
            <>
              <Card className="mrm-mx-1 mrm-mt-1 normal-width-container">
                <Card.Body className="bg-white mrm-p-1">
                  <p className='theme-text-normal font-weight-bold'>Available Roadmaps</p>
                  {available.map((roadmap, key) => (
                    <div className='roadmap-title card-in-card' key={key}>
                      {roadmap.title}
                      {canEditAssign && (
                        <Button onClick={handleAssignClick(roadmap.id)}>
                          Assign
                        </Button>
                      )}
                    </div>
                  ))}
                </Card.Body>
              </Card>
            </>
          )}
          {archived.length > 0 && (
            <>
              <Card className="mrm-mx-1 mrm-mt-1 normal-width-container">
                <Card.Body className="bg-white mrm-p-1">
                  <p className='theme-text-normal font-weight-bold'>Archived Roadmaps</p>
                  {archived.map((roadmap, key) => (
                    <div className='roadmap-title card-in-card' key={key}>
                      {roadmap.title}
                      {canEditAssign && (
                        <Button onClick={handleReopenClick(roadmap.id)}>
                          Reopen
                        </Button>
                      )}
                    </div>
                  ))}
                </Card.Body>
              </Card>              
            </>
          )}
        </>
      )
    }
  </div>);
}

export function EditUserRoadmapModal({show, onHide, userId}) {
  const [user, setUser] = useState(null)
  const [assigned, setAssigned] = useState([])
  const { assignedUsers } = useFetchAssignedUsers()
  const { bulkAssignUserRoadmaps, bulkAssignUserRoadmapsPending } = useBulkAssignUserRoadmaps()

  useEffect(() => {
    if (assignedUsers) {
      setUser(assignedUsers.results.find(u => u.id === userId))
    }
  }, [assignedUsers, userId])

  const handleSaveClick = useCallback(() => {
    const ids = assigned.map(rm => rm.id)
    bulkAssignUserRoadmaps({ ids, userId }).then(() => onHide(true));
  }, [assigned, bulkAssignUserRoadmaps, userId, onHide])

  const fullName = user ? `${user.first_name} ${user.last_name}` : null;

  return (<Modal show={show} onHide={onHide} centered className="manage-edit-user-roadmap-modal">
    <Modal.Header>
      {!bulkAssignUserRoadmapsPending && <>
        <Button variant="secondary" onClick={onHide} className="font-weight-bold">
          Cancel
        </Button>
        <div>
          <h2>Edit Assigned Roadmaps</h2>
          {user && <p>
            <UserAvatar user={user} size="sm" />
            <span className="font-weight-bold">{fullName}</span>
          </p>}
        </div>
        <Button onClick={handleSaveClick}>
          Save
        </Button>
      </>}
    </Modal.Header>
    <Modal.Body>
      {bulkAssignUserRoadmapsPending && <Loader />}
      {!bulkAssignUserRoadmapsPending && userId && <EditUserRoadmapComponent
        assigned={assigned}
        setAssigned={setAssigned}
        userId={userId}
      />}
    </Modal.Body>
  </Modal>)
}

export default function EditUserRoadmapPage() {
  const history = useHistory()
  const { fetchAssignedUsers, assignedUsers } = useFetchAssignedUsers()
  const { bulkAssignUserRoadmaps } = useBulkAssignUserRoadmaps()
  const params = useParams()
  const [user, setUser] = useState(null)
  const [assigned, setAssigned] = useState([])
  const userId = Number(params.userId)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    fetchAssignedUsers({ userId })
  }, [fetchAssignedUsers, userId])

  useEffect(() => {
    if (assignedUsers) {
      setUser(assignedUsers.results.find(u => u.id === userId))
    }
  }, [assignedUsers, userId])

  const defaultBackLink = `/manage/user/${userId}`;
  const effectiveBackLink = useEffectiveBackLink(defaultBackLink);

  const handleSaveClick = useCallback(() => {
    const ids = assigned.map(rm => rm.id)
    bulkAssignUserRoadmaps({ ids, userId })
    history.push(effectiveBackLink);
  }, [history, assigned, bulkAssignUserRoadmaps, userId, effectiveBackLink])

  const renderBackLink = useCallback((effectiveBackLink) => (
    <Link to={effectiveBackLink}>
      <Button className="btn-cancel" variant="white" >
        Cancel
      </Button>
    </Link>
  ), [])

  const renderSaveButton = useCallback(() => (
    <Button className="btn-save" variant="white" onClick={handleSaveClick}>
      Save
    </Button>
  ), [handleSaveClick])

  if (!user) {
    return <Loader />
  }

  return (
    <div className="manage-edit-user-roadmap-page">
      <Header
        icon="back"
        title='Edit Roadmaps'
        renderThirdColumn={renderSaveButton}
        thirdColumnClass="text-right"
        colSizes={[3, 6, 3]}
        border
        renderBackLink={renderBackLink}
        defaultBackLink={defaultBackLink}
      >
        <div className="d-flex align-items-center justify-content-center">
          <UserAvatar user={user} size="sm" />
          &nbsp;<strong>{user.first_name} {user.last_name}</strong>
        </div>
      </Header>
      <DesktopHeader>
        <Container>
          <Row className="desktop-page-secondary-header-wrapper mrm-mb-1 mrm-py-1">
            <Col xs={1}>
              <Link to={effectiveBackLink}>
                <Button className="btn-cancel" variant="gray" >
                  Cancel
                </Button>
              </Link>
            </Col>
            <Col xs={10}>
              <h1 className="text-center">Edit Roadmaps</h1>
            </Col>
            <Col xs={1}>            
              <Button onClick={handleSaveClick}>
                Save
              </Button>
            </Col>
            <div className="d-flex align-items-center justify-content-center mx-auto">
              <UserAvatar user={user} size="sm" />
              &nbsp;<strong>{user.first_name} {user.last_name}</strong>
            </div>
          </Row>          
        </Container>
      </DesktopHeader>
      <EditUserRoadmapComponent assigned={assigned} setAssigned={setAssigned} userId={userId} />
    </div>
  );
};

EditUserRoadmapPage.propTypes = {};
EditUserRoadmapPage.defaultProps = {};
