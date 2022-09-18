import React, { useCallback, useEffect, useState } from 'react';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import Select from 'react-select';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Switch from 'react-switch';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinnerThird } from '@fortawesome/pro-duotone-svg-icons';
import xor from 'lodash/xor';
import * as yup from 'yup';
import clsx from 'clsx';
import { Header, UserAvatar, Loader, CustomDialog, DesktopHeader } from '../common';
import { useFetchAssignedUsers, useFetchRoadmaps } from '../dashboard/redux/hooks';
import {
  useFetchCohorts,
  useSendWelcomeEmail,
  useDeleteUser,
  useUpdateUserAvatar,
  useUpdateUser,
  useBulkAssignUserRoadmaps,
  useAddUser
} from './redux/hooks';
import UserAvatarEditor from '../user/components/UserAvatarEditor';
import { useFetchUser } from '../user/redux/hooks';
import useEffectiveBackLink from '../common/useEffectiveBackLinkHook';

const IMAGE_FORMATS = [
  "image/jpg",
  "image/jpeg",
  "image/gif",
  "image/png"
]

const schema = yup.object().shape({
  first_name: yup.string().required(),
  last_name: yup.string().required(),
  email: yup.string().email(),
  phone_number: yup.string(),
  groups: yup.array().required(),
  cohort: yup.array().nullable(),
  roadmaps_info: yup.array().nullable(),
  coaches: yup.array().nullable(),
  bio: yup.string(),
  isApproved: yup.bool(),
  photo: yup.mixed().test('fileFormat', 'Image file only', value => {
    return (value && value.length > 0) ? IMAGE_FORMATS.includes(value[0].type) : true
  })
})

const multiSelectStyles = {
  control: (styles, state) => {
    const custom = {
      ...styles,
      borderRadius: '0.5em',
    }
    if (state.isFocused) {
      custom.boxShadow = 'none'
    }
    return custom
  }
}

const customComponentDefaultValues = {
  groups: [],
  cohort: [],
  roadmaps_info: [],
  coach: [],
  is_approved: true
}

