import React, { useCallback, useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import 'rc-slider/assets/index.css';

import { Loader } from '../common';
import { useUnauthorizedErrorHandler } from '../../common/apiHelpers';

import { useFetchUser } from './redux/hooks';
import ProfileForm from './components/ProfileForm';
import ProfileView from './components/ProfileView';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const { user, fetchUser } = useFetchUser();

  const unauthorizedErrorHandler = useUnauthorizedErrorHandler();
  const fetchUserHandlingErrors = useCallback(() => {
    fetchUser().catch(unauthorizedErrorHandler);
  }, [fetchUser, unauthorizedErrorHandler]);

  useEffect(() => fetchUserHandlingErrors(), [ fetchUserHandlingErrors ]);

  if (!user) {
    return <Loader />
  }

  const toggleEditUser = () => setIsEditing(!isEditing);

  return (<div className="user-profile-page">
    {!isEditing && <ProfileView user={user} onEdit={toggleEditUser} />}
    {isEditing && <ProfileForm
      user={user}
      onCancelEdit={toggleEditUser}
      onProfileSaved={() => {
        setIsEditing(false);
        fetchUserHandlingErrors();
      }}
    />}
  </div>);
}

ProfilePage.propTypes = {};
ProfilePage.defaultProps = {};
