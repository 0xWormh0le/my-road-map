import React from 'react';
// import PropTypes from 'prop-types';
import { Offline, Online } from 'react-detect-offline';

export const NetworkDetector = ({ children }) => (
  <>
    <Online>{children}</Online>
    <Offline>
      <div className="common-network-detector">
        <h2 className="mrm-mb-1 text-center">
          You're offline
        </h2>
        <p className="offline-description">
          Connect to the internet, then give it another shot.
        </p>
      </div>
    </Offline>
  </>
)

export default Comp => props =>
  <NetworkDetector><Comp {...props} /></NetworkDetector>

NetworkDetector.propTypes = {};
NetworkDetector.defaultProps = {};
