import React, { useEffect, useState, useCallback } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Header from '../common/Header';
import UserAvatar from '../common/UserAvatar';
import Loader from '../common/Loader';
import { useFetchRoadmap, useFetchRoadmapCoaches, useBulkAssignRoadmapCoaches } from './redux/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMap } from '@fortawesome/pro-light-svg-icons';
import { useFetchUser } from '../user/redux/hooks';
import useEffectiveBackLink from '../common/useEffectiveBackLinkHook';


// import PropTypes from 'prop-types';

const Coach = ({ coach, buttonType, onAction }) => (
  <Card className="coach-card mrm-mb-0_5">
    <Card.Body className="d-flex mrm-p-0_5 justify-content-between align-items-center">
      <div className="d-flex mrm-mr-0_5">
        <UserAvatar user={coach} size='sm' className="d-flex align-items-center" />
        <div className="mrm-ml-0_5">
          <p className="mrm-mb-0_25">{coach.first_name} {coach.last_name}</p>
          <p className="coach-email mb-0"><small>{coach.email}</small></p>
        </div>
      </div>
      {buttonType && (
        <Button
          className={buttonType}
          variant={buttonType === 'unassign' ? 'white' : undefined}
          onClick={onAction}
        >
          {buttonType === 'assign' ? 'Assign' : 'Unassign'}
        </Button>
      )}
    </Card.Body>
  </Card>
)

export default function EditAssignedCoachesPage() {
  const { roadmapId } = useParams()

  const { user, replaceStringWithSynonyms } = useFetchUser()

  const history = useHistory()

  const { roadmaps, fetchRoadmap } = useFetchRoadmap()

  const { roadmapCoaches, fetchRoadmapCoaches } = useFetchRoadmapCoaches()

  const { bulkAssignRoadmapCoaches } = useBulkAssignRoadmapCoaches()

  const [available, setAvailable] = useState([])

  const [assigned, setAssigned] = useState([])

  const roadmap = roadmaps[roadmapId]

  useEffect(() => {
    fetchRoadmap({ roadmapId })
    fetchRoadmapCoaches({ roadmapId, type: 'available' })
    fetchRoadmapCoaches({ roadmapId, type: 'assigned' })
  }, [fetchRoadmap, fetchRoadmapCoaches, roadmapId])

  useEffect(() => {
    if (roadmapCoaches) {
      if (roadmapCoaches.available) {
        setAvailable(roadmapCoaches.available)
      }
      if (roadmapCoaches.assigned) {
        setAssigned(roadmapCoaches.assigned)
      }
    }
  }, [roadmapCoaches])

  const handleUnassignClick = useCallback(
    id => () => {
      setAssigned(assigned => assigned.filter(rm => rm.id !== id))
      setAvailable(available => {
        const newlyAvailable = assigned.filter(rm => rm.id === id)
        return available.concat(newlyAvailable)
      })
    },
    [assigned]
  )

  const handleAssignClick = useCallback(
    id => () => {
      setAvailable(available => available.filter(rm => rm.id !== id))
      setAssigned(assigned => {
        const newlyAssigned = available.filter(rm => rm.id === id)
        return assigned.concat(newlyAssigned)
      })
    },
    [available]
  )

  const renderBackLink = useCallback((effectiveBackLink) => (
    <Link to={effectiveBackLink}>
      <Button className="btn-cancel" variant="white" >
        Cancel
      </Button>
    </Link>
  ), [])

  const defaultBackLink = `/roadmap/${roadmapId}`;
  const effectiveBackLink = useEffectiveBackLink(defaultBackLink);
  const handleSaveClick = useCallback(() => {
    const ids = assigned.map(rm => rm.id)
    bulkAssignRoadmapCoaches({ roadmapId, ids }).then(() => {
      history.push(effectiveBackLink)
    })
  }, [history, roadmapId, bulkAssignRoadmapCoaches, assigned, effectiveBackLink])

  const renderSaveButton = useCallback(() => (
    <Button
      className="btn-save"
      variant="white"
      onClick={handleSaveClick}
    >
      Save
    </Button>
  ), [handleSaveClick])

  if (!user) {
    return <Loader />
  }

  return (
    <div className="roadmap-edit-assigned-coaches-page">
      <Header
        icon="back"
        title={replaceStringWithSynonyms('Edit Assigned Coaches')}
        renderThirdColumn={renderSaveButton}
        thirdColumnClass="text-right"
        colSizes={['auto p-0', undefined, 'auto p-0']}
        border
        renderBackLink={renderBackLink}
        defaultBackLink={defaultBackLink}
      >
        {roadmap && (
          <div className="d-flex align-items-center justify-content-center">
            {roadmap.icon ? (
              <img alt={roadmap.title} src={roadmap.icon} />
            ) : (
              <FontAwesomeIcon className="default-roadmap-thumbnail" icon={faMap} size="lg" />
            )}
            <strong className='mrm-ml-0_5'>{roadmap.title}</strong>
          </div>
        )}
      </Header>

      {!roadmap ? (
        <Loader />
      ) : (
        <div className="mrm-px-1">
          {assigned.length > 0 && (
            <>
              <p className='coach-type mrm-mt-1 mrm-mb-0_5'>{replaceStringWithSynonyms('Current Coaches')}</p>
              {assigned.map((coach, key) => (
                <Coach
                  key={key}
                  coach={coach}
                  buttonType={user.features.can_assign_specific_coaches_for_specific_roadmaps ? 'unassign' : null}
                  onAction={handleUnassignClick(coach.id)}
                />
              ))}
            </>
          )}
          {available.length > 0 && (
            <>
              <p className='coach-type mrm-mt-1 mrm-mb-0_5'>{replaceStringWithSynonyms('Available Coaches')}</p>
              {available.map((coach, key) => (
                <Coach
                  key={key}
                  coach={coach}
                  buttonType={user.features.can_assign_specific_coaches_for_specific_roadmaps ? 'assign' : null}
                  onAction={handleAssignClick(coach.id)}
                />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

EditAssignedCoachesPage.propTypes = {};
EditAssignedCoachesPage.defaultProps = {};
