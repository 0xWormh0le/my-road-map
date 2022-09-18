import React from 'react';
import { Link } from 'react-router-dom';
// import PropTypes from 'prop-types';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faTimes } from '@fortawesome/pro-regular-svg-icons';
import clsx from 'clsx';

import useEffectiveBackLink from './useEffectiveBackLinkHook';

export default function Header({
  border,
  children,
  colSizes,
  icon: iconName,
  renderThirdColumn,
  thirdColumnClass,
  title,
  dropDownMenu,
  className,
  defaultBackLink,
  renderBackLink,
}) {
  const effectiveBackLink = useEffectiveBackLink(defaultBackLink);

  let icon;
  switch (iconName) {
    case 'back':
      icon = faChevronLeft;
      break;
    case 'close':
      icon = faTimes;
      break;
    default:
      icon = null;
      break;
  }

  function renderHeader() {

    return <div className={clsx("common-header d-lg-none", className)}>
      <Row>
        <Col xs={colSizes ? colSizes[0] : 1} className="back-link-container">
          {renderBackLink ? renderBackLink(effectiveBackLink) :
            effectiveBackLink ? (
              <Link to={effectiveBackLink}>
                {icon && <FontAwesomeIcon icon={icon} />}
              </Link>
            ) : null
          }
        </Col>
        <Col xs={colSizes ? colSizes[1] : 10}>
          {title  && (
            dropDownMenu ? dropDownMenu() : <h1>{title}</h1> 
          )}
        </Col>
        {renderThirdColumn && (
          <Col xs={colSizes ? colSizes[2] : 1} className={clsx({[thirdColumnClass]: !!thirdColumnClass})}>
            {renderThirdColumn()}
          </Col>
        )}
        </Row>
        {children}
        {border && <Row className="border-bottom-header full" />}
      </div>
  }

  return (
    <div className="common-header-container">
      <div className="static-placeholder">
        {renderHeader()}
      </div>
      <div className="fixed-actual-header">
        {renderHeader()}
      </div>
    </div>
  );
}

Header.propTypes = {};
Header.defaultProps = {};
