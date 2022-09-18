import React, { useEffect, useState, useCallback } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Toast from 'react-bootstrap/Toast';
import { Alert } from 'react-bootstrap';

import { useHistory } from 'react-router-dom';

import { Header, DesktopHeader } from '../../common';
import { useUnauthorizedErrorHandler } from '../../../common/apiHelpers';

import { useFetchUser, useUpdateUser, useUpdateProfilePhoto, useDeleteUser, useChangePassword } from '../redux/hooks';
import UserAvatarEditor from './UserAvatarEditor';

const AccountDeleteModal = ({ show, onHide, onCancel, onDeleteConfirm }) => {
  const [confirmText, setConfirmText] = useState('')

  const handleConfirmChange = e => {
    setConfirmText(e.target.value)
  }

  const handleKeyUp = e => {
    if (e.which === 13 && e.target.value.toLowerCase() === "delete") {
      onDeleteConfirm()
    }
  }

  return (
    <Modal
      centered
      show={show}
      onHide={onHide}
      className='account-delete-modal'
      size="lg"
    >
      <Modal.Header className="d-flex justify-content-between align-items-center">
        <Modal.Title className="w-100 text-left">
          <h1 className="title">Delete Account Confirmation</h1>
        </Modal.Title>
        <Button
          variant="white"
          className="btn-cancel"
          onClick={onCancel}>
          Cancel
        </Button>
      </Modal.Header>
      <Modal.Body className="photo-change-body">
        <small className="text-secondary">
          Deleting your account will erase all of your progress on your Roadmaps, connections, messages, comments.
          There is no way to get this information back once you delete your account.
        </small>
        <div className="confirm">
          <label className="mrm-mt-1_5 w-100">
            <small><strong>Type DELETE to confirm</strong></small>
            <br/>
            <input
              className="form-control input-sm"
              onChange={handleConfirmChange}
              onKeyUp={handleKeyUp}
              value={confirmText}
            />
          </label>
          <Button
            variant="orange"
            onClick={onDeleteConfirm}
            disabled={confirmText.toLowerCase() !== "delete"}
            className="mt-2 btn-sm btn-delete-account"
          >
            Permanently Delete Account
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  )
}


const AccountChangePasswordModal = ({ show, onHide, onCancel, onPasswordChange }) => {

  const { changePasswordPending, changePasswordError } = useChangePassword()

  const [oldPassword, setOldPassword] = useState()
  const [newPassword, setNewPassword] = useState()
  const [confirmPassword, setConfirmPassword] = useState()

  return (
    <Modal
      centered
      show={show}
      onHide={onHide}
      dialogClassName="account-change-password-modal"
      className="modal-mobile-slide-from-bottom"
    >
      <Modal.Header className="d-flex justify-content-between align-items-center">
        <Modal.Title className="w-100 text-center">
          <h1 className="title">Change Password</h1>
          <Button
            variant=""
            className="cancel-btn btn-secondary float-left"
            onClick={onCancel}>
            Cancel
          </Button>
        </Modal.Title>

      </Modal.Header>
      <Modal.Body className="full-width">
        <Row>

          <Col>
            {
              changePasswordError &&
              (
                <Alert variant="danger">{changePasswordError}</Alert>
              )
            }

            <Form noValidate onSubmit={onPasswordChange}>
              <Form.Group controlId="formCurrentPassword">
                <Form.Control required type="password" placeholder="Current Password" onChange={(e) => setOldPassword(e.target.value)} />
              </Form.Group>
              <Form.Group controlId="formPassword">
                <Form.Control
                  required
                  type="password"
                  isInvalid={(newPassword?.length > 0 && newPassword?.length < 8)}
                  placeholder="New Password"
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  Password must be 8 characters or longer
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="formConfirmPassword">
                <Form.Control
                  required
                  type="password"
                  isInvalid={((confirmPassword?.length > 0 && confirmPassword?.length < 8) || (newPassword && confirmPassword && confirmPassword !== newPassword))}
                  placeholder="Confirm Password"
                  onChange={(e) => setConfirmPassword(e.target.value)} />
                <Form.Control.Feedback type="invalid">
                  Passwords do not match
                </Form.Control.Feedback>
              </Form.Group>
              <Button
                disabled={changePasswordPending || !oldPassword || !newPassword || !confirmPassword}
                className="btn-100"
                variant="primary"
                type="submit"
              >

                {
                  changePasswordPending ? (

                    <Spinner animation="border" role="status">
                      <span className="sr-only">Changing password...</span>
                    </Spinner>
                  ) :
                    ('Change my password')
                }
              </Button>
            </Form>
          </Col>

        </Row>



      </Modal.Body>
    </Modal>
  )
}

