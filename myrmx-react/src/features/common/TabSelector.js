import React from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom'
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// import PropTypes from 'prop-types';

const TabSelector = ({ className, activeTab, onTabChange, tabs }) => {
  const sliderWidth = 100 / tabs.length
  const sliderLeft = sliderWidth * tabs.findIndex(t => t.key === activeTab)
  return (
    <Row className={clsx('tab-selector', className)}>
      <Col>
        <Nav justify variant="pills" activeKey={activeTab} >
          {tabs.map(({ key, label, dot, to }) => (
            <Nav.Item key={key} className={`m-auto ${dot && 'd-flex align-items-center'}`}>
              {dot && (
                <span className="dot float-left" />
              )}
              <Nav.Link
                eventKey={key}
                onSelect={onTabChange}
                as={to ? Link : undefined}
                to={to}
              >
                {label}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
        <div className="slider-container">
          <div
            className='slider'
            style={{
              width: `${sliderWidth}%`,
              left: `${sliderLeft}%`
            }}
          />
        </div>
      </Col>
    </Row>
  )
}

export default TabSelector;

TabSelector.propTypes = {};
TabSelector.defaultProps = {};
