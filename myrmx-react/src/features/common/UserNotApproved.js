import React from 'react';
import { Link, Redirect } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandPaper } from '@fortawesome/pro-light-svg-icons';
import { useFetchAuthToken } from '../home/redux/hooks';
export default function UserNotApproved() {
  const { userApproved } = useFetchAuthToken();

  if (userApproved) {
    return <Redirect to="/dashboard" />
  }

  return (
    <div className="container">
      <div className="common-user-not-approved">
        <FontAwesomeIcon icon={faHandPaper} className="theme-text-primary m-auto d-block" size='4x' />
        <h1 className="text-center mt-3">Not approved</h1>
        <h2 className="text-center font-weight-normal px-2 mt-3 ">
          To be able to use this software, you first need to be approved. But you can still edit 
          <Link to={'/user/profile'}>
            your profile.
          </Link>
        </h2>
      </div>
    </div>
  );
};

UserNotApproved.propTypes = {};
UserNotApproved.defaultProps = {};
