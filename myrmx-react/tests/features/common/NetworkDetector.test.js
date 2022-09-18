import React from 'react';
import { shallow } from 'enzyme';
import { NetworkDetector } from '../../../src/features/common/NetworkDetector';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<NetworkDetector />);
  expect(renderedComponent.find('.common-network-detector').length).toBe(1);
});
