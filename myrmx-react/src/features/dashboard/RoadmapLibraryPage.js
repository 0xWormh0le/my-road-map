import React, { useEffect, useState, useCallback } from 'react';
// import PropTypes from 'prop-types';

import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { faSpinnerThird } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { DesktopHeader, Header, Loader } from '../common';
import { useFetchUser } from '../user/redux/hooks';
import { useFetchUserRoadmaps, useAssignUserRoadmap } from '../manage/redux/hooks';
import roadmapImage from '../../images/roadmap.png'

const Roadmap = ({ data, onAssignClick, ...other }) => (
  <Card className="mrm-mb-1 mrm-p-0_75" {...other} >
    <Row className="align-items-center" noGutters>
      <Card.Img
        alt={data.title}
        src={data.icon ? data.icon.src : roadmapImage}
      />
      <Col>
        <Card.Body>
          {/* roadmap.title */}
          <Card.Title className="mrm-mb-0_75">
            {data.title}
          </Card.Title>
          {/* roadmap.description (this will probably need a new field on the roadmap model to display the way Kollyn wants it) */}
          <Card.Subtitle className="mrm-mb-0_5">
            {data.description}
          </Card.Subtitle>
          <Card.Text>
            {/* Needs redux action (if you get to it before I do) and API call to add roadmap to user */}
          </Card.Text>
        </Card.Body>
        {data.assigned ? (
            <span className="assigned-label">Assigned</span>
          ) : (
            <Button
              variant="primary"
              className="float-right"
              disabled={data.assigned === 'requesting'}
              onClick={onAssignClick}
            >
              {data.assigned === 'requesting' && (
                <FontAwesomeIcon
                  icon={faSpinnerThird}
                  className="mrm-mr-0_25"
                  size='xs'
                  spin
                />
              )}
              Add Roadmap
            </Button>
        )}
      </Col>
    </Row>
  </Card>
)

export default function RoadmapLibraryPage() {
  // This is fetching a set of roadmaps (roadmap_templates) that are available on the company, but distinct from roadmaps currently on the user
  const { user } = useFetchUser();
  const { fetchUserRoadmaps } = useFetchUserRoadmaps()
  const { assignUserRoadmap } = useAssignUserRoadmap()
  const [roadmaps, setRoadmaps] = useState(null)

  useEffect(() => {
    if (user && user.id) {
      Promise.all([
        fetchUserRoadmaps({ userId: user.id, type: 'assigned' }),
        fetchUserRoadmaps({ userId: user.id, type: 'available' })
      ]).then(values => {
        setRoadmaps(
          values[0].data.map(i => ({ ...i, assigned: true }))
            .concat(values[1].data.map(i => ({ ...i, assigned: false })))
            .sort((a, b) => a.id - b.id )
        )
      })
    }
  }, [user, fetchUserRoadmaps])

  const handleAssignRoadmap = useCallback(id => () => {
    setRoadmaps(s => s.map(i => ({
      ...i,
      assigned: id === i.id ? 'requesting' : i.assigned
    })))
    assignUserRoadmap({
      roadmapId: id,
      userId: user.id
    }).then(() => setRoadmaps(s => s.map(i => ({
      ...i,
      assigned: id === i.id ? true : i.assigned
    }))))
  }, [assignUserRoadmap, user])

  return (
    <div className="dashboard-roadmap-library-page h-100 theme-bg">
      <Header icon="back" title="Roadmap Library" defaultBackLink="/dashboard/roadmaps" border />
      <DesktopHeader />
      <Container className="mrm-px-1 mrm-pt-1">
        <h2 className="d-none d-lg-block mrm-mb-1_5 mrm-mt-0_5">Roadmap Library</h2>
        {!roadmaps ? (
          <Loader />
        ) : roadmaps.map(r => (
          <Roadmap
            data={r}
            key={r.id}
            onAssignClick={handleAssignRoadmap(r.id)}
          />
        ))}
      </Container>
    </div>
  );
}

RoadmapLibraryPage.propTypes = {};
RoadmapLibraryPage.defaultProps = {};
