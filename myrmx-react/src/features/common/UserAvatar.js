import React from 'react';
import clsx from 'clsx';
import { getUserInitials } from './uiHelpers';
// import PropTypes from 'prop-types';

const sizes = {
  xl: 'xlarge',
  lg: 'large',
  sm: 'small',
  xs: 'xsmall'
}

export default function UserAvatar(props) {
  const { user, size, className, children } = props;
  const initials = getUserInitials(user);

  return (
    <div className={clsx("common-user-avatar", className)}>
      {user && user.photo &&
        <div className={`profile-photo ${sizes[size]}`}>
          <img src={user.photo} alt="user-avatar" />
        </div>
      }
      {user && !user.photo &&
        <div className={`initials md mx-auto ${sizes[size]}`}>
          <span>{initials}</span>
        </div>
      }
      {!user && 
        <div className={`initials md mx-auto ${sizes[size]}`} />
      }
      {children}
    </div>
  );
};

UserAvatar.propTypes = {};
UserAvatar.defaultProps = {};