function EditUserProfileComponent({userId, setSaveButtonProps, setUser, onSuccessfulSave}) {
  const history = useHistory()

  const [deleteModal, setDeleteModal] = useState(false)

  const [photo, setPhoto] = useState(null)

  const [photoFileName, setPhotoFileName] = useState(null)

  const { replaceStringWithSynonyms } = useFetchUser()

  const { assignedUsers, assignedCoaches, fetchAssignedUsersPending, fetchAssignedUsers } = useFetchAssignedUsers()

  const { fetchCohorts, cohorts } = useFetchCohorts()

  const { addUser, addUserPending } = useAddUser()

  const { roadmaps, fetchRoadmaps } = useFetchRoadmaps()

  const { deleteUser, deleteUserPending } = useDeleteUser()

  const { updateUserAvatar, updateUserAvatarPending } = useUpdateUserAvatar()

  const { updateUser, updateUserPending } = useUpdateUser()

  const { bulkAssignUserRoadmaps, bulkAssignUserRoadmapsPending } = useBulkAssignUserRoadmaps()

  const { sendWelcomeEmail, sendWelcomeEmailPending } = useSendWelcomeEmail()

  const user = assignedUsers ? assignedUsers.results.find(u => u.id === userId) : null

  const [photoFile, setPhotoFile] = useState(null)

  const multiselectList = {
    cohort: cohorts ? cohorts.results.map(item => ({ id: item.id, text: item.name })) : null,
    coach: assignedCoaches ? assignedCoaches.results.map(item => ({ id: item.id, first_name: item.first_name, last_name: item.last_name })) : null,
    roadmaps_info: roadmaps ? roadmaps.results : null,
  }

  const { register, handleSubmit, control, errors, setError } = useForm({
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    if (!!userId) {
      fetchAssignedUsers({ userId })
    }
    fetchAssignedUsers({ type: 'Coach' })
  }, [fetchAssignedUsers, userId])

  useEffect(() => {
    fetchCohorts()
  }, [fetchCohorts])

  useEffect(() => {
    fetchRoadmaps()
  }, [fetchRoadmaps])

  const effectiveBackLink = useEffectiveBackLink(userId ? `/manage/user/${userId}` : '/manage/accounts');
  const redirectBack = useCallback(() => {
    history.push(effectiveBackLink);
  }, [history, effectiveBackLink])

  const handleError = useCallback(
    err => Object.keys(err).forEach(key => {
      const errors = err[key]
      if (errors.length) {
        setError(key, { message: errors[0], type: 'remote' })
      }
    }),
    [setError]
  )

  const handleSaveClick = useCallback(values => {
    if (userId) {
      const data = {
        ...values,
        coach_write_only: values.coach ? values.coach.map(i => i.id) : [],
        cohort: values.cohort ? values.cohort.map(i => i.id) : [],
      }
      Promise.all([
        updateUser({ userId, data }),
        bulkAssignUserRoadmaps({
          userId,
          ids: values.roadmaps_info ? values.roadmaps_info.map(i => i.id) : []
        })
      ]).then(() => (typeof onSuccessfulSave === "function" ? onSuccessfulSave : redirectBack)())
        .catch(e => handleError(e.response.data))
    } else {
      const data = new FormData()
      Object.keys(values).forEach(key => {
        if (['cohort', 'roadmaps_info'].includes(key)) {
          if (values[key].length > 0) {
            values[key].map(i => data.append(key, i.id))
          }
        } else if (key === 'photo') {
          !!photoFile && (          
            data.append('photo', photoFile)
          )
        } else if (key === 'coach') {
          if (values.coach.length > 0) {
            values[key].map(i => data.append('coach_write_only', i.id))
          }
        }
        else if (key === 'groups') {
          if (values.groups.length > 0) {
            values[key].map(i => data.append('groups', i))
          }
        } else {
          data.append(key, values[key])
        }
      })
      let newUserId;
      addUser(data)
        .then(res => {
          newUserId = res.id;
          if (values.roadmaps_info) {
            return bulkAssignUserRoadmaps({
              userId: res.id,
              ids: values.roadmaps_info.map(i => i.id)
            })
          } else {
            return true
          }
        })
        .then(() => {
          if (typeof onSuccessfulSave === "function") {
            onSuccessfulSave();
          } else {
            history.push(`/manage/user/${newUserId}`);
          }
        })
        .catch(e => handleError(e.response.data))
    }
  }, [
    userId,
    updateUser,
    bulkAssignUserRoadmaps,
    addUser,
    onSuccessfulSave,
    handleError,
    redirectBack,
    history,
    photoFile
  ])

  useEffect(() => setSaveButtonProps({
    disabled: addUserPending || updateUserPending,
    onClick: handleSubmit(handleSaveClick),
  }), [
    setSaveButtonProps,
    addUserPending,
    updateUserPending,
    handleSubmit,
    handleSaveClick,
  ])

  useEffect(() => {
    if (typeof setUser === "function") setUser(user);
  }, [ setUser, user ])

  const handleSendWelcomeEmailClick = useCallback(() => {
    sendWelcomeEmail({ userId }).then(() => alert('Welcome email has been sent'))
  }, [sendWelcomeEmail, userId])

  const handleDeleteAccountClick = useCallback(() => setDeleteModal(true), [])

  const handleDeleteDialogHide = useCallback(() => setDeleteModal(false), [])

  const handleDeleteAccount = useCallback(() => {
    deleteUser({ userId }).then(() => history.push("/manage/accounts"))
    setDeleteModal(false)

  }, [deleteUser, userId, history])

  const handleAvatarUpdate = useCallback(
    data => updateUserAvatar({ userId, data }).then(redirectBack),
    [userId, updateUserAvatar, redirectBack]
  )

  const handleAvatarRemove = useCallback(
    () => updateUserAvatar({ userId, data: null }).then(redirectBack),
    [userId, updateUserAvatar, redirectBack]
  )

  const handleNewUserAvatarChange = useCallback(e => {
    const reader = new FileReader()
    const file = e.target.files[0]

    e.preventDefault()
    setPhotoFileName(file.name)

    if (IMAGE_FORMATS.includes(file.type)) {
      setPhotoFile(file)
      reader.onloadend = () => setPhoto(reader.result)
      reader.readAsDataURL(file)
    } else {
      setPhotoFile(null)
      setPhoto(false)
    }

    e.target.value = null
  }, [])

  const loader = (
    !multiselectList.cohort ||
    !multiselectList.roadmaps_info ||
    !multiselectList.coach ||
    addUserPending ||
    updateUserPending ||
    bulkAssignUserRoadmapsPending
  )

  const fields = [
    { type: 'string', label: 'First Name', name: 'first_name'},
    { type: 'string', label: 'Last Name', name: 'last_name'},
    { type: 'string', label: 'Email', name: 'email'},
    { type: 'string', label: 'Phone Number', name: 'phone_number'},
    { type: 'checkbox', label: 'Roles', name: 'groups' },
    { type: 'multiselect', label: 'Groups', name: 'cohort', labelKey: 'text' },
    { type: 'multiselect', label: 'Roadmaps', name: 'roadmaps_info', labelKey: 'title' },
    { type: 'multiselect', label: replaceStringWithSynonyms('Coaches'), name: 'coach', labelKey: c => `${c.first_name} ${c.last_name}` },
    { type: 'file', label: 'Profile Photo', name: 'photo' },
    { type: 'text', label: 'Bio', name: 'bio'},
    { type: 'switch', label: 'Is Approved', name: 'is_approved' }
  ]

  if (userId && (!user || fetchAssignedUsersPending)) {
    return <Loader delay />
  }

  return (
    <>
    <div className="d-lg-none mobile-page-container">
      <div className="manage-edit-user-profile-component">
      {loader && <Loader />}

      {userId && (
        <UserAvatarEditor
          user={user}
          onUpdate={handleAvatarUpdate}
          onRemove={handleAvatarRemove}
          requesting={updateUserAvatarPending}
          className="mrm-mt-1"
        />
      )}

      <div className="mrm-px-1 mrm-mt-1">
        {fields.map(({ type, name, label, labelKey }) => (
          <Form.Group controlId={name} key={name} className={clsx({'mrm-mb-1 position-relative' : type === 'file'})}>
            {!(userId && type === 'file') && (
              <Form.Label>{replaceStringWithSynonyms(label)}</Form.Label>
            )}
            { type === 'string' ? (
              <Form.Control
                name={name}
                defaultValue={userId && user[name]}
                isInvalid={errors[name]}
                ref={register}
              />
            ) : type === 'text' ? (
              <Form.Control
                name={name}
                as='textarea'
                defaultValue={userId && user[name]}
                isInvalid={errors[name]}
                ref={register}
              />
            ) : type === 'file' ? !userId && (
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <Button variant="white">
                    <Form.Label>Choose Photo</Form.Label>
                    <Form.Control
                      name={name}
                      type='file'
                      accept='image/*'
                      className="d-none"
                      onChange={handleNewUserAvatarChange}
                      ref={register}
                    />
                  </Button>
                  {photoFileName && (
                    <div className="mrm-ml-0_75"><small>{photoFileName}</small></div>
                  )}
                </div>
                {photo ? (
                  <img src={photo} alt="user-avatar" className='account-photo' />
                ) : photo === false && (
                  <div className={clsx("invalid-avatar", {'is-invalid': errors[name]})}>
                    Invalid file format
                  </div>
                )}
              </div>
            ) : (
              <Controller
                name={name}
                control={control}
                defaultValue={userId ? user[name] : customComponentDefaultValues[name]}
                render={({ onChange, value }) =>
                  type === 'checkbox' ? (
                    <div className="d-flex mrm-mt-0_75 mrm-ml-0_25">
                      {['User', 'Coach', 'Admin'].map(group => (
                        <Form.Check
                          type="checkbox"
                          key={group}
                          id={group}
                          label={replaceStringWithSynonyms(group)}
                          isInvalid={errors[name]}
                          checked={value.includes(group)}
                          onChange={() => onChange(xor(value, [group]))}
                          className="mrm-mr-1"
                        />
                      ))}
                    </div>
                  ) : type === 'multiselect' ? (
                    <Select
                      isMulti
                      name={name}
                      value={value}
                      options={multiselectList[name]}
                      getOptionValue={option => option.id}
                      getOptionLabel={option => typeof labelKey === "function" ? labelKey(option) : option[labelKey]}
                      components={{ IndicatorSeparator: null, ClearIndicator: null }}
                      onChange={onChange}
                      styles={multiSelectStyles}
                    />
                  ) : type === 'switch' && (
                    <div className="mrm-mt-0_5">
                      <Switch
                        onChange={onChange}
                        checked={!!value}
                        onColor='#2f80ed'
                      />
                    </div>
                  )
                }
              />
            )}

            {errors[name] && errors[name].type === 'remote' && (
              <small className="error-message">
                {errors[name].message}
              </small>
            )}
          </Form.Group>
        ))}
      </div>
      <hr/>
      {userId && (
        <div className="text-center">
          <Button
            variant="white"
            className="action-button mrm-mb-0_5 mrm-mx-0_5"
            onClick={handleSendWelcomeEmailClick}
            disabled={sendWelcomeEmailPending}
          >
            {sendWelcomeEmailPending && (
              <FontAwesomeIcon icon={faSpinnerThird} className="mrm-mr-0_25" size="xs" spin />
            )}
            Resend Welcome Email
          </Button>
          <Button
            variant="white"
            className="action-button mrm-mb-0_5 mrm-mx-0_5"
            onClick={handleDeleteAccountClick}
            disabled={deleteUserPending}
          >
            {deleteUserPending && (
              <FontAwesomeIcon icon={faSpinnerThird} className="mrm-mr-0_25" size="xs" spin />
            )}
            Permanently Delete Account
          </Button>
        </div>
      )}

      <CustomDialog
        text={{
          caption: 'Deleting an account is permanent. There is no way to undo this.',
          yes: 'Delete Account'
        }}
        show={deleteModal}
        onHide={handleDeleteDialogHide}
        onYes={handleDeleteAccount}
      />
    </div>
    </div>
    <div className="d-none d-lg-block desktop-page-container">
      <Container>
        <div className="manage-edit-user-profile-component card">
        {loader && <Loader />}

        {userId && (
          <UserAvatarEditor
            user={user}
            onUpdate={handleAvatarUpdate}
            onRemove={handleAvatarRemove}
            requesting={updateUserAvatarPending}
            className="mrm-mt-1"
          />
        )}

        <div className="mrm-px-1 mrm-mt-1">
          {fields.map(({ type, name, label, labelKey }) => (
            <Form.Group controlId={name} key={name} className={clsx({'mrm-mb-1 position-relative' : type === 'file'})}>
              {!(userId && type === 'file') && (
                <Form.Label>{replaceStringWithSynonyms(label)}</Form.Label>
              )}
              { type === 'string' ? (
                <Form.Control
                  name={name}
                  defaultValue={userId && user[name]}
                  isInvalid={errors[name]}
                  ref={register}
                />
              ) : type === 'text' ? (
                <Form.Control
                  name={name}
                  as='textarea'
                  defaultValue={userId && user[name]}
                  isInvalid={errors[name]}
                  ref={register}
                />
              ) : type === 'file' ? !userId && (
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <Button variant="white">
                      <Form.Label>Choose Photo</Form.Label>
                      <Form.Control
                        name={name}
                        type='file'
                        accept='image/*'
                        className="d-none"
                        onChange={handleNewUserAvatarChange}
                        ref={register}
                      />
                    </Button>
                    {photoFileName && (
                      <div className="mrm-ml-0_75"><small>{photoFileName}</small></div>
                    )}
                  </div>
                  {photo ? (
                    <img src={photo} alt="user-avatar" className='account-photo' />
                  ) : photo === false && (
                    <div className={clsx("invalid-avatar", {'is-invalid': errors[name]})}>
                      Invalid file format
                    </div>
                  )}
                </div>
              ) : (
                <Controller
                  name={name}
                  control={control}
                  defaultValue={userId ? user[name] : customComponentDefaultValues[name]}
                  render={({ onChange, value }) =>
                    type === 'checkbox' ? (
                      <div className="d-flex mrm-mt-0_75 mrm-ml-0_25">
                        {['User', 'Coach', 'Admin'].map(group => (
                          <Form.Check
                            type="checkbox"
                            key={group}
                            id={group}
                            label={replaceStringWithSynonyms(group)}
                            isInvalid={errors[name]}
                            checked={value.includes(group)}
                            onChange={() => onChange(xor(value, [group]))}
                            className="mrm-mr-1"
                          />
                        ))}
                      </div>
                    ) : type === 'multiselect' ? (
                      <Select
                        isMulti
                        name={name}
                        value={value}
                        options={multiselectList[name]}
                        getOptionValue={option => option.id}
                        getOptionLabel={option => typeof labelKey === "function" ? labelKey(option) : option[labelKey]}
                        components={{ IndicatorSeparator: null, ClearIndicator: null }}
                        onChange={onChange}
                        styles={multiSelectStyles}
                      />
                    ) : type === 'switch' && (
                      <div className="mrm-mt-0_5">
                        <Switch
                          onChange={onChange}
                          checked={!!value}
                          onColor='#2f80ed'
                        />
                      </div>
                    )
                  }
                />
              )}

              {errors[name] && errors[name].type === 'remote' && (
                <small className="error-message">
                  {errors[name].message}
                </small>
              )}
            </Form.Group>
          ))}
        </div>
    <hr/>
    {userId && (
      <div className="text-center mrm-mb-0_5">
        <Button
          variant=""
          className="action-button mrm-mb-0_5 mrm-mr-0_5 btn-gray"
          onClick={handleSendWelcomeEmailClick}
          disabled={sendWelcomeEmailPending}
        >
          {sendWelcomeEmailPending && (
            <FontAwesomeIcon icon={faSpinnerThird} className="mrm-mr-0_25" size="xs" spin />
          )}
          Resend Welcome Email
        </Button>
        <Button
          variant=""
          className="action-button mrm-mb-0_5 mrm-ml-0_5 btn-gray"
          onClick={handleDeleteAccountClick}
          disabled={deleteUserPending}
        >
          {deleteUserPending && (
            <FontAwesomeIcon icon={faSpinnerThird} className="mrm-mr-0_25" size="xs" spin />
          )}
          Permanently Delete Account
        </Button>
      </div>
    )}

    <CustomDialog
      text={{
        caption: 'Deleting an account is permanent. There is no way to undo this.',
        yes: 'Delete Account'
      }}
      show={deleteModal}
      onHide={handleDeleteDialogHide}
      onYes={handleDeleteAccount}
    />
    
</div>
</Container>
</div>
    </>
  );
}

