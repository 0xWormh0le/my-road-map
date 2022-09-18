import React from 'react';
import { shallow } from 'enzyme';
import { Loader } from '../../../src/features/common';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<Loader />);
  expect(renderedComponent.find('.common-loader').length).toBe(1);
});
