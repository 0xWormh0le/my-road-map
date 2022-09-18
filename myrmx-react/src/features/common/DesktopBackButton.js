import React, { useCallback } from 'react';
// import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowLeft } from '@fortawesome/pro-solid-svg-icons';
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';
import useEffectiveBackLink from './useEffectiveBackLinkHook';

export default function DesktopBackButton({className, defaultBackLink}) {
  const history = useHistory();
  const effectiveBackLink = useEffectiveBackLink(defaultBackLink);
  const buttonOnClick = useCallback(
    () => history.push(effectiveBackLink),
    [history, effectiveBackLink],
  );

  return (
    <div className={clsx("common-desktop-back-button", className)} onClick={buttonOnClick}>
      <FontAwesomeIcon icon={faLongArrowLeft} />
    </div>
  );
};

DesktopBackButton.propTypes = {};
DesktopBackButton.defaultProps = {};