export function EditUserProfileModal({show, onHide, userId}) {
  const [saveButtonProps, setSaveButtonProps] = useState({})

  const onSuccessfulSave = useCallback(() => onHide(true), [ onHide ]);

  return (<Modal show={show} onHide={onHide} centered className="manage-edit-user-profile-modal">
    <Modal.Header>
      <Button variant="secondary" className="font-weight-bold" onClick={onHide}>
        Cancel
      </Button>
      <div>
        <h2 className="mrm-mt-0_75">Edit Account</h2>
      </div>
      <Button {...saveButtonProps}>
        Save Changes
      </Button>
    </Modal.Header>
    <Modal.Body>
      <EditUserProfileComponent
        userId={userId}
        setSaveButtonProps={setSaveButtonProps}
        onSuccessfulSave={onSuccessfulSave}
      />
    </Modal.Body>
  </Modal>)
}

export default function EditUserProfilePage() {
  const location = useLocation()

  const params = useParams()

  
  const userId = location.pathname === '/manage/user/add-profile' ? null : Number(params.userId)
  const effectiveBackLink = useEffectiveBackLink(userId ? `/manage/user/${userId}` : '/manage/accounts')

  const [avatarHeader, setAvatarHeader] = useState(false)
  const [saveButtonProps, setSaveButtonProps] = useState({})
  const [user, setUser] = useState(null)

  useEffect(() => {
    const handleScroll = e => {
      setAvatarHeader(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const renderBackLink = useCallback(() => (
    <Link to={effectiveBackLink}>
      <Button className="btn-cancel" variant="white" >
        Cancel
      </Button>
    </Link>
  ), [effectiveBackLink])

  const renderSaveButton = useCallback(() => (
    <Button
      className="btn-save"
      variant="white"
      {...saveButtonProps}
    >
      Save
    </Button>
  ), [ saveButtonProps ])

  return <div className="manage-edit-user-profile-page">
    <Header
      icon="back"
      title={userId ? 'Edit Account' : 'Add Account'}
      renderThirdColumn={renderSaveButton}
      thirdColumnClass="text-right"
      colSizes={[3, 6, 3]}
      border
      renderBackLink={renderBackLink}
      defaultBackLink={effectiveBackLink}
    >
      {avatarHeader && userId && (
        <div className="d-flex align-items-center justify-content-center">
          <UserAvatar user={user} size="sm" />
          &nbsp;<strong>{user.first_name} {user.last_name}</strong>
        </div>
      )}
    </Header>
    <DesktopHeader>
        <Container>
          <div className="desktop-page-secondary-header-wrapper mrm-mb-1 mrm-py-1">
            <Row>
              <Col xs={2}>
                <Link className="btn-cancel" to={effectiveBackLink}>
                  <Button variant="gray">
                    Cancel
                  </Button>
                </Link>
              </Col>
              <Col xs={8}>
                <h1 className="text-center">{userId ? 'Edit Account' : 'Add Account'}</h1>
              </Col>
              <Col xs={2}>            
                {renderSaveButton()}
              </Col>
            </Row>
            {avatarHeader && userId && (
              <div className="d-flex align-items-center justify-content-center">
                <UserAvatar user={user} size="sm" />
                &nbsp;<strong>{user.first_name} {user.last_name}</strong>
              </div>
            )}
          </div>
        </Container>
      </DesktopHeader>
    <EditUserProfileComponent userId={userId} setSaveButtonProps={setSaveButtonProps} setUser={setUser} />
  </div>;
};

EditUserProfilePage.propTypes = {};
EditUserProfilePage.defaultProps = {};
