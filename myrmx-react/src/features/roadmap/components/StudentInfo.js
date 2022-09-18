import React from 'react';
import UserAvatar from '../../common/UserAvatar';
// import PropTypes from 'prop-types';

export default function StudentInfo({ student }) {
  if (!student) return null;

  return (<div className="roadmap-components-student-info">
    <UserAvatar user={student} size='sm' className="mr-2" />
    <strong>{student.first_name} {student.last_name}</strong>
  </div>);
};

StudentInfo.propTypes = {};
StudentInfo.defaultProps = {};
