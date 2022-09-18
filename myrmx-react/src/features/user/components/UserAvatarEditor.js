import React, { useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import AvatarEditor from 'react-avatar-editor';
import Slider from 'rc-slider';
import clsx from 'clsx';
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import UserAvatar from '../../common/UserAvatar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinnerThird } from '@fortawesome/pro-duotone-svg-icons';

// import PropTypes from 'prop-types';

const AvatarEditModal = ({
  show,
  photo,
  onHide,
  uploadFileName,
  onUpdate,
  defaultScale = 1.2
}) => {
  const [photoScale, setPhotoScale] = useState(defaultScale);
  
  const editorRef = useRef(null)

  const handleCropPhoto = useCallback(() => {
    const canvas = editorRef.current.getImageScaledToCanvas();
    canvas.toBlob(blob => {
      const data = new FormData();
      data.append('photo', blob, uploadFileName);
      onUpdate(data)
      onHide()
    }, 'image/jpeg', 95);
  }, [onHide, uploadFileName, onUpdate])

  return (
    <Modal centered show={show} onHide={onHide}>
      <Modal.Header>
        <Modal.Title className="w-100">
          <h1>Zoom/Position Profile Photo</h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0 photo-edit-body">
        {photo &&
          <AvatarEditor
            image={photo}
            ref={editorRef}
            width={250}
            height={250}
            border={50}
            borderRadius={250}
            color={[0, 0, 0, 0.6]} // RGBA
            scale={photoScale}
            rotate={0}
            style={{ width: '100%', height: 'auto', background: 'black' }}
          />
        }
        <div className="scale-slider">
          <Slider
            defaultValue={defaultScale}
            min={0.8}
            max={2}
            step={0.01}
            onChange={setPhotoScale}
          />
        </div>
        <div className="edit-actions">
          <Button variant="secondary" className="font-weight-bold" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCropPhoto}>
            Confirm
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  )
}

const AvatarChangeModal = ({
  show,
  onPhotoUpload,
  onRemovePhoto,
  onHide
}) => (
  <Modal centered show={show} onHide={onHide}>
    <Modal.Header>
      <Modal.Title className="w-100">
        <h1>Change Profile Photo</h1>
      </Modal.Title>
    </Modal.Header>
    <Modal.Body className="photo-change-body">
      <Link onClick={onPhotoUpload}>
        Upload New Photo
      </Link>
      <div className="border-thin" />
      <Link onClick={onRemovePhoto} className="remove">
        Remove Current Photo
      </Link>
      <div className="border-thin" />
      <Link onClick={onHide}>
        Cancel
      </Link>
    </Modal.Body>
  </Modal>
);

export default function UserAvatarEditor({
  user,
  onUpdate,
  onRemove,
  requesting,
  className
}) {
  const avartarInputRef = useRef(null);

  const [photo, setPhoto] = useState(null);

  const [showPhotoEdit, setShowPhotoEdit] = useState(false);

  const [showPhotoChange, setShowPhotoChange] = useState(false);

  const handlePhotoChange = useCallback(event => {
    const file = event.target.files[0];
    setPhoto(file);
    setShowPhotoEdit(true);
    event.target.value = null
  }, [])

  const handleProfilePhoto = useCallback(() => {
    if (user.photo) {
      setShowPhotoChange(true);
    } else {
      avartarInputRef.current.click();
    }
  }, [user.photo])

  const handleAvatarEditModalHide = useCallback(() => setShowPhotoEdit(false), [])

  const handleAvatarChangeModalHide = useCallback(() => setShowPhotoChange(false), [])

  const handlePhotoUpload = useCallback(() => avartarInputRef.current.click(), [])

  const handleRemovePhoto = useCallback(() => {
    setShowPhotoChange(false);
    onRemove()
  }, [onRemove])

  const handleUpdateAvatar = useCallback(data => {
    setShowPhotoChange(false)
    onUpdate(data)
  }, [onUpdate])

  return (
    <div className={clsx("user-components-user-avatar-editor", className)}>
      <UserAvatar user={user} size="lg" />
      <div className="upload-photo">
        <input
          hidden
          ref={avartarInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
        />
        <Button
          variant="link"
          className="d-flex align-items-center m-auto"
          disabled={requesting}
          onClick={handleProfilePhoto}
        >
          {requesting && (
            <FontAwesomeIcon icon={faSpinnerThird} className="mrm-mr-0_75" size="xs" spin />
          )}
          {user.photo ? 'Change Profile Photo' : 'Add Profile Photo'}
        </Button>
      </div>

      <AvatarEditModal
        show={showPhotoEdit}
        photo={photo}
        onHide={handleAvatarEditModalHide}
        onUpdate={handleUpdateAvatar}
        uploadFileName={`photo_${user.id}.jpg`}
      />

      <AvatarChangeModal
        show={showPhotoChange}
        onPhotoUpload={handlePhotoUpload}
        onRemovePhoto={handleRemovePhoto}
        onHide={handleAvatarChangeModalHide}
      />
    </div>
  );
};

UserAvatarEditor.propTypes = {};
UserAvatarEditor.defaultProps = {};
