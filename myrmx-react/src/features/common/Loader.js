import React, { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
// import PropTypes from 'prop-types';

import Spinner from 'react-bootstrap/Spinner';

const Loader = ({ delay, label, position, className }) => {
  // center can be either 'area' or 'screen'

  const [show, setShow] = useState(!delay)

  useEffect(() => {
    if (delay) {
      const timer = setTimeout(() => setShow(true), 300)
      return () => clearTimeout(timer)
    }
  }, [delay])

  const pos = useMemo(() => {
    if (position === 'local') {
      return 'local-center'
    } else if (position === 'static') {
      return ''
    } else {
      return 'screen-center'
    }
  }, [position])

  if (!show) {
    return null
  }

  return (
    <div className={clsx("common-loader", pos, className)}>
      <div className="m-auto">
        {label && (
          <p>{label}</p>
        )}
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    </div>
  )
}

export default Loader

Loader.propTypes = {};
Loader.defaultProps = {};
