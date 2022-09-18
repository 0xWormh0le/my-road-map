import React, { useCallback, useEffect } from 'react';
import { useParams, Link, useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import InputGroup from 'react-bootstrap/InputGroup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup';
import clsx from 'clsx';
import { useUpdateCohort, useAddCohort, useFetchCohorts } from './redux/hooks';
import { Loader, Header, DesktopHeader } from '../common';
import usePrivateLabelledSettings from '../common/usePrivateLabelledSettingsHook';
import useEffectiveBackLink from '../common/useEffectiveBackLinkHook';

// import PropTypes from 'prop-types';

const schema = yup.object().shape({
  name: yup.string().required(),
  signup_url: yup.string().required(),
  description: yup.string()
})

function GroupEditForm(props) {
  const {
    appDomain,
    className,
    cohort,
    groupId,
    errors,
    register,
  } = props;

  return (<Form className={clsx("mrm-p-1", className)}>
    <Form.Group controlId='name'>
      <Form.Label>Group Name</Form.Label>
      <Form.Control
        name='name'
        defaultValue={(groupId && cohort) ? cohort.name : undefined }
        isInvalid={errors.name}
        ref={register}
      />
    </Form.Group>

    <Form.Group controlId='signup_url'>
      <Form.Label>Signup URL</Form.Label>
      <InputGroup>
        <InputGroup.Prepend>
          <InputGroup.Text>{appDomain}/</InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control
          name='signup_url'
          defaultValue={(groupId && cohort) ? cohort.signup_url : undefined }
          isInvalid={errors.signup_url}
          ref={register}
        />
      </InputGroup>
    </Form.Group>

    <Form.Group controlId='description'>
      <Form.Label>Description</Form.Label>
      <Form.Control
        name='description'
        as='textarea'
        defaultValue={(groupId && cohort) ? cohort.description : undefined }
        isInvalid={errors.description}
        ref={register}
      />
    </Form.Group>
  </Form>);
}

export default function GroupEditPage() {
  const { groupId } = useParams()

  const history = useHistory()

  const { appDomain } = usePrivateLabelledSettings()

  const { cohorts, fetchCohorts, fetchCohortsPending } = useFetchCohorts()

  const { addCohort, addCohortPending } = useAddCohort()

  const { updateCohort, updateCohortPending } = useUpdateCohort()

  const cohort = (groupId && cohorts) ? cohorts.results.find(i => i.id === Number(groupId)) : null

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    if (groupId) {
      fetchCohorts({ cohortId: groupId })
    }
  }, [fetchCohorts, groupId])

  const defaultBackLink = groupId ? `/manage/groups/${groupId}` : '/manage/groups';
  const effectiveBackLink = useEffectiveBackLink(defaultBackLink);
  const handleSaveClick = useCallback(({ name, signup_url, description }) => {
    if (groupId) {
      updateCohort({ groupId, name, signup_url, description })
        .then(() => history.push(effectiveBackLink))
    } else {
      addCohort({ name, signup_url, description })
        .then(() => history.push(effectiveBackLink))
    }
  }, [groupId, addCohort, updateCohort, history, effectiveBackLink])

  const renderBackLink = useCallback((effectiveBackLink) => (
    <Link to={effectiveBackLink}>
      <Button className="btn-cancel" variant="white" >
        Cancel
      </Button>
    </Link>
  ), [])

  const renderSaveButton = useCallback(() => (
    <Button
      className="btn-save"
      variant="white"
      onClick={handleSubmit(handleSaveClick)}
    >
      Save
    </Button>
  ), [handleSubmit, handleSaveClick])

  if (groupId && !cohort && fetchCohortsPending) {
    return <Loader delay />
  }

  return (
    <div className="manage-group-edit-page">
      <Header
        renderThirdColumn={renderSaveButton}
        title={cohort ? 'Edit Group' : 'Add Group'}
        thirdColumnClass='text-right'
        colSizes={[3, 6, 3]}
        border
        renderBackLink={renderBackLink}
        defaultBackLink={defaultBackLink}
      />
      <DesktopHeader>
        <Container>
          <Row className="desktop-page-secondary-header-wrapper mrm-mb-1 mrm-py-1">
            <Col xs={1}>
              <Link to={defaultBackLink}>
                <Button className="btn-cancel" variant="gray" >
                  Cancel
                </Button>
              </Link>
            </Col>
            <Col xs={10}>
              <h1 className="text-center"> {cohort ? 'Edit Group' : 'Add Group'}</h1>
            </Col>
            <Col xs={1}>            
              {renderSaveButton()}
            </Col>
          </Row>
        </Container>
      </DesktopHeader>
      {(addCohortPending || updateCohortPending) && (
        <Loader />
      )}
      <div className="d-lg-none mobile-page-container">
        <GroupEditForm
          appDomain={appDomain}
          cohort={cohort}
          groupId={groupId}
          errors={errors}
          register={register}
        />
      </div>
      <div className="d-none d-lg-block desktop-page-container">
        <Container>
          <GroupEditForm
            appDomain={appDomain}
            className="card"
            cohort={cohort}
            groupId={groupId}
            errors={errors}
            register={register}
          />
        </Container>
      </div>
    </div>
  );
};

GroupEditPage.propTypes = {};
GroupEditPage.defaultProps = {};
