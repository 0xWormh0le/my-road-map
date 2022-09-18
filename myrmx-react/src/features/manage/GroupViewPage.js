import React, { useEffect } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import { DesktopHeader, DesktopBackButton } from '../common';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/pro-duotone-svg-icons';
import dayjs from 'dayjs'

// import PropTypes from 'prop-types';
import { useFetchCohorts, useFetchCohortUsers } from './redux/hooks';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import UserAvatar from '../common/UserAvatar';
import Header from '../common/Header';
import Loader from '../common/Loader';
import usePrivateLabelledSettings from '../common/usePrivateLabelledSettingsHook';
import usePagination from '../common/usePagination';

export default function GroupViewPage() {
  const { cohorts, fetchCohorts } = useFetchCohorts()

  const { appDomain } = usePrivateLabelledSettings()

  const { cohortUsers, fetchCohortUsers, fetchCohortUsersPending } = useFetchCohortUsers()

  const { groupId } = useParams()
  const location = useLocation();

  const cohort = cohorts ? cohorts.results.find(i => i.id === Number(groupId)) : null

  usePagination({
    fetchAction: fetchCohortUsers,
    actionArgs: { cohortId: groupId },
    requestNextPage: () => cohortUsers && cohortUsers.next && !fetchCohortUsersPending
  });

  useEffect(() => {
    fetchCohorts({ cohortId: groupId })
    fetchCohortUsers({ cohortId: groupId })
  }, [fetchCohorts, fetchCohortUsers, groupId])

  if (!cohortUsers || !cohort) {
    return <Loader delay />
  }

  const defaultBackLink = '/manage/groups';

  return (
    <div className="manage-group-view-page mrm-p-1">
      <Header icon='back' defaultBackLink="/manage/groups" />
      <DesktopHeader/>
      <div className="d-lg-none mobile-page-container">
        <Card className='mrm-mt-2'>
          <Card.Body>
            <div className='avatar theme-text-primary'>
              <FontAwesomeIcon icon={faUsers} size='lg' className='m-auto' />
            </div>
            <div className="mrm-mt-2_5 text-center">
              <strong className="group-name">{cohort.name}</strong>
            </div>
            <Link to={{
              pathname: `/manage/groups/${groupId}/edit`,
              state: { backLink: location },
            }}>
              <Button className='btn-edit-group' variant='gray'>
                Edit Group
              </Button>
            </Link>
            {cohort.description && (
              <>
                <div className='color-secondary text-center description'>{cohort.description}</div>
                <hr />
              </>
            )}
            <Row className="table">
              {cohort.signup_url && (
                <>
                  <Col xs={4} className='color-secondary'>
                    SIGNUP URL
                  </Col>
                  <Col xs={8} className='theme-text-primary semibold'>
                    <Link to={{ pathname: `https://${appDomain}/${cohort.signup_url}` }} target='_blank'>
                      {`${appDomain}/${cohort.signup_url}`}
                    </Link>
                  </Col>
                </>
              )}
              <Col xs={4} className='color-secondary mrm-mt-0_5'>
                USERS
              </Col>
              <Col xs={8} className='color-primary semibold mrm-mt-0_5'>
                {cohort.users_count}
              </Col>
              <Col xs={4} className='color-secondary mrm-mt-0_5'>
                COACHES
              </Col>
              <Col xs={8} className='color-primary semibold mrm-mt-0_5'>
                {cohort.coaches_count}
              </Col>
              <Col xs={4} className='color-secondary mrm-mt-0_5'>
                ADMIN
              </Col>
              <Col xs={8} className='color-primary semibold mrm-mt-0_5'>
                {cohort.admins_count}
              </Col>
              <Col xs={4} className='color-secondary mrm-mt-0_5'>
                CREATED
              </Col>
              <Col xs={8} className='color-primary semibold mrm-mt-0_5'>
                {dayjs(cohort.created).format('MMM D, YYYY')}
              </Col>
            </Row>
            <hr />
            <div>
              <div className='mrm-mb-1 color-primary'>
                <strong>
                  Group Directory
                </strong>
              </div>
              {cohortUsers.results.map(user => (
                <Link
                  key={user.id}
                  className='card-in-card d-flex mrm-mt-0_5 mrm-pl-0_5'
                  to={{
                    pathname: `/manage/user/${user.id}`,
                    state: { backLink: location },
                  }}
                >
                  <UserAvatar user={user} size='sm' />
                  <div className='mrm-ml-0_5 name'>
                    {user.first_name} {user.last_name}
                  </div>
                </Link>
              ))}
            </div>
          </Card.Body>
        </Card>
      </div>
      <div className="d-none d-lg-block desktop-page-container">
        <Container>
          <DesktopBackButton defaultBackLink={defaultBackLink} />
          <Card className='mrm-mt-2'>
            <Card.Body>
              <div className='avatar theme-text-primary'>
                <FontAwesomeIcon icon={faUsers} size='lg' className='m-auto' />
              </div>
              <div className="mrm-mt-2_5 text-center">
                <strong className="group-name">{cohort.name}</strong>
              </div>
              <Link to={{
                pathname: `/manage/groups/${groupId}/edit`,
                state: { backLink: location },
              }}>
                <Button className='btn-edit-group' variant='gray'>
                  Edit Group
                </Button>
              </Link>
              {cohort.description && (
                <>
                  <div className='color-secondary text-center description'>{cohort.description}</div>
                  <hr />
                </>
              )}
              <Row className="table">
                {cohort.signup_url && (
                  <>
                    <Col xs={4} className='color-secondary'>
                      SIGNUP URL
                    </Col>
                    <Col xs={8} className='theme-text-primary semibold'>
                      <Link to={{ pathname: `https://${appDomain}/${cohort.signup_url}` }} target='_blank'>
                        {`${appDomain}/${cohort.signup_url}`}
                      </Link>
                    </Col>
                  </>
                )}
                <Col xs={4} className='color-secondary mrm-mt-0_5'>
                  USERS
                </Col>
                <Col xs={8} className='color-primary semibold mrm-mt-0_5'>
                  {cohort.users_count}
                </Col>
                <Col xs={4} className='color-secondary mrm-mt-0_5'>
                  COACHES
                </Col>
                <Col xs={8} className='color-primary semibold mrm-mt-0_5'>
                  {cohort.coaches_count}
                </Col>
                <Col xs={4} className='color-secondary mrm-mt-0_5'>
                  ADMIN
                </Col>
                <Col xs={8} className='color-primary semibold mrm-mt-0_5'>
                  {cohort.admins_count}
                </Col>
                <Col xs={4} className='color-secondary mrm-mt-0_5'>
                  CREATED
                </Col>
                <Col xs={8} className='color-primary semibold mrm-mt-0_5'>
                  {dayjs(cohort.created).format('MMM D, YYYY')}
                </Col>
              </Row>
              <hr />
              <div>
                <div className='mrm-mb-1 color-primary'>
                  <strong>
                    Group Directory
                  </strong>
                </div>
                {cohortUsers.results.map(user => (
                  <Link
                    key={user.id}
                    className='card-in-card d-flex mrm-mt-0_5 mrm-pl-0_5'
                    to={{
                      pathname: `/manage/user/${user.id}`,
                      state: { backLink: location },
                    }}
                  >
                    <UserAvatar user={user} size='sm' />
                    <div className='mrm-ml-0_5 name'>
                      {user.first_name} {user.last_name}
                    </div>
                  </Link>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </div>
  );
};

GroupViewPage.propTypes = {};
GroupViewPage.defaultProps = {};
