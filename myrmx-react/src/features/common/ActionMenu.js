import React from 'react';
import { Link } from 'react-router-dom'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import capitalize from 'lodash/capitalize';
import clsx from 'clsx';
import UserAvatar from './UserAvatar';
// import PropTypes from 'prop-types';

const ActionMenu = ({ show, onHide, items }) => (
<>
  <Modal
    className="common-action-menu modal-mobile-slide-from-bottom d-lg-none"
    show={show}
    onHide={onHide}
  >
    <Modal.Body className="text-center p-0">
      <div className="bg-white border-rounded">
        {items.map(({ user, to, label, className, ...other }, key) => (
          <React.Fragment key={key}>
            {user ? (
              <div className="mrm-py-0_75 d-flex justify-content-center align-items-center">
                <UserAvatar user={user} className="avatar" size="sm" />
                <strong className="mrm-ml-0_5">
                  {capitalize(user.first_name)}&nbsp;
                  {capitalize(user.last_name)}
                </strong>
              </div>
            ) : to ? (
              <Link to={to} {...other}>
                <Button className={clsx("btn-menu-item w-100", className)} variant="white">
                  {label}
                </Button>
              </Link>
            ) : (
              <Button
                className={clsx("btn-menu-item w-100", className)}
                variant="white"
                {...other}
              >
                {label}
              </Button>
            )}
            {key < items.length - 1 && (
              <div className="border-thin" />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="bg-white mrm-mt-0_5 border-rounded">
        <Button className="btn-menu-item w-100" variant="white" onClick={onHide}>
          Cancel
        </Button>
      </div>
    </Modal.Body>
  </Modal>

  <Modal
    className="common-action-menu modal-desktop-open-center d-none d-lg-block"
    show={show}
    onHide={onHide}
    centered
  >
  <Modal.Body className="text-center p-0">
    <div className="bg-white top-body">
      {items.map(({ user, to, label, className, ...other }, key) => (
        <React.Fragment key={key}>
          {user ? (
            <div className="mrm-py-0_75 d-flex justify-content-center align-items-center">
              <UserAvatar user={user} className="avatar" size="sm" />
              <strong className="mrm-ml-0_5">
                {capitalize(user.first_name)}&nbsp;
                {capitalize(user.last_name)}
              </strong>
            </div>
          ) : to ? (
            <Link to={to} {...other}>
              <Button className={clsx("btn-menu-item w-100", className)} variant="white">
                {label}
              </Button>
            </Link>
          ) : (
            <Button
              className={clsx("btn-menu-item w-100", className)}
              variant="white"
              {...other}
            >
              {label}
            </Button>
          )}
          {key < items.length - 1 && (
            <div className="border-thin" />
          )}
        </React.Fragment>
      ))}
    </div>
    <Button className="btn-menu-item cancel w-100" variant="white" onClick={onHide}>
        Cancel
    </Button>
    <div className="bg-white mrm-mt-0_5 border-rounded">

    </div>
  </Modal.Body>
  </Modal>
</>

)

export default ActionMenu

ActionMenu.propTypes = {};
ActionMenu.defaultProps = {};