export default function ProfileForm (props) {
  const { user, onCancelEdit, onProfileSaved } = props;

  const [validated, setValidated] = useState(false);
  const [editableUser, setEditableUser] = useState({});
  const [showAccountDelete, setShowAccountDelete] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const {
    updateUser,
    updateUserPending,
    updateUserError,
    dismissUpdateUserError,
  } = useUpdateUser();

  const {
    updateProfilePhoto,
    updateProfilePhotoPending
  } = useUpdateProfilePhoto();

  const { deleteUser } = useDeleteUser();
  const history = useHistory();
  const { fetchUser } = useFetchUser();

  const unauthorizedErrorHandler = useUnauthorizedErrorHandler();

  const { changePassword, setChangePasswordErrorMessage } = useChangePassword()
  useEffect(() => {
    setEditableUser(Object.assign({}, user));
  }, [user]);

  const handleSubmit = event => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;
    if (form.checkValidity()) {
      delete editableUser.photo;
      updateUser(editableUser)
        .then(() => {
          onProfileSaved();
        })
        .catch(unauthorizedErrorHandler)
        .catch(() => {
          console.warn('Error updating user profile');
          setValidated(false);
        });
    }

    setValidated(true);
  };

  function renderHeaderCancelLink() {
    return (
      <Button variant="link" onClick={onCancelEdit}>
        Cancel
      </Button>
    );
  }

  function renderHeaderSaveLink() {
    return (
      <Button variant="link" type="submit" form="profile-edit-form">
        Save
      </Button>
    );
  }

  function formOnChange(event) {
    if (updateUserError) dismissUpdateUserError();
    const updatedUser = Object.assign({}, editableUser);
    updatedUser[event.currentTarget.name] = event.currentTarget.value;
    setEditableUser(updatedUser);
  }

  const handleRemoveAvatar = useCallback(() => {
    updateProfilePhoto(null)
      .then(() => fetchUser().catch(unauthorizedErrorHandler))
      .catch(unauthorizedErrorHandler)
      .catch(() => {
        console.warn('Error updating user profile');
      });
  }, [fetchUser, unauthorizedErrorHandler, updateProfilePhoto])

  const handleUpdateAvatar = useCallback(data => {
    updateProfilePhoto(data)
      .then(() => fetchUser().catch(unauthorizedErrorHandler))
      .catch(unauthorizedErrorHandler)
      .catch(() => {
        console.warn('Error updating user profile');
      });
  }, [fetchUser, unauthorizedErrorHandler, updateProfilePhoto])

  const handleDeleteAccount = () => {
    setShowAccountDelete(true)
  }

  let errorMessage = undefined;
  let formFieldErrors = {};
  if (updateUserError) {
    if (
      updateUserError.response &&
      updateUserError.response.status === 400 &&
      updateUserError.response.data
    ) {
      formFieldErrors = updateUserError.response.data;
    } else {
      errorMessage = 'Unknown error occurred.';
    }
  }

  const formFields = [
    ['first_name', 'First Name', { required: true }],
    ['last_name', 'Last Name', { required: true }],
    ['email', 'Email', { required: true, type: 'email' }],
    ['phone_number', 'Phone number', { type: 'tel' }],
    ['bio', 'Bio', { as: 'textarea', rows: 3 }],
  ];

  const handleDeleteConfirm = () => {
    setShowAccountDelete(false)
    deleteUser().then(() => history.push('/'))
  }

  const updatePending = updateUserPending || updateProfilePhotoPending;

  const handleChangePassword = (event) => {

    const form = event.currentTarget;
    console.log({ form })
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();
      event.stopPropagation();
      const old_password = form.elements.formCurrentPassword.value
      const new_password = form.elements.formPassword.value
      const confirm_password = form.elements.formConfirmPassword.value
      if (new_password !== confirm_password) {
        return setChangePasswordErrorMessage("New Password and Confirm Password do not match.")
      }
      changePassword({
        old_password,
        new_password,
        confirm_password,
      }).then((result) => {
        setShowChangePassword(false)
        onProfileSaved()

      })
    }
  }

  return (
    <div className="user-components-profile-form">
      <Header
        border
        colSizes={[3, 6, 3]}
        thirdColumnClass='text-right'
        renderThirdColumn={renderHeaderSaveLink}
        title="Edit Profile"
        renderBackLink={renderHeaderCancelLink}
      />
      <DesktopHeader />
      <Container className="mrm-mt-1_5 d-none d-lg-block">
        <h1>Edit Profile</h1>
      </Container>
      <Container>
        <div className="form-container mrm-mt-1 mrm-px-1 theme-card">
          <Row className="justify-content-center py-0 pt-md-5 d-flex flex-column-reverse flex-md-row">
            <Toast
              autohide
              className="mx-auto mb-4"
              delay={3000}
              onClose={() => dismissUpdateUserError()}
              show={!!errorMessage}
            >
              <Toast.Header>
                <strong className="mr-auto text-danger">Error</strong>
              </Toast.Header>
              <Toast.Body>{errorMessage}</Toast.Body>
            </Toast>
            {updatePending ? (
              <Col className="text-center" md={{span: 4, offset: 1}} >
                <Spinner animation="border" role="status">
                  <span className="sr-only">Saving...</span>
                </Spinner>
              </Col>
            ) : (
              <Col md={{span: 4, offset: 1}}>
                <Form id="profile-edit-form" noValidate validated={validated} onSubmit={handleSubmit}>
                  {formFields.map(([field, label, moreProps]) => (
                    <Form.Group key={field} controlId={`form-${field}`}>
                      <Form.Label>
                        <small className="font-weight-bold theme-text-primary">{label}</small>
                      </Form.Label>
                      <Form.Control
                        isInvalid={!!formFieldErrors[field]}
                        name={field}
                        onChange={formOnChange}
                        placeholder={label}
                        type="text"
                        value={editableUser[field] || ''}
                        {...moreProps}
                      />
                      {formFieldErrors[field] && (
                        <Form.Control.Feedback type="invalid">
                          {formFieldErrors[field]}
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>
                  ))}
                  <Button className="w-100" type="submit">
                    Save Changes
                  </Button>
                  <Row className="justify-content-md-start ">
                    <Col md={{span: 7}} className="text-left text-sm-left">
                      <Button
                        variant="link"
                        className="mrm-mb-2 change-password"
                        onClick={() => setShowChangePassword(true)}
                      >
                        Change Password
                  </Button>
                    </Col>
                  </Row>

                </Form>
              </Col>
            )}
            {!updatePending && <Col md={3}>
              <UserAvatarEditor
                user={user}
                onUpdate={handleUpdateAvatar}
                onRemove={handleRemoveAvatar}
              />
            </Col>}
          </Row>
          {user.features.can_erase_their_account && !updatePending && (
            <>
              <hr className="mrm-my-1" />
              <Row className="justify-content-md-center mrm-pb-1">
                <Col md={{span: 7, offset: 1}} className="text-center text-sm-left">
                  <Button
                    variant="gray"
                    size="sm"
                    className="btn-gray btn-delete-account"
                    onClick={handleDeleteAccount}
                  >
                    Delete Account
                  </Button>
                </Col>
              </Row>
            </>
          )}

          <AccountDeleteModal
            show={showAccountDelete}
            onCancel={() => setShowAccountDelete(false)}
            onHide={() => setShowAccountDelete(false)}
            onDeleteConfirm={handleDeleteConfirm}
          />

          <AccountChangePasswordModal
            show={showChangePassword}
            onCancel={() => setShowChangePassword(false)}
            onHide={() => setShowChangePassword(false)}
            onPasswordChange={handleChangePassword}
          />

        </div>
      </Container>
    </div>
  );
};

ProfileForm.propTypes = {};
ProfileForm.defaultProps = {};
