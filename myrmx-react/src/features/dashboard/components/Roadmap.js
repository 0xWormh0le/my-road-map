import React from 'react';
import Card from 'react-bootstrap/Card';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/pro-regular-svg-icons';
import dayjs from 'dayjs'

import raiseHandIcon from '../../../images/icons/raise-hand.svg';

// import PropTypes from 'prop-types';

const Roadmap = ({ data, unseen, className, ...other }) => (
  <Card {...other} className={clsx("dashboard-roadmap-card", className)}>
    <Card.Body className="mrm-p-0_5">
      {unseen && (
        <span className="roadmap-dot dot float-left" />
      )}
      <p className="title mb-0 theme-text-normal">{data.title}</p>
      <div className="progress mrm-my-0_5">
        <div className="progress-bar" style={{ width: `${data.progress}%`}} />
      </div>
      <div className="d-flex">
        <div className="flex-grow-1">
          {data.red_assessments_count > 0 && (
            <span className="item-count red-count mt-0">
              <img src={raiseHandIcon} alt="" />
              {data.red_assessments_count}
            </span>
          )}
          {data.approval_pending_items_count > 0 && (
            <span className="item-count gray-count mt-0">
              <FontAwesomeIcon icon={faClock} size="xs" className="mrm-mr-0_25" />
              {data.approval_pending_items_count}
            </span>
          )}
          {data.progress > 0 && (
            <span className="item-count gray-count mt-0">
              {data.progress.toFixed()}%
            </span>
          )}
        </div>
        {data.started_on && (
          <p className="started-date my-auto theme-text-light">
              Started on:&nbsp;
              {dayjs(data.started_on).format('MMM D, YYYY')}
          </p>
        )}
      </div>
    </Card.Body>
  </Card>
)

export default Roadmap

Roadmap.propTypes = {};
Roadmap.defaultProps = {};
